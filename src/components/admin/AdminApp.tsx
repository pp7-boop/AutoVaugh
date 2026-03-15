import { useEffect, useState } from "react";
import { api } from "../../lib/client";

export default function AdminApp() {
  const [calendar, setCalendar] = useState<any[]>([]);
  const [keyword, setKeyword] = useState("");

  useEffect(() => { api.get("/articles?limit=20").then((data:any) => setCalendar(Array.isArray(data)?data:[])); }, []);

  async function trigger() {
    await api.post("/admin/job", { keyword });
    setKeyword("");
  }

  return (
    <div className="admin-app">
      <h2>Editorial Queue</h2>
      <ul>{calendar.map(a => <li key={a.slug}>{a.primary_keyword} — {a.published_at?.slice(0,10)}</li>)}</ul>

      <h3>Manual generation</h3>
      <input value={keyword} onChange={e=>setKeyword(e.target.value)} placeholder="primary keyword" />
      <button onClick={trigger}>Enqueue</button>
    </div>
  );
}
