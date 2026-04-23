import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Navigation } from "./components/Navigation";
import { Dashboard } from "./components/Dashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import { Settings } from "./components/Settings";
import WalletConnect from "./components/WalletConnect";
import InitializeForm from "./components/InitializeForm";
import DistributeForm from "./components/DistributeForm";
import { TransactionHistory } from "./components/TransactionHistory";
import SecondaryRoyaltyConfig from "./components/SecondaryRoyaltyConfig";
import RecordSecondarySale from "./components/RecordSecondarySale";
import DistributeSecondaryRoyalties from "./components/DistributeSecondaryRoyalties";
import ResaleHistory from "./components/ResaleHistory";
import "./App.css";
export default function App() {
    const [walletAddress, setWalletAddress] = useState(null);
    const [contractId, setContractId] = useState(() => localStorage.getItem("lastContractId") ?? "");
    const [royaltyRate, setRoyaltyRate] = useState(500); // Default 5%
    const [currentPage, setCurrentPage] = useState("dashboard");
    // Silently reconnect Freighter if it was previously authorized
    useEffect(() => {
        async function tryReconnect() {
            // window.freighter is injected at runtime by the browser extension
            if (!window.freighter)
                return;
            try {
                const { address } = await window.freighter.getAddress();
                if (address)
                    setWalletAddress(address);
            }
            catch {
                // Not yet authorized — user must connect manually
            }
        }
        tryReconnect();
    }, []);
    function handleContractChange(value) {
        setContractId(value);
        if (value)
            localStorage.setItem("lastContractId", value);
        else
            localStorage.removeItem("lastContractId");
    }
    const renderPage = () => {
        switch (currentPage) {
            case "dashboard":
                return contractId ? (_jsx(Dashboard, { contractId: contractId })) : (_jsx("div", { className: "page-empty", children: _jsxs("div", { className: "empty-content", children: [_jsx("h2", { children: "Welcome to Stellar Royalty Splitter" }), _jsx("p", { children: "Select or initialize a contract to get started" })] }) }));
            case "transactions":
                return contractId ? (_jsx(TransactionHistory, { contractId: contractId })) : (_jsx("div", { className: "page-empty", children: _jsx("p", { children: "Please select a contract first" }) }));
            case "initialize":
                return walletAddress ? (_jsx("div", { className: "page-section", children: _jsx(InitializeForm, { contractId: contractId, walletAddress: walletAddress, onSuccess: () => { } }) })) : (_jsx("div", { className: "page-empty", children: _jsx("p", { children: "Please connect your wallet first" }) }));
            case "distribute":
                return walletAddress ? (_jsx("div", { className: "page-section", children: _jsx(DistributeForm, { contractId: contractId, walletAddress: walletAddress, onSuccess: () => { } }) })) : (_jsx("div", { className: "page-empty", children: _jsx("p", { children: "Please connect your wallet first" }) }));
            case "admin":
                return contractId ? (_jsx(AdminDashboard, { contractId: contractId })) : (_jsx("div", { className: "page-empty", children: _jsx("p", { children: "Please select a contract first" }) }));
            case "settings":
                return _jsx(Settings, { contractId: contractId });
            case "secondary":
                return walletAddress && contractId ? (_jsxs("div", { className: "page-section", children: [_jsx(SecondaryRoyaltyConfig, { contractId: contractId, walletAddress: walletAddress, onSuccess: () => { }, onRateUpdate: setRoyaltyRate }), _jsx(RecordSecondarySale, { contractId: contractId, walletAddress: walletAddress, royaltyRate: royaltyRate, onSuccess: () => { } }), _jsx(DistributeSecondaryRoyalties, { contractId: contractId, walletAddress: walletAddress, onSuccess: () => { } }), _jsx(ResaleHistory, { contractId: contractId })] })) : (_jsx("div", { className: "page-empty", children: _jsxs("div", { className: "empty-content", children: [_jsx("h2", { children: "Secondary Royalties" }), _jsx("p", { children: !walletAddress && !contractId
                                    ? "Please connect your wallet and select a contract to manage secondary royalties."
                                    : !walletAddress
                                        ? "Please connect your wallet to manage secondary royalties."
                                        : "Please select a contract to manage secondary royalties." })] }) }));
            default:
                return null;
        }
    };
    return (_jsxs("div", { className: "app-wrapper", children: [_jsx(Navigation, { currentPage: currentPage, onPageChange: setCurrentPage, walletAddress: walletAddress }), _jsxs("div", { className: "app-content", children: [_jsxs("div", { className: "app-sidebar", children: [_jsxs("div", { className: "sidebar-card", children: [_jsx("h3", { children: "\uD83D\uDD17 Wallet Connection" }), _jsx(WalletConnect, { onConnect: setWalletAddress })] }), _jsxs("div", { className: "sidebar-card", children: [_jsx("h3", { children: "\uD83D\uDCCB Contract ID" }), _jsx("input", { className: "contract-input", placeholder: "C...", value: contractId, onChange: (e) => handleContractChange(e.target.value) })] }), contractId && (_jsxs("div", { className: "sidebar-card", children: [_jsx("h3", { children: "\uD83D\uDCCA Quick Actions" }), _jsxs("div", { className: "quick-actions", children: [_jsx("button", { className: `quick-action-btn ${currentPage === "dashboard" ? "active" : ""}`, onClick: () => setCurrentPage("dashboard"), children: "Dashboard" }), _jsx("button", { className: `quick-action-btn ${currentPage === "transactions" ? "active" : ""}`, onClick: () => setCurrentPage("transactions"), children: "History" }), walletAddress && (_jsxs(_Fragment, { children: [_jsx("button", { className: `quick-action-btn ${currentPage === "initialize" ? "active" : ""}`, onClick: () => setCurrentPage("initialize"), children: "Initialize" }), _jsx("button", { className: `quick-action-btn ${currentPage === "distribute" ? "active" : ""}`, onClick: () => setCurrentPage("distribute"), children: "Distribute" }), _jsx("button", { className: `quick-action-btn ${currentPage === "secondary" ? "active" : ""}`, onClick: () => setCurrentPage("secondary"), children: "Secondary Royalties" })] }))] })] }))] }), _jsx("div", { className: "app-main", children: renderPage() })] })] }));
}
