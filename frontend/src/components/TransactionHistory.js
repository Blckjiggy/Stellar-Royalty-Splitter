import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { api } from "../api";
import "./TransactionHistory.css";
export const TransactionHistory = ({ contractId, }) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [offset, setOffset] = useState(0);
    const [total, setTotal] = useState(0);
    const LIMIT = 10;
    const fetchHistory = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await api.getTransactionHistory(contractId, LIMIT, offset);
            setTransactions(result.data || []);
            setTotal(result.pagination?.total ?? 0);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch history");
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchHistory();
    }, [contractId, offset]);
    const getStatusColor = (status) => {
        switch (status) {
            case "confirmed":
                return "#4ade80";
            case "failed":
                return "#f87171";
            default:
                return "#facc15";
        }
    };
    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleString();
        }
        catch {
            return dateString;
        }
    };
    const truncateAddress = (address) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };
    const truncateHash = (hash) => {
        if (!hash)
            return "Pending";
        return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
    };
    return (_jsxs("div", { className: "transaction-history", children: [_jsxs("div", { className: "history-header", children: [_jsx("h2", { children: "Transaction History" }), _jsx("button", { onClick: fetchHistory, disabled: loading, children: loading ? "Refreshing..." : "Refresh" })] }), error && _jsx("div", { className: "error-message", children: error }), transactions.length === 0 && !loading && (_jsx("div", { className: "empty-state", children: "No transactions yet" })), transactions.length > 0 && (_jsxs(_Fragment, { children: [_jsx("div", { className: "transactions-table", children: _jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Type" }), _jsx("th", { children: "Initiator" }), _jsx("th", { children: "Amount" }), _jsx("th", { children: "TX Hash" }), _jsx("th", { children: "Status" }), _jsx("th", { children: "Timestamp" })] }) }), _jsx("tbody", { children: transactions.map((tx) => (_jsxs("tr", { children: [_jsx("td", { children: _jsx("span", { className: "tx-type", children: tx.type }) }), _jsx("td", { title: tx.initiatorAddress, children: truncateAddress(tx.initiatorAddress) }), _jsx("td", { children: tx.requestedAmount || "—" }), _jsx("td", { title: tx.txHash || undefined, className: "tx-hash-cell", children: truncateHash(tx.txHash) }), _jsx("td", { children: _jsx("span", { className: "status-badge", style: {
                                                        backgroundColor: getStatusColor(tx.status),
                                                        color: tx.status === "failed" ? "white" : "black",
                                                    }, children: tx.status }) }), _jsx("td", { children: formatDate(tx.timestamp) })] }, tx.id))) })] }) }), _jsxs("div", { className: "pagination", children: [_jsx("button", { onClick: () => setOffset(Math.max(0, offset - LIMIT)), disabled: offset === 0, children: "Previous" }), _jsxs("span", { children: ["Showing ", offset + 1, "\u2013", offset + transactions.length, " of ", total, " transactions"] }), _jsx("button", { onClick: () => setOffset(offset + LIMIT), disabled: offset + transactions.length >= total, children: "Next" })] })] })), loading && _jsx("div", { className: "loading", children: "Loading transactions..." })] }));
};
