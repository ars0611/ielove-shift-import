export type BatchGetResponse = {
    spreadSheetId: string,
    valueRanges: Array<{
        range: string,
        majorDimension: string,
        values: (string | number)[][]
    }>
};

export type SpreadsheetMetaResponse = {
    sheets?: Array<{
        properties?: {
            sheetId?: number;
            title?: string;
        };
    }>;
};

export type SheetData = Array<Array<string | number>>;
