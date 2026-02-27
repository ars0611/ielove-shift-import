export async function getValues(accessToken: string, spreadsheetId: string) {
    const range = encodeURIComponent("2026年3月!A1:C10");
    encodeURIComponent(spreadsheetId);
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`;

    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`, // ここが肝
        },
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`スプレッドシートの読み込みに失敗しました: ${res.status} ${text}`);
    }

    const data = await res.json();
    return data.values as (string | number)[][];
}
