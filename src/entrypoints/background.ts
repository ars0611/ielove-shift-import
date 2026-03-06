import { checkGoogleAuth, connectGoogleAuth, getAccessToken } from "@/lib/services/authService";
import { fetchTitlesAndSpreadsheetId, fetchValues } from "@/lib/services/loadSheetService";
import { getCurrentTabId, getCurrentTabUrl } from "@/lib/services/tabService";
import { getGid, getSpreadsheetId } from "@/lib/utils/translateSheetUrlUtil";
import { getTitleByGid, parseBatchGetResponse } from "@/lib/utils/sheetMetaUtil";
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
                    const ranges = message.ranges ?? [[]];
                    // sheetsAPIを叩くのに必要なOAuth2認証トークンを取得
                    const accessToken = await getAccessToken();
                    const currentTabUrl = await getCurrentTabUrl();
                    const spreadsheetId = getSpreadsheetId(currentTabUrl);
                    const gid = getGid(currentTabUrl);
                    const sheetJson = await fetchTitlesAndSpreadsheetId({ accessToken, spreadsheetId });
                    const title: string = getTitleByGid({ sheetJson, gid });
                    const sheetDataByBatchget = await fetchValues({ accessToken, spreadsheetId, title, ranges });
                    const sheetData = parseBatchGetResponse(sheetDataByBatchget);
                    const connected = !!sheetData;
                    sendResponse({ ok: true, connected, error: connected ? undefined : "シートの読み込みに失敗しました", sheetData });
                    return;

                } else if (message.type === "OPEN_MODAL") {
                    // モーダルを開く処理
                    const tabId = await getCurrentTabId();
                    await chrome.tabs.sendMessage(tabId, message);
                    return;

                } else if (message.type === "CLOSE_MODAL") {
                    // モーダルを閉じる処理
                    const tabId = await getCurrentTabId();
                    await chrome.tabs.sendMessage(tabId, message);
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
