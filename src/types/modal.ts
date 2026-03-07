import { BatchGetResponse } from "./sheet"

export type ModalElement = {
    type: "SHIFT_CELL",
    payload: BatchGetResponse
}
