// Urlから得たsheetIdとgidの型
type translatedUrl = {
    spreadsheetId: string;
    sheetId: number; // urlのgidの値
}

export default function translateGoogleSheetUrl(sheetUrl: URL): translatedUrl {
    // [spreadsheets, d, {spreadSheetId}, ...]: string[]
    const parts: string[] = sheetUrl.pathname.split('/');
    const dIndex: number = parts.indexOf('d');
    // dが見つからなかったか末尾だった場合はエラー
    if (dIndex === -1 || dIndex + 1 >= parts.length) {
        throw new Error("spreadSheetIdを取得できませんでした。");
    }
    const spreadSheetId: string = parts[dIndex + 1];
    if (!spreadSheetId) {
        throw new Error("spreadSheetIdを取得できませんでした。");
    }

    // gidはurlのクエリ文字列かhash
    let gid: number | null = Number(sheetUrl.searchParams.get("gid"));
    if (!gid && sheetUrl.hash) {
        const hashText: string = sheetUrl.hash.slice(1);
        const gidFromHash: string | null = new URLSearchParams(hashText).get("gid");
        if (gidFromHash) {
            gid = Number(gidFromHash);
        }
    }
    // gidが見つからなかった場合エラー
    if (!Number.isInteger(gid) || gid < 0) {
        throw new Error("gidを取得できませんでした。");
    }

    return {
        spreadsheetId: spreadSheetId,
        sheetId: gid
    };

}
