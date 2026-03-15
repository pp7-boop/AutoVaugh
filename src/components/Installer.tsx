import { useEffect, useState } from "react";
import { installApi } from "../lib/client";
import { sites } from "../config/sites";

type Niche = { name: string; desc: string; volume: string; affiliate: number; competition: string; rpm: number; angles: string[]; fit: string };

export default function Installer() {
  const [domain, setDomain] = useState(sites[0].domain);
  const [niches, setNiches] = useState<Niche[]>([]);
  const [plan, setPlan] = useState("5/wk");
  const [images, setImages] = useState(5);
  const [video, setVideo] = useState("none");
  const [keys, setKeys] = useState({ gemini: "", unsplash: "", youtube: "", gsc: "" });
  const [status, setStatus] = useState<string[]>([]);
  const [deploying, setDeploying] = useState(false);

  async function analyzeDomain() {
    const res: any = await installApi.post("/analyze-domain", { domain });
    setNiches(res?.niches || []);
  }

  async function deploy(niche: Niche) {
    setDeploying(true);
    const res: any = await installApi.post("/provision", { domain, niche, plan, images, video, keys });
    setStatus(s => [...s, `Deployed → ${res?.url || domain}`]);
    setDeploying(false);
  }

  useEffect(() => { analyzeDomain(); }, [domain]);

  return (
    <div className="installer-card">
      <h1>One-click Autoblog Deploy</h1>
      <label>Domain
        <select value={domain} onChange={e=>setDomain(e.target.value)}>
          {sites.map(s => <option key={s.domain} value={s.domain}>{s.domain}</option>)}
        </select>
      </label>
      <button onClick={analyzeDomain}>Refresh Recommendations</button>

      <div className="niche-grid">
        {niches.map(n => (
          <article key={n.name}>
            <header>
              <h3>{n.name}</h3>
              <p>{n.desc}</p>
            </header>
            <ul>
              <li>Search Volume: {n.volume}</li>
              <li>Affiliate Score: {n.affiliate}/10</li>
              <li>Competition: {n.competition}</li>
              <li>RPM: ${n.rpm}</li>
              <li>Angles: {n.angles.join(', ')}</li>
              <li>Fit: {n.fit}</li>
            </ul>
            <button disabled={deploying} onClick={() => deploy(n)}>Deploy this niche</button>
          </article>
        ))}
      </div>

      <div className="controls">
        <div>
          <h4>Content Volume</h4>
          {['3/wk','5/wk','7/wk','14/wk'].map(v => (
            <label key={v}><input type="radio" checked={plan===v} onChange={()=>setPlan(v)} /> {v}</label>
          ))}
        </div>
        <div>
          <h4>Images/article</h4>
          {[3,5,8].map(v => (
            <label key={v}><input type="radio" checked={images===v} onChange={()=>setImages(v)} /> {v}</label>
          ))}
        </div>
        <div>
          <h4>Video</h4>
          {['none','short','long'].map(v => (
            <label key={v}><input type="radio" checked={video===v} onChange={()=>setVideo(v)} /> {v}</label>
          ))}
        </div>
      </div>

      <div className="keys">
        {Object.keys(keys).map(k => (
          <label key={k}>{k.toUpperCase()}
            <input value={(keys as any)[k]} onChange={e=>setKeys({...keys,[k]:e.target.value})} placeholder={`enter ${k} key`} />
          </label>
        ))}
      </div>

      <div className="status">
        {status.map((s,i) => <div key={i}>{s}</div>)}
      </div>
    </div>
  );
}
