import { requestAuthCheck, requestAuthConnect } from '@/lib/authClient';
import { useState, useEffect } from 'react';
import './App.css';

type AuthState = "checking" | "connected" | "disconnected";

export default function App() {
  const [state, setState] = useState<AuthState>("checking");
  const [error, setError] = useState<string>('');
  useEffect(() => {
    (async () => {
      setError('');
      setState("checking");
      try {
        const res = await requestAuthCheck();
        const auth = await chrome.identity.getAuthToken({ interactive: true });
        setState(res.ok && res.connected ? "connected" : "disconnected")
        setError(res.error ? res.error : '');
      } catch (e) {
        setState("disconnected");
        setError(e instanceof Error ? e.message : String(e));
      }
    })();
  }, []);
  async function onConnect() {
    setError('');
    try {
      const res = await requestAuthConnect();
      setState(res.ok && res.connected ? "connected" : "disconnected");
      setError(res.error ? res.error : '');
    } catch (e) {
      setState("disconnected");
      setError(e instanceof Error ? e.message : String(e));
    }
  }
  return (
    <div className="">
      {state === "checking" && <p>確認中...</p>}
      {state === "connected" && <p>連携済み</p>}
      {state === "disconnected" && (
        <>
          <p>未連携</p>
          <button onClick={onConnect}>Googleアカウント連携する</button>
        </>
      )}
      {error && <p>{error}</p>}
    </div>
  );
}
