import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
export default function WalletConnect({ onConnect }) {
    const [address, setAddress] = useState(null);
    const [error, setError] = useState("");
    async function connect() {
        setError("");
        if (!window.freighter) {
            setError("Freighter not found. Install it at freighter.app");
            return;
        }
        try {
            const { address: addr } = await window.freighter.requestAccess();
            setAddress(addr);
            onConnect(addr);
        }
        catch {
            setError("Connection rejected. Please approve the request in Freighter.");
        }
    }
    function disconnect() {
        setAddress(null);
        onConnect(null);
        localStorage.removeItem("lastWalletAddress");
    }
    if (!window.freighter) {
        return (_jsxs("div", { className: "card", children: [_jsxs("div", { className: "wallet-row", children: [_jsx("span", { className: "badge", children: "Wallet" }), _jsx("a", { href: "https://freighter.app", target: "_blank", rel: "noreferrer", children: "Install Freighter" })] }), error && _jsx("div", { className: "status error", children: error })] }));
    }
    return (_jsxs("div", { className: "card", children: [_jsxs("div", { className: "wallet-row", children: [_jsx("span", { className: "badge", children: "Wallet" }), address ? (_jsxs(_Fragment, { children: [_jsxs("span", { className: "wallet-addr", children: [address.slice(0, 6), "...", address.slice(-4)] }), _jsx("button", { className: "btn-secondary", onClick: disconnect, children: "Disconnect" })] })) : (_jsx("button", { className: "btn-primary", onClick: connect, children: "Connect Freighter" }))] }), error && _jsx("div", { className: "status error", children: error })] }));
}
