import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { api } from "../api";
import { signAndSubmitTransaction } from "../stellar";
export default function DistributeSecondaryRoyalties({ contractId, walletAddress, onSuccess, }) {
    const [tokenId, setTokenId] = useState("");
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState(null);
    // Load royalty stats on component mount and contract change
    useEffect(() => {
        if (!contractId)
            return;
        api
            .getRoyaltyStats(contractId)
            .then(setStats)
            .catch(() => setStats(null));
    }, [contractId]);
    async function submit() {
        if (!contractId || !tokenId) {
            return setStatus({ type: "error", msg: "Please fill in all fields." });
        }
        setLoading(true);
        setStatus({ type: "info", msg: "Building distribution transaction..." });
        try {
            const { xdr, numberOfSales, totalRoyalties } = await api.distributeSecondaryRoyalties({
                contractId,
                walletAddress,
                tokenId,
            });
            if (numberOfSales === 0) {
                return setStatus({
                    type: "error",
                    msg: "No pending royalties to distribute.",
                });
            }
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
                msg: `Distributed ${totalRoyalties} tokens from ${numberOfSales} sales! TX: ${result}`,
            });
            setTokenId("");
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
    return (_jsxs("div", { className: "card", children: [_jsx("h3", { children: "Distribute Secondary Royalties" }), _jsx("p", { className: "description", children: "Distribute accumulated royalties from resales to collaborators." }), stats && (_jsxs("div", { className: "stats-summary", children: [_jsxs("div", { className: "stat-item", children: [_jsx("span", { className: "stat-label", children: "Total Secondary Sales:" }), _jsx("span", { className: "stat-value", children: stats.totalSecondarySales })] }), _jsxs("div", { className: "stat-item", children: [_jsx("span", { className: "stat-label", children: "Total Royalties Generated:" }), _jsx("span", { className: "stat-value", children: stats.totalRoyaltiesGenerated })] }), stats.lastDistribution && (_jsxs("div", { className: "stat-item", children: [_jsx("span", { className: "stat-label", children: "Last Distribution:" }), _jsx("span", { className: "stat-value", children: new Date(stats.lastDistribution.timestamp).toLocaleDateString() })] }))] })), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Token Address" }), _jsx("input", { type: "text", placeholder: "C... (USDC or payment token)", value: tokenId, onChange: (e) => setTokenId(e.target.value), disabled: loading })] }), status && _jsx("div", { className: `message ${status.type}`, children: status.msg }), _jsx("button", { onClick: submit, disabled: loading, className: "btn-primary", children: loading ? "Processing..." : "Distribute Royalties" })] }));
}
