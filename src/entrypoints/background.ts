import { checkGoogleAuth, connectGoogleAuth, getAccessToken } from "@/lib/authService";
import { getValues } from "@/lib/loadSheetService";
import type { ExtensionMessage, AuthCheckMessage, AuthConnectMessage, LoadSheetMessage } from "@/types/message";
/**
 * @remarks
 * - runtimeメッセージを受け取り、認証チェックや認証を実行する
 * - `sendMessage` を非同期で呼ぶため, trueを返す（よくわからんがdocumentにそう書いてた）
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
                // UI非表示でGoogle認証済みかチェック
                if (message.type === "AUTH_CHECK") {
                    const connected = await checkGoogleAuth();
                    sendResponse({ ok: true, connected, error: connected ? undefined : "認証に失敗しました" });
                    return;
                }
                // UI表示してGoogle認証
                else if (message.type === "AUTH_CONNECT") {
                    const connected = await connectGoogleAuth();
                    sendResponse({ ok: true, connected, error: connected ? undefined : "認証に失敗しました" });
                    return;
                }
                // スプレッドシートの読み込み
                else if (message.type === "LOAD_SHEET") {
                    const token = await getAccessToken();
                    const sheetData = await getValues(token, "1Ze0zgNq1bat0znE_Yt9x9Bh0ezVyZRpROrCW6AKMUCc");
                    const connected = !!sheetData;
                    sendResponse({ ok: true, connected, error: connected ? undefined : "シートの読み込みに失敗しました", sheetData });
                    return;
                }
                // 嘘のメッセージが来たらエラー
                sendResponse({ ok: false, connected: false, error: "無効なメッセージです" })
            } catch (e) {
                sendResponse({
                    ok: false,
                    connected: false,
                    error: e instanceof Error ? e.message : String(e)
                });
            }
        })();
        return true;
    });
})
