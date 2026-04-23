import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { api } from "../api";
export default function CollaboratorTable({ contractId, refreshKey }) {
    const [collaborators, setCollaborators] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    useEffect(() => {
        if (!contractId)
            return;
        setLoading(true);
        setError("");
        api
            .getCollaborators(contractId)
            .then(setCollaborators)
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, [contractId, refreshKey]);
    if (!contractId)
        return null;
    if (loading)
        return _jsx("div", { className: "card status info", children: "Loading collaborators\u2026" });
    if (error)
        return _jsx("div", { className: "card status error", children: error });
    if (!collaborators.length)
        return null;
    return (_jsxs("div", { className: "card", children: [_jsx("span", { className: "badge", children: "Collaborators" }), _jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Address" }), _jsx("th", { style: { textAlign: "right" }, children: "Share" })] }) }), _jsx("tbody", { children: collaborators.map((c) => (_jsxs("tr", { children: [_jsx("td", { children: c.address }), _jsxs("td", { children: [(c.basisPoints / 100).toFixed(2), "%", _jsx("div", { className: "share-bar", style: { width: `${c.basisPoints / 100}%` } })] })] }, c.address))) })] })] }));
}
