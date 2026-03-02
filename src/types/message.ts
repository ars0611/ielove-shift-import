import { SheetData } from "./sheet";

type PreviewRow = { date: string, clockIn: string, clockOut: string };

type AuthCheckMessage = { type: "AUTH_CHECK" };
type AuthConnectMessage = { type: "AUTH_CONNECT" };
type LoadSheetMessage = { type: "LOAD_SHEET", ranges: Array<string> };
type OpenModalMessage = { type: "OPEN_MODAL", sheetData: SheetData }
type CloseModalMessage = { type: "CLOSE_MODAL" }
export type ExtensionMessage = AuthCheckMessage | AuthConnectMessage | LoadSheetMessage | OpenModalMessage | CloseModalMessage;

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
