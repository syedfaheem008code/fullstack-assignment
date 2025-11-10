import React, { useEffect, useState } from "react";
import { api } from "../api/client";
import { PageResp, Screen } from "../types";

export default function ScreensPage() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [resp, setResp] = useState<PageResp<Screen> | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function fetchData() {
    setLoading(true); setErr(null);
    try {
      const { data } = await api.get("/screens", { params: { search: q, page, limit: 10 } });
      setResp(data);
    } catch (e: any) {
      setErr(e?.response?.data?.error || "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchData(); /* eslint-disable-next-line */ }, [page]);

  function onSearch(e: React.FormEvent) { e.preventDefault(); setPage(1); fetchData(); }

  async function toggle(id: string) {
    if (!resp) return;
    const prev = resp.items;
    const next = prev.map(s => s._id === id ? { ...s, isActive: !s.isActive } : s);
    setResp({ ...resp, items: next });
    try { await api.put(`/screens/${id}`); }
    catch { setResp({ ...resp, items: prev }); alert("Failed to toggle"); }
  }

  return (
    <div style={{ maxWidth: 800, margin: "16px auto" }}>
      <h3>Screens</h3>
      <form onSubmit={onSearch} style={{ display: "flex", gap: 8 }}>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by name" />
        <button>Search</button>
      </form>
      {loading && <p>Loading...</p>}
      {err && <p style={{ color: "red" }}>{err}</p>}
      <table style={{ width: "100%", marginTop: 12, borderCollapse: "collapse" }}>
        <thead><tr><th align="left">Name</th><th>Active</th><th>Action</th></tr></thead>
        <tbody>
          {resp?.items.map(s => (
            <tr key={s._id}>
              <td>{s.name}</td>
              <td align="center">{s.isActive ? "Yes" : "No"}</td>
              <td align="center"><button onClick={() => toggle(s._id)}>Toggle</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <button disabled={page<=1} onClick={()=>setPage(p=>p-1)}>Prev</button>
        <span>Page {resp?.page || page} / {resp?.totalPages || 1}</span>
        <button disabled={!resp || page>= (resp.totalPages || 1)} onClick={()=>setPage(p=>p+1)}>Next</button>
      </div>
    </div>
  );
}
