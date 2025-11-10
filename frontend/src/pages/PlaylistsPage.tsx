import React, { useEffect, useState } from "react";
import { api } from "../api/client";
import { PageResp, PlaylistListItem } from "../types";

export default function PlaylistsPage() {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [list, setList] = useState<PageResp<PlaylistListItem> | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setLoading(true); setErr(null);
    try { const { data } = await api.get("/playlists", { params: { limit: 20 } }); setList(data); }
    catch (e: any) { setErr(e?.response?.data?.error || "Failed to load"); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const itemUrls = text.split("\n").map(s => s.trim()).filter(Boolean);
      await api.post("/playlists", { name: name.trim(), itemUrls });
      setName(""); setText(""); await load();
    } catch (e: any) { alert(JSON.stringify(e?.response?.data, null, 2)); }
  }

  return (
    <div style={{ maxWidth: 800, margin: "16px auto" }}>
      <h3>Playlists</h3>
      <form onSubmit={submit} style={{ display: "grid", gap: 8, maxWidth: 500 }}>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" required />
        <textarea value={text} onChange={e=>setText(e.target.value)} rows={6}
          placeholder="One URL per line (optional, max 10)" />
        <button>Create</button>
      </form>
      {loading && <p>Loading...</p>}
      {err && <p style={{ color: "red" }}>{err}</p>}
      <ul>{list?.items.map(p => (<li key={p._id}>{p.name} — items: {p.itemCount}</li>))}</ul>
    </div>
  );
}
