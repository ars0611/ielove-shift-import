import { SheetData } from "@/types/sheet"

type ConfirmationModalProps = {
    open: boolean,
    sheetData: SheetData,
    onImport: () => void,
    onCancel: () => void
}

export function ConfirmationModal({ open, sheetData, onImport, onCancel }: ConfirmationModalProps) {
    if (!open) { return null; }
    return (
        <div className="fixed inset-0 z-[998244353] grid place-items-center bg-black/50 justify-start p-4 pl-6">
            <div className="w-full max-w-md rounded border bg-white">
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
                    <button
                        className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
                        onClick={onCancel}
                    >
                        キャンセル
                    </button>

                    <button
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                        onClick={onImport}
                    >
                        取り込む
                    </button>
                </div>
            </div>
        </div>
    )
}
