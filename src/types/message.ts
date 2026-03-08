import { ModalElement } from "./modal";
import { BatchGetRanges, BatchGetResponse } from "./sheet";

type AuthCheckMessage = { type: "AUTH_CHECK" };
type AuthConnectMessage = { type: "AUTH_CONNECT" };
type LoadSheetMessage = { type: "LOAD_SHEET", ranges: Array<string> };
type OpenModalMessage = { type: "OPEN_MODAL", modalElement: ModalElement };
type CloseModalMessage = { type: "CLOSE_MODAL" };
type ImportToCalendarMessage = { type: "IMPORT_TO_CALENDAR", sheetData: BatchGetResponse };
export type ExtensionMessage = AuthCheckMessage | AuthConnectMessage | LoadSheetMessage | OpenModalMessage | CloseModalMessage | ImportToCalendarMessage;

export type AuthResponse = {
    ok: boolean,
    connected: boolean,
    error?: string
}
export type LoadSheetResponse = {
    ok: boolean,
    connected: boolean,
    error?: string,
    sheetData: BatchGetResponse,
}

export type ModalResponse = {
    ok: boolean,
    error?: string
}

export type ImportToCalendarResponse = {
    ok: boolean,
    connected: boolean,
    error?: string
    deletedCount: number,
    createdCount: number
}

export type GetAuthTokenResult = chrome.identity.GetAuthTokenResult;
