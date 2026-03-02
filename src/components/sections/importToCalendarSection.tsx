import { getCurrentTabID } from "@/lib/services/tabService";
import { SheetData } from "@/types/sheet"

type ImportToCalendarSectionProp = {
    sheetData: SheetData
}

export function ImportToCalendarSection({ sheetData }: ImportToCalendarSectionProp) {
    async function handleOpenModal() {
        const tabId = await getCurrentTabID();
        await chrome.tabs.sendMessage(tabId, { type: "OPEN_MODAL", sheetData });
    };

    const isDisabled = sheetData[0]?.length === 0;

    return (
        <section className="mt-4">
            <button
                type="button"
                onClick={handleOpenModal}
                disabled={isDisabled}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
                取り込み確認モーダルを開く
            </button>
        </section>
    );
}
