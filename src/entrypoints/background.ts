import { checkGoogleAuth, connectGoogleAuth, getAccessToken } from "@/lib/services/authService";
import { fetchTitlesAndSpreadsheetId, fetchValues } from "@/lib/services/loadSheetService";
import { getCurrentTabId, getCurrentTabUrl } from "@/lib/services/tabService";
import { getGid, getSpreadsheetId } from "@/lib/utils/translateSheetUrlUtil";
import { getTitleByGid } from "@/lib/utils/sheetMetaUtil";
import { validateBatchGetResponse, validateRangesForBatchGet } from "@/lib/utils/validation";
import type { ExtensionMessage } from "@/types/message";

/**
 * @remarks runtimeメッセージを受け取り、認証チェックや認証を実行する
 * @remarks `sendMessage` を非同期で呼ぶため, trueを返す（よくわからんがdocumentにそう書いてた）
 */
export default defineBackground(() => {
    /**
     * popupからのメッセージを処理する
     * 
     * @param message 受信メッセージ
     * @param sender 送信元の情報
     * @param sendResponse 呼び出し元に応答
     * @returns 非同期応答のため, true
     */
    chrome.runtime.onMessage.addListener((message: ExtensionMessage, sender, sendResponse) => {
        (async () => {
            try {
                if (message.type === "AUTH_CHECK") {
                    // UI非表示でGoogle認証済みかチェックする処理
                    const connected = await checkGoogleAuth();
                    sendResponse({ ok: true, connected, error: connected ? undefined : "認証に失敗しました" });
                    return;

                } else if (message.type === "AUTH_CONNECT") {
                    // Google認証済みかチェックし、未認証であれば認証ページへ遷移させる処理
                    const connected = await connectGoogleAuth();
                    sendResponse({ ok: true, connected, error: connected ? undefined : "認証に失敗しました" });
                    return;

                } else if (message.type === "LOAD_SHEET") {
                    // スプレッドシートを読み込む処理
                    // batchgetで扱うrangesのバリデーション
                    const ranges = message.ranges;
                    const validateRangesForBatchGetRes = validateRangesForBatchGet(ranges);
                    if (!validateRangesForBatchGetRes.ok) {
                        sendResponse({ ok: false, connected: true, error: validateRangesForBatchGetRes.error });
                        return;
                    }

                    // sheetsAPIを叩くのに必要なOAuth2認証トークンを取得
                    const accessToken = await getAccessToken();
                    // sheetsAPIを叩くのに必要なパラメータを取得
                    const currentTabUrl = await getCurrentTabUrl();
                    const spreadsheetId = getSpreadsheetId(currentTabUrl);
                    const gid = getGid(currentTabUrl);
                    const sheetJson = await fetchTitlesAndSpreadsheetId({ accessToken, spreadsheetId });
                    const title: string = getTitleByGid({ sheetJson, gid });

                    // batchgetで得たレスポンスに対してバリデーション
                    const sheetDataByBatchget = await fetchValues({ accessToken, spreadsheetId, title, ranges });
                    const validateBatchGetResponseRes = validateBatchGetResponse(sheetDataByBatchget);
                    if (!validateBatchGetResponseRes.ok) {
                        sendResponse({ ok: false, connected: true, error: validateBatchGetResponseRes.error });
                        return;
                    }

                    // popupにbatchgetのレスポンスを返す
                    sendResponse({ ok: true, connected: true, sheetData: sheetDataByBatchget });
                    return;

                } else if (message.type === "OPEN_MODAL") {
                    // モーダルを開く処理
                    const tabId = await getCurrentTabId();
                    const tabRes = await chrome.tabs.sendMessage(tabId, message);
                    sendResponse({ ok: tabRes.ok });
                    return;

                } else if (message.type === "CLOSE_MODAL") {
                    // モーダルを閉じる処理
                    const tabId = await getCurrentTabId();
                    const tabRes = await chrome.tabs.sendMessage(tabId, message);
                    sendResponse({ ok: tabRes.ok });
                    return;

                } else if (message.type === "IMPORT_TO_CALENDAR") {
                    // カレンダーに予定を取り込む処理
                    // calendarAPIを叩くのに必要なOAuth2認証トークンを取得
                    const accessToken = await getAccessToken();
                    sendResponse({ ok: true, connected: true });
                    return;
                }

                // 嘘のメッセージが来たらエラー
                sendResponse({ ok: false, connected: false, error: "無効なメッセージです" })

            } catch (e) {
                sendResponse({ ok: false, connected: false, error: e instanceof Error ? e.message : String(e) });
            }
        })();

        return true;
    });
})
