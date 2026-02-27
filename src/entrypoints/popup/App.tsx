import { requestAuthCheck, requestAuthConnect } from '@/lib/authClient';
import { requestLoadSheet } from '@/lib/loadSheetClient';
import { useState, useEffect } from 'react';
import './App.css';

type AuthState = "checking" | "connected" | "disconnected";
type SheetData = string | number[][]

export default function App() {
  const [authState, setAuthState] = useState<AuthState>("checking");
  const [error, setError] = useState<string>('');
  const [sheetData, setSheetData] = useState<SheetData>([[]]);

  // 初回マウント時に認証済みかチェック
  useEffect(() => {
    (async () => {
      setError('');
      setAuthState("checking");
      try {
        const res = await requestAuthCheck();
        setAuthState(res.ok && res.connected ? "connected" : "disconnected")
        setError(res.error ? res.error : '');
      } catch (e) {
        setAuthState("disconnected");
        setError(e instanceof Error ? e.message : String(e));
      }
    })();
  }, []);

  /**
   * Google認証をbackground.tsで実行する
   * 
   * @return Promise<void>
   */
  async function onConnect(): Promise<void> {
    setError('');
    try {
      const res = await requestAuthConnect();
      setAuthState(res.ok && res.connected ? "connected" : "disconnected");
      setError(res.error ? res.error : '');
    } catch (e) {
      setAuthState("disconnected");
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  /**
   * 
   */
  async function onLoad() {
    setError('')
    try {
      const res = await requestLoadSheet();
      setSheetData(res.ok && res.connected ? res.sheetData : [[]]);
      setError(res.error ? res.error : '');
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <div className="">
      {authState === "checking" && <p>確認中...</p>}
      {authState === "connected" && <p>連携済み</p>}
      {authState === "disconnected" && (
        <>
          <p>未連携</p>
          <button onClick={onConnect}>Googleアカウント連携する</button>
        </>
      )}
      <button onClick={onLoad}>spreadSheetを読み込む</button>
      <p>{sheetData}</p>
      {error && <p>{error}</p>}
    </div>
  );
}
