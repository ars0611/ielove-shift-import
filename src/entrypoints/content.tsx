import { ConfirmationModal } from "@/components/elements/confirmationModal";
import { ExtensionMessage } from "@/types/message";
import { SheetData } from "@/types/sheet";
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import tailwindCss from "/popup/style.css?inline"; // tailwindcss有効化

function ModalHost() {
    const [open, setOpen] = useState<boolean>(false);
    const [sheetData, setSheetData] = useState<SheetData>([[], [], []]);
    useEffect(() => {
        const listener = (message: ExtensionMessage) => {
            if (message.type === "OPEN_MODAL") {
                setSheetData(message.sheetData);
                setOpen(true);
            } else if (message.type === "CLOSE_MODAL") {
                setOpen(false);
            }
        };

        chrome.runtime.onMessage.addListener(listener);
        return () => chrome.runtime.onMessage.removeListener(listener);
    }, []);

    return (
        <ConfirmationModal
            open={open}
            sheetData={sheetData}
            onCancel={() => setOpen(false)}
            onImport={() => { }}
        />
    );
}

export default defineContentScript({
    matches: ["https://docs.google.com/*"],
    cssInjectionMode: "ui",
    async main(ctx) {
        const ui = await createShadowRootUi(ctx, {
            name: "shift-importer-modal",
            position: "modal",
            anchor: "body",
            css: tailwindCss, // Shadow DOMへTailwind注入
            onMount(container) {
                const wrapper = document.createElement("div");
                container.append(wrapper);
                const root = createRoot(wrapper);
                root.render(<ModalHost />);
                return { root, wrapper }
            },
            onRemove(elements) {
                elements?.root.unmount();
                elements?.wrapper.remove();
            },
        });
        ui.mount();
    },
});
