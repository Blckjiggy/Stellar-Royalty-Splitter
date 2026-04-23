// Thin client that talks to the Express backend
const BASE = "/api";
async function post(path, body) {
    const res = await fetch(`${BASE}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok)
        throw new Error(data.error ?? "Request failed");
    return data;
}
async function get(path) {
    const res = await fetch(`${BASE}${path}`);
    const data = await res.json();
    if (!res.ok)
        throw new Error(data.error ?? "Request failed");
    return data;
}
export const api = {
    initialize: (body) => post("/initialize", body),
    distribute: (body) => post("/distribute", body),
    getCollaborators: (contractId) => get(`/collaborators/${contractId}`),
    // Transaction History & Audit Log APIs
    getTransactionHistory: (contractId, limit = 50, offset = 0) => get(`/history/${contractId}?limit=${limit}&offset=${offset}`),
    getTransactionDetails: (txHash) => get(`/transaction/${txHash}`),
    confirmTransaction: (txHash, body) => post(`/transaction/confirm/${txHash}`, body),
    getAuditLog: (contractId, limit = 100, offset = 0) => get(`/audit/${contractId}?limit=${limit}&offset=${offset}`),
    addAuditLog: (contractId, body) => post(`/audit/${contractId}`, body),
    // Secondary Royalty APIs
    recordSecondarySale: (body) => post("/secondary-royalty", body),
    setRoyaltyRate: (body) => post("/secondary-royalty/set-rate", body),
    distributeSecondaryRoyalties: (body) => post("/secondary-royalty/distribute", body),
    getRoyaltyStats: (contractId) => get(`/secondary-royalty/stats/${contractId}`),
    getSecondarySales: (contractId, limit = 50, offset = 0, nftId) => get(`/secondary-royalty/sales/${contractId}?limit=${limit}&offset=${offset}${nftId ? `&nftId=${nftId}` : ""}`),
    getSecondaryRoyaltyDistributions: (contractId, limit = 50, offset = 0) => get(`/secondary-royalty/distributions/${contractId}?limit=${limit}&offset=${offset}`),
    // Analytics API
    getAnalytics: (contractId, dateRange) => get(`/analytics/${contractId}${dateRange ? `?start=${dateRange.start}&end=${dateRange.end}` : ""}`),
};
