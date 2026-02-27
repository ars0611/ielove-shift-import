export type AuthCheckMessage = { type: "AUTH_CHECK" };
export type AuthConnectMessage = { type: "AUTH_CONNECT" };

export type ExtensionMessage = AuthCheckMessage | AuthConnectMessage;

export type AuthResponse = {
    ok: boolean;
    connected: boolean;
    error?: string;
}

