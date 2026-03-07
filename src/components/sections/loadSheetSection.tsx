import { useState } from "react";
import { useFormStatus } from "react-dom";
import { TriggerButton } from "../elements/Button";
import { FormWrapper } from "../elements/wrapper";
import { RangePairInput } from "../elements/rangePairInput";
import { requestLoadSheet } from "@/lib/clients/loadSheetClient";
import { validateSheetRangeForm } from "@/lib/utils/validation";
import { requestOpenModal } from "@/lib/clients/modalClient";

const formId = "sheetRangeForm";
/**
 * フォーム入力部分を表示する
 * @remarks `FormWrapper`に渡す用のtsx
 * @returns 読み込むセルの範囲を指定するUI
 */
function SheetRangeForm() {
    return (
        <>
            <RangePairInput label="日付のセル" startName="dateStart" endName="dateEnd" startPlaceholder="例:A8" endPlaceholder="例:A38" startDefaultValue="A8" endDefaultValue="A35" />
            <RangePairInput label="出勤のセル" startName="clockInStart" endName="clockInEnd" startPlaceholder="例:Z8" endPlaceholder="例:Z38" startDefaultValue="Z8" endDefaultValue="Z35" />
            <RangePairInput label="退勤のセル" startName="clockOutStart" endName="clockOutEnd" startPlaceholder="例:AA8" endPlaceholder="例:AA38" startDefaultValue="AA8" endDefaultValue="AA35" />
        </>
    )
}

/**
 * フォームと実行ボタンを表示する
 * @returns セルの読み込み範囲を指定し、読み込みの実行とモーダルの表示を実行するUI
 */
export function LoadSheetSection() {
    const [error, setError] = useState<string>('');

    /**
     * このsectionでのみ使うボタン。送信状態に応じてlabelやdisable属性が変わる。
     * @returns ボタンUI
     * @see https://ja.react.dev/reference/react-dom/hooks/useFormStatus
     */
    function LoadSheetSubmitButton() {
        const { pending } = useFormStatus();
        return (
            <TriggerButton label={pending ? "読み込み中" : "シートを読み込む"} type="submit" disabled={pending} />
        )
    }
    /**
     * form送信時に実行される処理
     * @param formData 
     * @returns 
     */
    async function actionFunc(formData: FormData) {
        setError('');
        /**
         * formData.getで得た値を文字列に整形する
         * @remarks FormDataEntryValueという型により、生の値のままvalidateに渡せないため必要
         * @param value :FormDataEntryValue | null formData.getで得た値
         * @return `value` : string | null
         */
        function toNullableString(value: FormDataEntryValue | null): string | null {
            return typeof value === "string" ? value : null;
        }

        // formの入力値を得る
        const dateStart = toNullableString(formData.get("dateStart"));
        const dateEnd = toNullableString(formData.get("dateEnd"));
        const clockInStart = toNullableString(formData.get("clockInStart"));
        const clockInEnd = toNullableString(formData.get("clockInEnd"));
        const clockOutStart = toNullableString(formData.get("clockOutStart"));
        const clockOutEnd = toNullableString(formData.get("clockOutEnd"));

        // formの入力値のバリデーション
        const validationRes = validateSheetRangeForm({ dateStart, dateEnd, clockInStart, clockInEnd, clockOutStart, clockOutEnd });
        if (!validationRes.ok) {
            setError(validationRes.error ?? "入力値が不正です。");
            return;
        }

        // backgroud.tsにシートの読み込みを依頼
        const ranges = [`${dateStart}:${dateEnd}`, `${clockInStart}:${clockInEnd}`, `${clockOutStart}:${clockOutEnd}`];
        const loadSheetRes = await requestLoadSheet(ranges);
        if (!loadSheetRes.ok || !loadSheetRes.connected) {
            setError(loadSheetRes.error ?? "シートの読み込みに失敗しました。");
            return;
        }

        // 読み込んだシートの内容をもとにモーダルを開く
        const openModalRes = await requestOpenModal({ type: "SHIFT_CELL", payload: loadSheetRes.sheetData });
        if (!openModalRes?.ok) {
            setError(openModalRes.error ?? "モーダルの表示に失敗しました。")
            return;
        }

    }
    return (
        <>
            <p>{error}</p>
            <FormWrapper formId={formId} actionFunc={actionFunc}>
                <SheetRangeForm />
                <div className="mt-2 flex justify-center">
                    <LoadSheetSubmitButton />
                </div>
            </FormWrapper>
        </>
    )
}
