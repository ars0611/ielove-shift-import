import { ModalElement } from "@/types/modal";

/**
 * content.ts にモーダルのUIの表示を依頼する
 * @param modalElement モーダルに表示したいコンポーネントの種類
 * @param payload modalElementを表示するために必要なデータ
 * @returns 
 */
export async function requestOpenModal(modalElement: ModalElement) {
    await chrome.runtime.sendMessage({ type: "OPEN_MODAL", modalElement: modalElement });
    return;
}

/**
 * content.ts にモーダルのUIの非表示を依頼する
 * @returns 
 */
export async function requestCloseModal() {
    await chrome.runtime.sendMessage({ type: "CLOSE_MODAL" });
    return;
}
