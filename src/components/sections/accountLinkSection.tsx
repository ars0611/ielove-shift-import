import { useState, useEffect } from "react";
import { SignInButton } from "../elements/signInButton";
import { requestAuthCheck, requestAuthConnect } from "@/lib/clients/authClient";

type AuthState = "checking" | "connected" | "disconnected";

/** statusに対応したスタイル */
const statusUi = {
    checking: {
        label: "確認中...",
        box: "border-yellow-300 bg-yellow-50 text-yellow-800",
        dot: "bg-yellow-500",
    },
    connected: {
        label: "連携済み",
        box: "border-green-300 bg-green-50 text-green-800",
        dot: "bg-green-500",
    },
    disconnected: {
        label: "未連携",
        box: "border-red-300 bg-red-50 text-red-800",
        dot: "bg-red-500",
    },
};

export function AccountLinkSection() {
    const [authState, setAuthState] = useState<AuthState>("checking");
    const ui = statusUi[authState as keyof typeof statusUi];
    const [authError, setAuthError] = useState<string>('');

    // 初回マウント時に認証済みかチェック
    useEffect(() => {
        (async () => {
            setAuthError('');
            setAuthState("checking");
            try {
                const res = await requestAuthCheck();
                setAuthState(res.ok && res.connected ? "connected" : "disconnected")
                setAuthError(res.error ? res.error : '');
            } catch (e) {
                setAuthState("disconnected");
                setAuthError(e instanceof Error ? e.message : String(e));
            }
        })();
    }, []);

    /**
     * Google認証をbackground.tsで実行する
     * @return Promise<void>
     */
    async function onConnect(): Promise<void> {
        setAuthError('');
        try {
            const res = await requestAuthConnect();
            setAuthState(res.ok && res.connected ? "connected" : "disconnected");
            setAuthError(res.error ? res.error : '');
        } catch (e) {
            setAuthState("disconnected");
            setAuthError(e instanceof Error ? e.message : String(e));
        }
    }
    return (
        <section className="space-y-2">
            <div className={`rounded-md border px-3 py-2 text-sm ${ui.box}`}>
                <p className="flex items-center gap-2 font-medium">
                    <span className={`h-2 w-2 rounded-full ${ui.dot}`} />
                    {ui.label}
                </p>
                {authError && (
                    <p className="mt-1 text-xs leading-5 text-red-700">
                        {authError}
                    </p>
                )}
            </div>
            {authState === "disconnected" && (
                <div className="mt-2 flex justify-center">
                    <SignInButton onClickFunc={onConnect} />
                </div>
            )}
        </section>
    );

}
