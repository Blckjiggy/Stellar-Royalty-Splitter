import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { api } from "../api";
import { signAndSubmitTransaction } from "../stellar";
const STELLAR_ADDRESS_RE = /^G[A-Z2-7]{55}$/;
export default function InitializeForm({ contractId, walletAddress, onSuccess, }) {
    const [collaborators, setCollaborators] = useState([
        { address: "", basisPoints: "" },
    ]);
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    function update(i, field, value) {
        setCollaborators((prev) => prev.map((c, idx) => (idx === i ? { ...c, [field]: value } : c)));
    }
    function validateRow(i, field, value) {
        const rowErrors = { ...errors };
        if (field === "address") {
            if (value && !STELLAR_ADDRESS_RE.test(value)) {
                rowErrors[i] = {
                    ...rowErrors[i],
                    address: "Must be a valid Stellar address (G..., 56 chars)",
                };
            }
            else {
                const { address: _, ...rest } = rowErrors[i] ?? {};
                rowErrors[i] = rest;
            }
        }
        setErrors(rowErrors);
    }
    function handleBlur(i, field, value) {
        validateRow(i, field, value);
    }
    function addRow() {
        setCollaborators((prev) => [...prev, { address: "", basisPoints: "" }]);
    }
    function removeRow(i) {
        setCollaborators((prev) => prev.filter((_, idx) => idx !== i));
        setErrors((prev) => {
            const next = {};
            Object.entries(prev).forEach(([key, val]) => {
                const k = parseInt(key);
                if (k < i)
                    next[k] = val;
                else if (k > i)
                    next[k - 1] = val;
            });
            return next;
        });
    }
    const total = collaborators.reduce((sum, c) => sum + (parseInt(c.basisPoints) || 0), 0);
    const hasErrors = Object.values(errors).some((e) => e?.address || e?.basisPoints);
    const hasEmptyFields = collaborators.some((c) => !c.address || !c.basisPoints);
    async function submit() {
        if (!contractId)
            return setStatus({ type: "error", msg: "Enter a contract ID first." });
        if (total !== 10000)
            return setStatus({
                type: "error",
                msg: `Shares must sum to 10,000 bp (currently ${total}).`,
            });
        const addresses = collaborators.map((c) => c.address);
        const hasDuplicates = new Set(addresses).size !== addresses.length;
        if (hasDuplicates) {
            return setStatus({
                type: "error",
                msg: "Duplicate addresses are not allowed.",
            });
        }
        setLoading(true);
        setStatus({ type: "info", msg: "Building transaction…" });
        try {
            const res = await api.initialize({
                contractId,
                walletAddress,
                collaborators: addresses,
                shares: collaborators.map((c) => parseInt(c.basisPoints)),
            });
            setStatus({ type: "info", msg: "Signing transaction with Freighter..." });
            const hash = await signAndSubmitTransaction(res.xdr);
            setStatus({ type: "info", msg: "Waiting for confirmation..." });
            await api.confirmTransaction(hash, {
                status: "confirmed",
                blockTime: new Date().toISOString(),
            });
            setStatus({ type: "ok", msg: `Initialized. Tx: ${hash}` });
            onSuccess();
        }
        catch (e) {
            setStatus({ type: "error", msg: e instanceof Error ? e.message : "Unknown error" });
        }
        finally {
            setLoading(false);
        }
    }
    return (_jsxs("div", { className: "card", children: [_jsx("span", { className: "badge", children: "Initialize" }), collaborators.map((c, i) => (_jsx("div", { children: _jsxs("div", { className: "collaborator-row", children: [_jsxs("div", { style: { flex: 3, display: "flex", flexDirection: "column" }, children: [_jsx("input", { placeholder: "Wallet address (G...)", value: c.address, onChange: (e) => update(i, "address", e.target.value), onBlur: (e) => handleBlur(i, "address", e.target.value), style: { marginBottom: errors[i]?.address ? "0.25rem" : undefined } }), errors[i]?.address && (_jsx("span", { className: "field-error", children: errors[i].address }))] }), _jsx("input", { placeholder: "Basis pts", type: "number", min: 1, max: 10000, value: c.basisPoints, onChange: (e) => update(i, "basisPoints", e.target.value), onBlur: (e) => handleBlur(i, "basisPoints", e.target.value), style: { flex: 1 } }), collaborators.length > 1 && (_jsx("button", { className: "btn-danger", onClick: () => removeRow(i), children: "\u2715" }))] }) }, i))), _jsxs("div", { className: `share-total ${total === 10000 ? "share-total--valid" : "share-total--invalid"}`, children: ["Total: ", total, " / 10,000 bp (", (total / 100).toFixed(2), "%)"] }), _jsxs("div", { className: "row", children: [_jsx("button", { className: "btn-add", onClick: addRow, children: "+ Add collaborator" }), _jsx("button", { className: "btn-primary", onClick: submit, disabled: loading || hasErrors || hasEmptyFields, children: loading ? "Submitting…" : "Initialize contract" })] }), status && _jsx("div", { className: `status ${status.type}`, children: status.msg })] }));
}
