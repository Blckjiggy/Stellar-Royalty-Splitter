import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { api } from "../api";
import "./ResaleHistory.css";
export default function ResaleHistory({ contractId }) {
    const [sales, setSales] = useState([]);
    const [distributions, setDistributions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("sales");
    useEffect(() => {
        if (!contractId)
            return;
        const loadData = async () => {
            setLoading(true);
            try {
                const [salesData, distributionsData] = await Promise.all([
                    api.getSecondarySales(contractId),
                    api.getSecondaryRoyaltyDistributions(contractId),
                ]);
                setSales(salesData.sales || []);
                setDistributions(distributionsData.distributions || []);
            }
            catch (err) {
                console.error("Error loading resale history", err);
            }
            finally {
                setLoading(false);
            }
        };
        loadData();
    }, [contractId]);
    if (loading) {
        return (_jsx("div", { className: "card", children: _jsx("p", { children: "Loading resale history..." }) }));
    }
    return (_jsxs("div", { className: "card resale-history", children: [_jsx("h3", { children: "Resale & Royalty History" }), _jsxs("div", { className: "tabs", children: [_jsxs("button", { className: `tab ${activeTab === "sales" ? "active" : ""}`, onClick: () => setActiveTab("sales"), children: ["Secondary Sales (", sales.length, ")"] }), _jsxs("button", { className: `tab ${activeTab === "distributions" ? "active" : ""}`, onClick: () => setActiveTab("distributions"), children: ["Distributions (", distributions.length, ")"] })] }), activeTab === "sales" && (_jsx("div", { className: "content", children: sales.length === 0 ? (_jsx("p", { className: "empty-state", children: "No secondary sales recorded yet." })) : (_jsx("div", { className: "table-container", children: _jsxs("table", { className: "resale-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "NFT ID" }), _jsx("th", { children: "Sale Price" }), _jsx("th", { children: "Royalty (bp)" }), _jsx("th", { children: "Royalty Amount" }), _jsx("th", { children: "Buyer" }), _jsx("th", { children: "Date" })] }) }), _jsx("tbody", { children: sales.map((sale) => (_jsxs("tr", { children: [_jsxs("td", { className: "nft-id", children: [sale.nftId.substring(0, 16), "..."] }), _jsx("td", { children: sale.salePrice }), _jsxs("td", { children: [sale.royaltyRate / 100, "%"] }), _jsx("td", { className: "royalty-amount", children: sale.royaltyAmount }), _jsxs("td", { className: "address", children: [sale.newOwner.substring(0, 8), "..."] }), _jsx("td", { children: new Date(sale.timestamp).toLocaleDateString() })] }, sale.id))) })] }) })) })), activeTab === "distributions" && (_jsx("div", { className: "content", children: distributions.length === 0 ? (_jsx("p", { className: "empty-state", children: "No distributions yet." })) : (_jsx("div", { className: "table-container", children: _jsxs("table", { className: "distribution-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Total Distributed" }), _jsx("th", { children: "Sales Count" }), _jsx("th", { children: "Status" }), _jsx("th", { children: "Initiator" }), _jsx("th", { children: "Date" }), _jsx("th", { children: "TX Hash" })] }) }), _jsx("tbody", { children: distributions.map((dist) => (_jsxs("tr", { children: [_jsx("td", { className: "amount", children: dist.totalRoyaltiesDistributed }), _jsx("td", { children: dist.numberOfSales }), _jsx("td", { className: `status ${dist.status}`, children: dist.status }), _jsxs("td", { className: "address", children: [dist.initiatorAddress.substring(0, 8), "..."] }), _jsx("td", { children: new Date(dist.timestamp).toLocaleDateString() }), _jsx("td", { className: "tx-hash", children: dist.txHash
                                                ? dist.txHash.substring(0, 12) + "..."
                                                : "—" })] }, dist.id))) })] }) })) }))] }));
}
