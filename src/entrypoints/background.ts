import { checkGoogleAuth, connectGoogleAuth } from "@/lib/authService";
import type { ExtensionMessage } from "@/types/message";
/**
 * @remarks
 * - runtimeメッセージを受け取り、認証チェックや認証を実行する
 * - `sendMessage` を非同期で呼ぶため, trueを返す（よくわからんがdocumentにそう書いてた）
 */
export default defineBackground(() => {
    /**
     * popupなどからの認証メッセージを処理する
     * 
     * @param message 受信メッセージ
     * @param sender 送信元の情報（使わない）
     * @param sendResponse 呼び出し元に応答
     * @returns 非同期応答のため, true
     */
    chrome.runtime.onMessage.addListener((message: ExtensionMessage, sender, sendResponse) => {
        (async () => {
            try {
                if (message.type === "AUTH_CHECK") {
                    const connected = await checkGoogleAuth();
                    sendResponse({ ok: true, connected });
                    return;
                }
                if (message.type === "AUTH_CONNECT") {
                    const connected = await connectGoogleAuth();
                    sendResponse({ ok: true, connected, error: connected ? undefined : "認証に失敗しました" });
                    return;
                }
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
