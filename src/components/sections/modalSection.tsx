import { ModalElement } from "@/types/modal";
import { SheetData } from "@/types/sheet";
import { CancelButton, TriggerButton } from "../elements/Button";
import { requestCloseModal } from "@/lib/clients/modalClient";
import { ModalWrapper } from "../elements/wrapper";
import { parseBatchGetResponse, toTimeLabel } from "@/lib/utils/sheetMetaUtil";

type ShiftCellProps = {
    sheetData: SheetData
}

/**
 * スプレッドシートから読み取った値をもとに、表形式で出勤日を表示する
 * @param sheetData :ShiftCellProps 整形済みのsheetData
 * @returns 出勤日の表
 */
function ShiftCell({ sheetData }: ShiftCellProps) {
    return (
        <>
            <div className="border-b px-4 py-3">
                <h2 className=" text-sm font-semibold">以下の内容でカレンダーに取り込みます。</h2>
                <p className="text-sm text-gray-600">表を確認して問題なければ「取り込む」を押してください。</p>
            </div>

            <div className="px-4 py-3">
                <div className="max-h-[50vh] overflow-auto border">
                    <table className="w-full table-fixed border-collapse text-sm">
                        <thead>
                            <tr>
                                <th className="border px-2 py-1 font-medium">日付</th>
                                <th className="border px-2 py-1 font-medium">出勤</th>
                                <th className="border px-2 py-1 font-medium">退勤</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sheetData[0].map((_, idx) => (
                                <tr key={idx}>
                                    <td className="border px-2 py-1 text-center">{sheetData[0][idx] ?? ""}</td>
                                    <td className="border px-2 py-1 text-center">{sheetData[1][idx] ?? ""}</td>
                                    <td className="border px-2 py-1 text-center">{sheetData[2][idx] ?? ""}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex items-center justify-between gap-3 border-t px-5 py-4">
                <CancelButton onClickFunc={requestCloseModal} />
                <TriggerButton label="この内容で取り込む" type="submit" onClickFunc={() => { }} />
            </div>
        </>
    )
}

type ModalSectionProps = {
    modalElement: ModalElement
}

/**
 * 引数のtypeに応じてモーダル風な画面を表示する
 * @param modalElement :ModalSectionProps
 * @returns モーダル風UI
 */
export function ModalSection({ modalElement }: ModalSectionProps) {
    if (modalElement.type !== "SHIFT_CELL") {
        return null;
    }
    const rawSheetData = parseBatchGetResponse(modalElement.payload);
    const sheetData: SheetData = [
        rawSheetData[0] ?? [],
        (rawSheetData[1] ?? []).map((cell) => toTimeLabel(cell)),
        (rawSheetData[2] ?? []).map((cell) => toTimeLabel(cell)),
    ];
    return (
        <>
            {modalElement.type === "SHIFT_CELL" &&
                <ModalWrapper>
                    <ShiftCell sheetData={sheetData} />
                </ModalWrapper>
            }
        </>
    )
}
