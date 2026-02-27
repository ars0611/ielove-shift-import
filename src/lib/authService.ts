/**
 * 認証済みかチェック
 * @remarks 認証のUIは表示しない（interactive: false）
 * @returns 認証済みでトークン取得出来たら true, それ以外 false
 */
export async function checkGoogleAuth(): Promise<boolean> {
    try {
        const token = await chrome.identity.getAuthToken({ interactive: false });
        return !!token;
    } catch {
        return false;
    }
}
/**
 * 認証済みかチェックし、認証済みでなかったら認証させる
 * @remarks 認証のUIを表示する（interactive: true）
 * @returns 認証済みか、認証できたら true, それ以外 false
 */
export async function connectGoogleAuth(): Promise<boolean> {
    try {
        const token = await chrome.identity.getAuthToken({ interactive: true });
        return !!token
    } catch {
        return false;
    }
}
