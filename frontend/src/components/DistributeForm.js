import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { api } from "../api";
import { signAndSubmitTransaction } from "../stellar";
export default function DistributeForm({ contractId, walletAddress, onSuccess, }) {
    const [tokenId, setTokenId] = useState("");
    const [amount, setAmount] = useState("");
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    async function submit() {
        if (!contractId)
            return setStatus({ type: "error", msg: "Enter a contract ID first." });
        if (!tokenId || !amount)
            return setStatus({ type: "error", msg: "Fill in token and amount." });
        setLoading(true);
        setStatus({ type: "info", msg: "Building transaction…" });
        try {
            const res = await api.distribute({
                contractId,
                walletAddress,
                tokenId,
                amount: parseInt(amount),
            });
            setStatus({ type: "info", msg: "Signing transaction with Freighter..." });
            const hash = await signAndSubmitTransaction(res.xdr);
            setStatus({ type: "info", msg: "Waiting for confirmation..." });
            await api.confirmTransaction(hash, {
                status: "confirmed",
                blockTime: new Date().toISOString(),
            });
            setStatus({ type: "ok", msg: `Distributed. Tx: ${hash}` });
            onSuccess();
        }
        catch (e) {
            setStatus({ type: "error", msg: e.message });
        }
        finally {
            setLoading(false);
        }
    }
    return (_jsxs("div", { className: "card", children: [_jsx("span", { className: "badge", children: "Distribute" }), _jsx("label", { children: "Token contract address" }), _jsx("input", { placeholder: "C...", value: tokenId, onChange: (e) => setTokenId(e.target.value) }), _jsx("label", { children: "Amount (stroops)" }), _jsx("input", { placeholder: "e.g. 10000000", type: "number", value: amount, onChange: (e) => setAmount(e.target.value) }), _jsx("button", { className: "btn-primary", onClick: submit, disabled: loading, children: loading ? "Submitting…" : "Distribute funds" }), status && _jsx("div", { className: `status ${status.type}`, children: status.msg })] }));
}
