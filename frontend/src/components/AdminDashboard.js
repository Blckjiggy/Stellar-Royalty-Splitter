import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { api } from "../api";
import "./AdminDashboard.css";
export const AdminDashboard = ({ contractId, }) => {
    const [showModal, setShowModal] = useState(false);
    const [copied, setCopied] = useState(false);
    const [initHistory, setInitHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (contractId) {
            loadInitializeHistory();
        }
    }, [contractId]);
    const loadInitializeHistory = async () => {
        setLoading(true);
        try {
            const response = await api.getTransactionHistory(contractId, 50, 0);
            if (response.data) {
                // Filter only initialize transactions
                const initTransactions = response.data.filter((t) => t.type === "initialize");
                setInitHistory(initTransactions);
            }
        }
        catch (err) {
            console.error("Error loading initialize history:", err);
        }
        finally {
            setLoading(false);
        }
    };
    const copyToClipboard = () => {
        navigator.clipboard.writeText(contractId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    if (!contractId) {
        return (_jsx("div", { className: "admin-empty", children: _jsx("p", { children: "No contract selected" }) }));
    }
    return (_jsxs("div", { className: "admin-dashboard", children: [_jsx("div", { className: "admin-header", children: _jsx("h1", { children: "\u2699\uFE0F Admin Dashboard" }) }), _jsxs("div", { className: "contract-card", children: [_jsxs("div", { className: "contract-header", children: [_jsx("h2", { children: "Contract Information" }), _jsx("button", { className: "info-btn", onClick: () => setShowModal(true), children: "\u2139\uFE0F Details" })] }), _jsxs("div", { className: "contract-id-display", children: [_jsx("div", { className: "contract-id-label", children: "Contract ID" }), _jsxs("div", { className: "contract-id-value", children: [_jsx("code", { children: contractId }), _jsx("button", { className: `copy-btn ${copied ? "copied" : ""}`, onClick: copyToClipboard, title: "Copy to clipboard", children: copied ? "✓ Copied" : "📋 Copy" })] })] }), _jsxs("div", { className: "contract-stats", children: [_jsxs("div", { className: "stat", children: [_jsx("span", { className: "stat-label", children: "Network" }), _jsx("span", { className: "stat-value", children: "Stellar Testnet" })] }), _jsxs("div", { className: "stat", children: [_jsx("span", { className: "stat-label", children: "Runtime" }), _jsx("span", { className: "stat-value", children: "Soroban" })] }), _jsxs("div", { className: "stat", children: [_jsx("span", { className: "stat-label", children: "Status" }), _jsx("span", { className: "stat-value active", children: "Active" })] })] })] }), _jsxs("div", { className: "history-section", children: [_jsxs("div", { className: "history-header", children: [_jsx("h2", { children: "Initialize History" }), _jsx("button", { onClick: loadInitializeHistory, className: "refresh-mini-btn", children: "\uD83D\uDD04" })] }), loading ? (_jsx("div", { className: "loading-mini", children: "Loading..." })) : initHistory.length > 0 ? (_jsx("div", { className: "history-list", children: initHistory.map((record, idx) => (_jsxs("div", { className: "history-item", children: [_jsx("div", { className: "history-timestamp", children: new Date(record.timestamp).toLocaleString() }), _jsxs("div", { className: "history-details", children: [_jsxs("div", { className: "detail-row", children: [_jsx("span", { className: "label", children: "Initiator:" }), _jsxs("code", { className: "value", children: [record.initiatorAddress.slice(0, 10), "...", record.initiatorAddress.slice(-6)] })] }), _jsxs("div", { className: "detail-row", children: [_jsx("span", { className: "label", children: "Collaborators:" }), _jsx("span", { className: "value", children: record.collaborators })] }), _jsxs("div", { className: "detail-row", children: [_jsx("span", { className: "label", children: "Status:" }), _jsx("span", { className: `status ${record.status}`, children: record.status })] }), record.txHash && (_jsxs("div", { className: "detail-row", children: [_jsx("span", { className: "label", children: "TX Hash:" }), _jsxs("code", { className: "value tx-hash", children: [record.txHash.slice(0, 16), "..."] })] }))] })] }, idx))) })) : (_jsx("div", { className: "no-history", children: "No initialize records found" }))] }), showModal && (_jsx("div", { className: "modal-overlay", onClick: () => setShowModal(false), children: _jsxs("div", { className: "modal", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "modal-header", children: [_jsx("h2", { children: "Contract Details" }), _jsx("button", { className: "modal-close", onClick: () => setShowModal(false), children: "\u2715" })] }), _jsxs("div", { className: "modal-content", children: [_jsxs("div", { className: "detail-block", children: [_jsx("h3", { children: "Contract ID" }), _jsxs("div", { className: "contract-info-block", children: [_jsx("code", { children: contractId }), _jsx("button", { onClick: copyToClipboard, className: "copy-modal-btn", children: "\uD83D\uDCCB Copy" })] })] }), _jsxs("div", { className: "detail-block", children: [_jsx("h3", { children: "Network Information" }), _jsxs("div", { className: "info-grid", children: [_jsxs("div", { className: "info-item", children: [_jsx("span", { className: "info-label", children: "Network" }), _jsx("span", { className: "info-value", children: "Stellar Testnet" })] }), _jsxs("div", { className: "info-item", children: [_jsx("span", { className: "info-label", children: "Blockchain" }), _jsx("span", { className: "info-value", children: "Stellar" })] }), _jsxs("div", { className: "info-item", children: [_jsx("span", { className: "info-label", children: "Runtime" }), _jsx("span", { className: "info-value", children: "Soroban" })] }), _jsxs("div", { className: "info-item", children: [_jsx("span", { className: "info-label", children: "Status" }), _jsx("span", { className: "info-value active", children: "Active" })] })] })] }), _jsxs("div", { className: "detail-block", children: [_jsx("h3", { children: "Smart Contract Features" }), _jsxs("ul", { className: "features-list", children: [_jsx("li", { children: "\u2713 Automated Revenue Distribution" }), _jsx("li", { children: "\u2713 Multi-Collaborator Support" }), _jsx("li", { children: "\u2713 Transaction Audit Trail" }), _jsx("li", { children: "\u2713 Secondary Royalty Management" }), _jsx("li", { children: "\u2713 Real-time Analytics" })] })] }), _jsxs("div", { className: "detail-block", children: [_jsx("h3", { children: "Resources" }), _jsxs("div", { className: "resources-links", children: [_jsx("a", { href: "https://stellar.org/docs", target: "_blank", rel: "noopener noreferrer", children: "\uD83D\uDCD6 Stellar Docs" }), _jsx("a", { href: "https://soroban.stellar.org", target: "_blank", rel: "noopener noreferrer", children: "\uD83D\uDE80 Soroban Runtime" }), _jsx("a", { href: "https://testnet.stellar.expert", target: "_blank", rel: "noopener noreferrer", children: "\uD83D\uDD0D Stellar Expert" })] })] })] }), _jsx("div", { className: "modal-footer", children: _jsx("button", { className: "btn-close", onClick: () => setShowModal(false), children: "Close" }) })] }) }))] }));
};
