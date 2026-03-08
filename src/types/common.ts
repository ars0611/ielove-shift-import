export type StringTuple = [string, string];

export type Ymd = {
    yyyy: number,
    mm: number,
    dd: number
}

export type Ymdhm = {
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number
}

export type YmdhmTuple = [Ymdhm, Ymdhm]
export type YmdTuple = [Ymd, Ymd];
