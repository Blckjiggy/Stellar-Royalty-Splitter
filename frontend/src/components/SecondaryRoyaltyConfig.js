import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { api } from "../api";
import { signAndSubmitTransaction } from "../stellar";
export default function SecondaryRoyaltyConfig({ contractId, walletAddress, onSuccess, onRateUpdate, }) {
    const [royaltyRate, setRoyaltyRate] = useState("500"); // Default 5%
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    async function submit() {
        if (!contractId) {
            return setStatus({ type: "error", msg: "Enter a contract ID first." });
        }
        const rate = parseInt(royaltyRate);
        if (isNaN(rate) || rate < 0 || rate > 10000) {
            return setStatus({
                type: "error",
                msg: "Royalty rate must be between 0 and 10000 basis points (0-100%).",
            });
        }
        setLoading(true);
        setStatus({ type: "info", msg: "Building transaction..." });
        try {
            const { xdr } = await api.setRoyaltyRate({
                contractId,
                walletAddress,
                royaltyRate: rate,
            });
            setStatus({ type: "info", msg: "Please sign the transaction..." });
            // Sign and submit transaction (this would require Freighter integration)
            const result = await signAndSubmitTransaction(xdr);
            setStatus({ type: "info", msg: "Waiting for confirmation..." });
            await api.confirmTransaction(result, {
                status: "confirmed",
                blockTime: new Date().toISOString(),
            });
            setStatus({
                type: "ok",
                msg: `Royalty rate set to ${(rate / 100).toFixed(2)}%! TX: ${result}`,
            });
            onSuccess();
            // Update parent component with new rate
            if (onRateUpdate) {
                onRateUpdate(rate);
            }
        }
        catch (err) {
            setStatus({
                type: "error",
                msg: `Error: ${err instanceof Error ? err.message : "Unknown error"}`,
            });
        }
        finally {
            setLoading(false);
        }
    }
    const percentage = (parseInt(royaltyRate) / 100).toFixed(2);
    return (_jsxs("div", { className: "card", children: [_jsx("h3", { children: "Set Secondary Royalty Rate" }), _jsx("p", { className: "description", children: "Configure the percentage of resale proceeds to distribute to collaborators." }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Royalty Rate (basis points)" }), _jsxs("div", { className: "input-with-label", children: [_jsx("input", { type: "number", value: royaltyRate, onChange: (e) => setRoyaltyRate(e.target.value), min: "0", max: "10000", step: "100", disabled: loading }), _jsxs("span", { className: "rate-display", children: [percentage, "%"] })] }), _jsx("small", { children: "1 bp = 0.01%, max 10000 bp (100%)" })] }), status && _jsx("div", { className: `message ${status.type}`, children: status.msg }), _jsx("button", { onClick: submit, disabled: loading, className: "btn-primary", children: loading ? "Processing..." : "Set Royalty Rate" })] }));
}
