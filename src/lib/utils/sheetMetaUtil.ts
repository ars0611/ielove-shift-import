import { BatchGetResponse, SheetData, SpreadsheetMetaResponse } from "@/types/sheet";

type GetTitleByGidProps = {
    sheetJson: SpreadsheetMetaResponse,
    gid: number
}

/**
 * type SpreadsheetMetaResponse のjsonを用いてgidからシートタイトルを取得する
 * @param sheetJson json
 * @param gid urlから取得したgid
 * @returns gidに一致するシートのタイトル
 * @throws dataに存在しないgidだった場合、一致するシートがないのでエラー
 */
export function getTitleByGid({ sheetJson, gid }: GetTitleByGidProps): string {
    // data.sheet.propertiesの要素のsheetIdにgidと一致するものがあるか探す
    const hit = (sheetJson.sheets ?? []).find(
        sheet => sheet.properties?.sheetId === gid && typeof sheet.properties.title === "string"
    );

    if (!hit?.properties?.title) {
        throw new Error(`gid=${gid} に一致するシートタイトルが見つかりませんでした`);
    }

    return hit.properties.title;
}

/**
 * セルに入力された時刻をhh:mm形式に整形する（24h）
 * @remarks セルの入力値が正しい前提で使用
 * @param cell :string | number セルに入力された時刻
 * @returns `timeLabel`: string セル値の時刻を整形する（例: 10.5 -> 10:30）
 */
export function toTimeLabel(cell: string | number): string {
    // 入力値が空の場合
    if (cell === '') { return ''; }

    // numberにキャスト
    if (typeof cell === "string") {
        const parsed = Number(cell);
        if (Number.isNaN(parsed)) { return ''; }
        cell = parsed;
    }

    // 分に直してから時刻を再計算
    const totalMinutes = cell * 60;
    const hour = Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;

    // 分を0埋めして返す
    return `${hour}:${String(minute).padStart(2, '0')}`;
}

/**
 * batchgetで得たセル値を二次元配列に整形する
 * @param sheetJson json
 * @returns 二次元配列（例: `[[A8:A35の各セルの値], [Z8:Z35の各セルの値], [AA8:AA35の各セルの値]]`）
 */
export function parseBatchGetResponse(sheetJson: BatchGetResponse): SheetData {
    const cols = sheetJson.valueRanges.map(v => v.values?.[0] ?? [] as Array<number | string>);
    return cols;
}
