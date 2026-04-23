import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import "./Settings.css";
export const Settings = ({ contractId }) => {
    const { isDark, toggleTheme } = useTheme();
    const [settings, setSettings] = useState({
        autoSaveAuditLog: true,
        notifyOnDistribution: true,
        displayCurrency: "XLM",
        maxPayoutsPerTransaction: 10,
        minPayoutAmount: 0.1,
        enableEmailNotifications: false,
        emailAddress: "",
    });
    const [saveStatus, setSaveStatus] = useState(null);
    const handleToggle = (key) => {
        const newValue = !settings[key];
        setSettings({ ...settings, [key]: newValue });
        showSaveStatus("Saving...");
    };
    const handleChange = (key, value) => {
        setSettings({ ...settings, [key]: value });
    };
    const handleDarkMode = () => {
        toggleTheme();
        showSaveStatus("✓ Theme updated!");
    };
    const handleSave = () => {
        // Save to localStorage for persistence
        localStorage.setItem("royaltySplitterSettings", JSON.stringify(settings));
        showSaveStatus("✓ Settings saved successfully!");
    };
    const handleReset = () => {
        if (window.confirm("Reset all settings to defaults?")) {
            const defaults = {
                autoSaveAuditLog: true,
                notifyOnDistribution: true,
                displayCurrency: "XLM",
                maxPayoutsPerTransaction: 10,
                minPayoutAmount: 0.1,
                enableEmailNotifications: false,
                emailAddress: "",
            };
            setSettings(defaults);
            localStorage.removeItem("royaltySplitterSettings");
            showSaveStatus("✓ Settings reset to defaults!");
        }
    };
    const showSaveStatus = (message) => {
        setSaveStatus(message);
        setTimeout(() => setSaveStatus(null), 3000);
    };
    return (_jsxs("div", { className: "settings", children: [_jsxs("div", { className: "settings-header", children: [_jsx("h1", { children: "\u2699\uFE0F Settings" }), _jsxs("p", { className: "settings-subtitle", children: ["Contract ID: ", contractId || "Not connected"] })] }), saveStatus && _jsx("div", { className: "save-status", children: saveStatus }), _jsxs("div", { className: "settings-content", children: [_jsxs("section", { className: "settings-section", children: [_jsx("h2", { className: "section-title", children: "General" }), _jsxs("div", { className: "setting-item", children: [_jsxs("div", { className: "setting-label", children: [_jsx("label", { htmlFor: "currency", children: "Display Currency" }), _jsx("p", { className: "setting-description", children: "Choose your preferred currency for displaying amounts" })] }), _jsxs("select", { id: "currency", value: settings.displayCurrency, onChange: (e) => handleChange("displayCurrency", e.target.value), className: "setting-select", children: [_jsx("option", { value: "XLM", children: "Stellar Lumens (XLM)" }), _jsx("option", { value: "USD", children: "US Dollars (USD)" }), _jsx("option", { value: "EUR", children: "Euros (EUR)" })] })] }), _jsxs("div", { className: "setting-item", children: [_jsxs("div", { className: "setting-label", children: [_jsx("label", { htmlFor: "darkMode", children: "Dark Mode" }), _jsx("p", { className: "setting-description", children: "Enable dark theme for the dashboard" })] }), _jsx("button", { className: `toggle-btn ${isDark ? "active" : ""}`, onClick: handleDarkMode, id: "darkMode", children: isDark ? "ON" : "OFF" })] })] }), _jsxs("section", { className: "settings-section", children: [_jsx("h2", { className: "section-title", children: "Distribution" }), _jsxs("div", { className: "setting-item", children: [_jsxs("div", { className: "setting-label", children: [_jsx("label", { htmlFor: "maxPayouts", children: "Max Payouts Per Transaction" }), _jsx("p", { className: "setting-description", children: "Maximum number of collaborators to pay in a single transaction" })] }), _jsx("input", { id: "maxPayouts", type: "number", min: "1", max: "100", value: settings.maxPayoutsPerTransaction, onChange: (e) => handleChange("maxPayoutsPerTransaction", parseInt(e.target.value)), className: "setting-input" })] }), _jsxs("div", { className: "setting-item", children: [_jsxs("div", { className: "setting-label", children: [_jsx("label", { htmlFor: "minPayout", children: "Minimum Payout Amount (XLM)" }), _jsx("p", { className: "setting-description", children: "Minimum amount required for a payout transaction" })] }), _jsx("input", { id: "minPayout", type: "number", min: "0.1", step: "0.1", value: settings.minPayoutAmount, onChange: (e) => handleChange("minPayoutAmount", parseFloat(e.target.value)), className: "setting-input" })] }), _jsxs("div", { className: "setting-item", children: [_jsxs("div", { className: "setting-label", children: [_jsx("label", { htmlFor: "autoSave", children: "Auto-Save Audit Log" }), _jsx("p", { className: "setting-description", children: "Automatically save transaction audit logs" })] }), _jsx("button", { className: `toggle-btn ${settings.autoSaveAuditLog ? "active" : ""}`, onClick: () => handleToggle("autoSaveAuditLog"), id: "autoSave", children: settings.autoSaveAuditLog ? "ON" : "OFF" })] })] }), _jsxs("section", { className: "settings-section", children: [_jsx("h2", { className: "section-title", children: "Notifications" }), _jsxs("div", { className: "setting-item", children: [_jsxs("div", { className: "setting-label", children: [_jsx("label", { htmlFor: "notifyDist", children: "Notify on Distribution" }), _jsx("p", { className: "setting-description", children: "Send notification when distributions are processed" })] }), _jsx("button", { className: `toggle-btn ${settings.notifyOnDistribution ? "active" : ""}`, onClick: () => handleToggle("notifyOnDistribution"), id: "notifyDist", children: settings.notifyOnDistribution ? "ON" : "OFF" })] }), _jsxs("div", { className: "setting-item", children: [_jsxs("div", { className: "setting-label", children: [_jsx("label", { htmlFor: "emailNotif", children: "Email Notifications" }), _jsx("p", { className: "setting-description", children: "Receive email updates about your distributions" })] }), _jsx("button", { className: `toggle-btn ${settings.enableEmailNotifications ? "active" : ""}`, onClick: () => handleToggle("enableEmailNotifications"), id: "emailNotif", children: settings.enableEmailNotifications ? "ON" : "OFF" })] }), settings.enableEmailNotifications && (_jsxs("div", { className: "setting-item", children: [_jsxs("div", { className: "setting-label", children: [_jsx("label", { htmlFor: "emailAddr", children: "Email Address" }), _jsx("p", { className: "setting-description", children: "Where to send notification emails" })] }), _jsx("input", { id: "emailAddr", type: "email", value: settings.emailAddress, onChange: (e) => handleChange("emailAddress", e.target.value), className: "setting-input", placeholder: "your@email.com" })] }))] }), _jsxs("section", { className: "settings-section", children: [_jsx("h2", { className: "section-title", children: "About" }), _jsxs("div", { className: "about-content", children: [_jsxs("div", { className: "about-item", children: [_jsx("h3", { children: "Stellar Royalty Splitter" }), _jsx("p", { children: "Version 1.0.0" }), _jsx("p", { className: "about-description", children: "A decentralized platform for managing royalty distributions using the Stellar blockchain." })] }), _jsxs("div", { className: "about-item", children: [_jsx("h3", { children: "Smart Contract" }), _jsx("p", { children: "Soroban Runtime" }), _jsx("p", { className: "about-description", children: "Built on Stellar Testnet for secure, transparent transactions." })] }), _jsxs("div", { className: "about-item", children: [_jsx("h3", { children: "Support" }), _jsx("p", { children: _jsx("a", { href: "https://stellar.org", target: "_blank", rel: "noopener noreferrer", children: "Stellar Docs" }) }), _jsx("p", { children: _jsx("a", { href: "https://github.com", target: "_blank", rel: "noopener noreferrer", children: "GitHub Repository" }) })] })] })] })] }), _jsxs("div", { className: "settings-actions", children: [_jsx("button", { className: "btn-primary", onClick: handleSave, children: "\uD83D\uDCBE Save Settings" }), _jsx("button", { className: "btn-secondary", onClick: handleReset, children: "\uD83D\uDD04 Reset to Defaults" })] })] }));
};
