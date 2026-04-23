import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import "./Navigation.css";
export const Navigation = ({ currentPage, onPageChange, walletAddress, }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    function copyAddress() {
        if (!walletAddress)
            return;
        navigator.clipboard.writeText(walletAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };
    const handleNavClick = (page) => {
        onPageChange(page);
        setIsMobileMenuOpen(false);
    };
    const navItems = [
        { id: "dashboard", label: "Dashboard", icon: "📊" },
        { id: "transactions", label: "Transactions", icon: "📋" },
        { id: "admin", label: "Admin", icon: "👑" },
        { id: "initialize", label: "Initialize", icon: "⚙️" },
        { id: "distribute", label: "Distribute", icon: "💰" },
        { id: "secondary", label: "Secondary Royalties", icon: "🔄" },
        { id: "settings", label: "Settings", icon: "⚡" },
    ];
    return (_jsx("nav", { className: "navigation", children: _jsxs("div", { className: "nav-container", children: [_jsxs("div", { className: "nav-brand", children: [_jsx("div", { className: "nav-logo", children: "\uD83C\uDF1F" }), _jsx("h1", { children: "Stellar Splitter" })] }), _jsx("button", { className: "mobile-menu-btn", onClick: toggleMobileMenu, "aria-label": "Toggle menu", children: isMobileMenuOpen ? "✕" : "☰" }), _jsx("ul", { className: `nav-links ${isMobileMenuOpen ? "active" : ""}`, children: navItems.map((item) => (_jsx("li", { children: _jsxs("button", { className: `nav-link ${currentPage === item.id ? "active" : ""}`, onClick: () => handleNavClick(item.id), "aria-current": currentPage === item.id ? "page" : undefined, children: [_jsx("span", { className: "nav-icon", children: item.icon }), _jsx("span", { className: "nav-label", children: item.label })] }) }, item.id))) }), _jsx("div", { className: "nav-wallet", children: walletAddress && (_jsxs(_Fragment, { children: [_jsxs("span", { className: "wallet-info", title: walletAddress, children: [walletAddress.slice(0, 6), "...", walletAddress.slice(-4)] }), _jsx("button", { className: "copy-address-btn", onClick: copyAddress, title: "Copy full address", "aria-label": "Copy wallet address", children: copied ? "✓" : "⧉" })] })) })] }) }));
};
