export type AuthCheckMessage = { type: "AUTH_CHECK" };
export type AuthConnectMessage = { type: "AUTH_CONNECT" };
export type LoadSheetMessage = { type: "LOAD_SHEET", ranges: Array<string> };

export type ExtensionMessage = AuthCheckMessage | AuthConnectMessage | LoadSheetMessage;

export type AuthResponse = {
    ok: boolean,
    connected: boolean,
    error?: string
}
export type LoadSheetResponse = {
    ok: boolean,
    connected: boolean,
    error?: string,
    sheetData: Array<Array<string | number>>,
}
export type GetAuthTokenResult = chrome.identity.GetAuthTokenResult;
