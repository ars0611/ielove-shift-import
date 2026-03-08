import { ImportToCalendarResponse } from "@/types/message";
import { BatchGetResponse } from "@/types/sheet";

/**
 * background.tsに予定の作成の開始を依頼する
 * @remarks `chrome.runtime.sendMessage` で `{ type: "IMPORT_TO_CALENDAR" }` を送信し、backgroud.tsからの応答を `ImportToCalendarResponse`として扱う
 * @returns :ImportToCalendarResponse backgroudから返ってくるメッセージ
 */
export async function requestImportToCalendar(sheetData: BatchGetResponse): Promise<ImportToCalendarResponse> {
    const res = await chrome.runtime.sendMessage({ type: "IMPORT_TO_CALENDAR", sheetData });
    return res;
}

