import { SheetData } from "./sheet"

export type ModalElement = {
    type: "SHIFT_CELL",
    payload: SheetData,
}
