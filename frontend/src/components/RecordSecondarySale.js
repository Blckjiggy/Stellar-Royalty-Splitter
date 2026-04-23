import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { api } from "../api";
import { signAndSubmitTransaction } from "../stellar";
export default function RecordSecondarySale({ contractId, walletAddress, royaltyRate, onSuccess, }) {
    const [formData, setFormData] = useState({
        nftId: "",
        previousOwner: "",
        newOwner: "",
        salePrice: "",
        saleToken: "",
    });
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [calculatedRoyalty, setCalculatedRoyalty] = useState(null);
    function updateField(field, value) {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Calculate royalty on price change
        if (field === "salePrice") {
            const price = parseInt(value);
            if (!isNaN(price) && price > 0) {
                const royalty = Math.floor((price * royaltyRate) / 10000);
                setCalculatedRoyalty(royalty);
            }
            else {
                setCalculatedRoyalty(null);
            }
        }
    }
    async function submit() {
        if (!contractId) {
            return setStatus({ type: "error", msg: "Enter a contract ID first." });
        }
        if (!formData.nftId || !formData.previousOwner || !formData.newOwner || !formData.salePrice || !formData.saleToken) {
            return setStatus({ type: "error", msg: "Please fill in all fields." });
        }
        const salePrice = parseInt(formData.salePrice);
        if (isNaN(salePrice) || salePrice <= 0) {
            return setStatus({ type: "error", msg: "Sale price must be a positive number." });
        }
        setLoading(true);
        setStatus({ type: "info", msg: "Recording secondary sale..." });
        try {
            const { xdr, royaltyAmount } = await api.recordSecondarySale({
                contractId,
                walletAddress,
                nftId: formData.nftId,
                previousOwner: formData.previousOwner,
                newOwner: formData.newOwner,
                salePrice,
                saleToken: formData.saleToken,
                royaltyRate,
            });
            setStatus({ type: "info", msg: "Please sign the transaction..." });
            // Sign and submit transaction
            const result = await signAndSubmitTransaction(xdr);
            setStatus({ type: "info", msg: "Waiting for confirmation..." });
            await api.confirmTransaction(result, {
                status: "confirmed",
                blockTime: new Date().toISOString(),
            });
            setStatus({
                type: "ok",
                msg: `Secondary sale recorded! Royalty: ${royaltyAmount} tokens. TX: ${result}`,
            });
            setFormData({
                nftId: "",
                previousOwner: "",
                newOwner: "",
                salePrice: "",
                saleToken: "",
            });
            setCalculatedRoyalty(null);
            onSuccess();
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
    return (_jsxs("div", { className: "card", children: [_jsx("h3", { children: "Record Secondary Sale" }), _jsxs("p", { className: "description", children: ["Log an NFT resale and automatically calculate royalties (", (royaltyRate / 100).toFixed(2), "%)."] }), _jsxs("div", { className: "form-grid", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { children: "NFT ID" }), _jsx("input", { type: "text", placeholder: "NFT identifier", value: formData.nftId, onChange: (e) => updateField("nftId", e.target.value), disabled: loading })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Previous Owner" }), _jsx("input", { type: "text", placeholder: "G...", value: formData.previousOwner, onChange: (e) => updateField("previousOwner", e.target.value), disabled: loading })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "New Owner" }), _jsx("input", { type: "text", placeholder: "G...", value: formData.newOwner, onChange: (e) => updateField("newOwner", e.target.value), disabled: loading })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Sale Price" }), _jsxs("div", { className: "input-with-calc", children: [_jsx("input", { type: "number", placeholder: "1000", value: formData.salePrice, onChange: (e) => updateField("salePrice", e.target.value), disabled: loading, min: "0", step: "1" }), calculatedRoyalty !== null && (_jsxs("span", { className: "calc-result", children: ["Royalty: ", calculatedRoyalty] }))] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Token Address" }), _jsx("input", { type: "text", placeholder: "C...", value: formData.saleToken, onChange: (e) => updateField("saleToken", e.target.value), disabled: loading })] })] }), status && (_jsx("div", { className: `message ${status.type}`, children: status.msg })), _jsx("button", { onClick: submit, disabled: loading, className: "btn-primary", children: loading ? "Processing..." : "Record Sale" })] }));
}
