import type { LoadSheetResponse } from "@/types/message";

/**
 * background.tsにスプレッドシートの読み込みの開始を依頼する
 * @remarks `chrome.runtime.sendMessage` で `{ type: "LOAD_SHEET" }` を送信し、backgroud.tsからの応答を `LoadSheetResponse`として扱う
 * @returns スプレッドシートの読み込みの結果を表すレスポンス
 */
export async function requestLoadSheet(): Promise<LoadSheetResponse> {
    const res = await chrome.runtime.sendMessage({ type: "LOAD_SHEET" });
    return res as LoadSheetResponse;
}
