import { getCurrentTabID } from "../services/tabService"

/**
 * 
 * @param tabId 
 * @returns 
 */
export async function requestOpenModal(tabId: number) {
    if (!tabId) { return }
    await browser.tabs.sendMessage(tabId, { type: "OPNE_MODAL" });
}

export async function requestCloseModal(tabId: number) {
    if (!tabId) { return }
    await browser.tabs.sendMessage(tabId, { type: "OPNE_MODAL" });
}
