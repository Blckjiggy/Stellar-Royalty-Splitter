import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, } from "recharts";
import { api } from "../api";
import "./Dashboard.css";
export const Dashboard = ({ contractId }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dateRange, setDateRange] = useState({
        start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        end: new Date().toISOString().split("T")[0],
    });
    useEffect(() => {
        loadStats();
    }, [contractId, dateRange]);
    const loadStats = async () => {
        if (!contractId) {
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await api.getAnalytics(contractId, dateRange);
            if (response.success) {
                setStats(response.data);
            }
            else {
                setError(response.message || "Failed to load analytics");
            }
        }
        catch (err) {
            console.error("Error loading dashboard stats:", err);
            setError("Error loading analytics data");
        }
        finally {
            setLoading(false);
        }
    };
    if (!contractId) {
        return (_jsx("div", { className: "dashboard-empty", children: _jsxs("div", { className: "empty-state", children: [_jsx("div", { className: "empty-icon", children: "\uD83D\uDCCA" }), _jsx("h2", { children: "No Contract Selected" }), _jsx("p", { children: "Please initialize or select a contract to view analytics." })] }) }));
    }
    return (_jsxs("div", { className: "dashboard", children: [_jsxs("div", { className: "dashboard-header", children: [_jsx("h1", { children: "Analytics Dashboard" }), _jsxs("div", { className: "date-range-filter", children: [_jsx("input", { type: "date", value: dateRange.start, onChange: (e) => setDateRange({ ...dateRange, start: e.target.value }) }), _jsx("span", { children: "to" }), _jsx("input", { type: "date", value: dateRange.end, onChange: (e) => setDateRange({ ...dateRange, end: e.target.value }) }), _jsx("button", { onClick: loadStats, className: "refresh-btn", children: "\uD83D\uDD04 Refresh" })] })] }), loading && (_jsxs("div", { className: "loading", children: [_jsx("span", { className: "spinner" }), " Loading analytics..."] })), error && _jsx("div", { className: "error-message", children: error }), stats && !loading && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "kpi-cards", children: [_jsxs("div", { className: "kpi-card kpi-distributed", children: [_jsx("div", { className: "kpi-label", children: "Total Distributed" }), _jsx("div", { className: "kpi-value", children: stats.totalDistributed.toLocaleString("en-US", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }) }), _jsx("div", { className: "kpi-unit", children: "XLM" })] }), _jsxs("div", { className: "kpi-card kpi-transactions", children: [_jsx("div", { className: "kpi-label", children: "Total Transactions" }), _jsx("div", { className: "kpi-value", children: stats.totalTransactions }), _jsx("div", { className: "kpi-unit", children: "payouts" })] }), _jsxs("div", { className: "kpi-card kpi-average", children: [_jsx("div", { className: "kpi-label", children: "Average Payout" }), _jsx("div", { className: "kpi-value", children: stats.averagePayout.toLocaleString("en-US", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }) }), _jsx("div", { className: "kpi-unit", children: "per transaction" })] }), _jsxs("div", { className: "kpi-card kpi-collaborators", children: [_jsx("div", { className: "kpi-label", children: "Active Collaborators" }), _jsx("div", { className: "kpi-value", children: stats.collaboratorStats.length }), _jsx("div", { className: "kpi-unit", children: "unique addresses" })] })] }), _jsxs("div", { className: "charts-section", children: [_jsxs("div", { className: "chart-container", children: [_jsx("h2", { children: "Revenue Trends (Over Time)" }), stats.distributionTrends.length > 0 ? (_jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(LineChart, { data: stats.distributionTrends, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "date" }), _jsx(YAxis, {}), _jsx(Tooltip, { formatter: (value) => typeof value === "number" ? value.toFixed(2) : value }), _jsx(Legend, {}), _jsx(Line, { type: "monotone", dataKey: "amount", stroke: "#667eea", name: "Total Amount (XLM)", strokeWidth: 2, dot: { fill: "#667eea", r: 4 } })] }) })) : (_jsx("div", { className: "no-data", children: "No data available" }))] }), _jsxs("div", { className: "chart-container", children: [_jsx("h2", { children: "Distribution Frequency" }), stats.distributionTrends.length > 0 ? (_jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(BarChart, { data: stats.distributionTrends, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "date" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Legend, {}), _jsx(Bar, { dataKey: "count", fill: "#764ba2", name: "Number of Transactions" })] }) })) : (_jsx("div", { className: "no-data", children: "No data available" }))] })] }), _jsxs("div", { className: "top-earners-section", children: [_jsx("h2", { children: "Top Earners" }), _jsx("div", { className: "earners-list", children: stats.topEarners.length > 0 ? (stats.topEarners.map((earner, index) => (_jsxs("div", { className: "earner-card", children: [_jsxs("div", { className: "earner-rank", children: ["#", index + 1] }), _jsxs("div", { className: "earner-info", children: [_jsxs("div", { className: "earner-address", children: [earner.address.slice(0, 10), "...", earner.address.slice(-6)] }), _jsxs("div", { className: "earner-stats", children: [_jsxs("span", { className: "earner-amount", children: [earner.totalEarned.toLocaleString("en-US", {
                                                                    minimumFractionDigits: 2,
                                                                    maximumFractionDigits: 2,
                                                                }), " XLM"] }), _jsxs("span", { className: "earner-count", children: [earner.payouts, " payouts"] })] })] }), _jsxs("div", { className: "earner-percentage", children: [((earner.totalEarned / stats.totalDistributed) *
                                                    100).toFixed(1), "%"] })] }, index)))) : (_jsx("div", { className: "no-data", children: "No earnings yet" })) })] }), _jsxs("div", { className: "collaborator-stats-section", children: [_jsx("h2", { children: "Collaborator Summary" }), _jsx("div", { className: "stats-table", children: _jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Collaborator" }), _jsx("th", { className: "text-right", children: "Total Earned" }), _jsx("th", { className: "text-right", children: "Payouts" }), _jsx("th", { className: "text-right", children: "Avg Payout" })] }) }), _jsx("tbody", { children: stats.collaboratorStats.length > 0 ? (stats.collaboratorStats.map((collab, index) => (_jsxs("tr", { children: [_jsxs("td", { className: "address-cell", children: [collab.address.slice(0, 10), "...", collab.address.slice(-6)] }), _jsx("td", { className: "text-right", children: collab.totalEarned.toLocaleString("en-US", {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        }) }), _jsx("td", { className: "text-right", children: collab.payoutCount }), _jsx("td", { className: "text-right", children: (collab.totalEarned / collab.payoutCount).toLocaleString("en-US", {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        }) })] }, index)))) : (_jsx("tr", { children: _jsx("td", { colSpan: 4, className: "no-data", children: "No collaborator data" }) })) })] }) })] })] }))] }));
};
