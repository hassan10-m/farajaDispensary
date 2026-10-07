import { makeResource, request } from "./client";

// Endpoints zinazodhaniwa. Zibadilishe kulingana na Controllers zako.
export const patients  = makeResource("/patients");
export const queue     = makeResource("/queue");
export const medicines = makeResource("/medicines");
export const bills     = makeResource("/bills");
export const users     = makeResource("/users");

// Mfano wa vitendo maalum (si CRUD tu)
export const callNext   = () => request("/queue/next", { method: "POST" });
export const payBill    = (id) => request(`/bills/${id}/pay`, { method: "POST" });
export const getSummary = () => request("/reports/summary");

export * as auth from "./auth";
