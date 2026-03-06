import { ExtensionMessage } from "@/types/message";
import { createRoot, Root } from "react-dom/client";
import tailwindCss from "@/entrypoints/popup/style.css?inline"; // tailwindcss有効化
import { ModalSection } from "@/components/sections/modalSection";
import { ModalElement } from "@/types/modal";

/** タブ上にモーダル用UIをマウントするcontent script */
export default defineContentScript({
    matches: ["https://docs.google.com/*"],
    cssInjectionMode: "ui",
    /**
     * 
     * @param ctx WXTが扱うcontent script実行コンテキスト
     */
    async main(ctx) {
        let mounted = false;
        let currentModalElement: ModalElement = {
            type: "SHIFT_CELL",
            payload: [[]]
        }
        let rootRef: Root | null = null;

        function renderModal(): void {
            if (!rootRef) { return; }
            rootRef.render(<ModalSection modalElement={currentModalElement} />)
        }

        function closeModal(): void {
            if (!mounted) { return; }
            ui.remove();
            mounted = false;
            rootRef = null;
        }

        function openModal(modalElement: ModalElement): void {
            currentModalElement = modalElement;
            if (!mounted) {
                ui.mount();
                mounted = true;
                return;
            }
            renderModal();
        }

        const ui = await createShadowRootUi(ctx, {
            name: "shift-importer-modal",
            position: "modal",
            anchor: "body",
            css: tailwindCss, // Shadow DOMへTailwind注入
            onMount(container) {
                const wrapper = document.createElement("div");
                container.append(wrapper);
                const root = createRoot(wrapper);
                rootRef = root;
                renderModal();
                return { root, wrapper }
            },
            onRemove(elements) {
                elements?.root.unmount();
                elements?.wrapper.remove();
            },
        });
        chrome.runtime.onMessage.addListener((message: ExtensionMessage) => {
            if (message.type === "OPEN_MODAL") {
                openModal(message.modalElement);
                return;
            } else if (message.type === "CLOSE_MODAL") {
                closeModal();
            }
        })
    },
});
