const defaultApi = 'https://api.vaughnsterling.com';
// On preview (pages.dev) or local, fall back to workers.dev if provided
const previewApi = import.meta.env.PUBLIC_PREVIEW_API_BASE || import.meta.env.PUBLIC_API_BASE || defaultApi;
const API_BASE = import.meta.env.PUBLIC_API_BASE || (import.meta.env.DEV ? 'http://127.0.0.1:8787' : previewApi);

export const installApi = {
  async post(path: string, body: any, opts: { onMessage?:(line:string)=>void } = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (opts.onMessage) {
      const text = await res.text();
      text.split(/\n/).forEach(opts.onMessage);
      return { url: undefined };
    }
    return res.json();
  }
};

export const api = {
  async get(path: string) {
    const res = await fetch(`${API_BASE}${path}`);
    return res.json();
  },
  async post(path: string, body: any) {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    return res.json();
  }
};
