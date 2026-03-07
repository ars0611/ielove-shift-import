import { ModalResponse } from "@/types/message";
import { ModalElement } from "@/types/modal";

/**
 * background.tsにモーダルを開くよう依頼する
 * @remarks `chrome.runtime.sendMessage` で `{ type: "OPEN_MODAL" }` を送信し、backgroud.tsからの応答を `ModalResponse`として扱う
 * @returns モーダル制御の結果を表すレスポンス
 */
export async function requestOpenModal(modalElement: ModalElement): Promise<ModalResponse> {
    const res = await chrome.runtime.sendMessage({ type: "OPEN_MODAL", modalElement: modalElement });
    return res;
}

/**
 * background.tsにモーダルを閉じるよう依頼する
 * @remarks `chrome.runtime.sendMessage` で `{ type: "CLOSE_MODAL" }` を送信し、backgroud.tsからの応答を `ModalResponse`として扱う
 * @returns モーダル制御の結果を表すレスポンス
 */
export async function requestCloseModal(): Promise<ModalResponse> {
    const res = await chrome.runtime.sendMessage({ type: "CLOSE_MODAL" });
    return res;
}
