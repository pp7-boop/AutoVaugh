export const installApi = {
  async post(path: string, body: any, opts: { onMessage?:(line:string)=>void } = {}) {
    const res = await fetch(`/api${path}`, {
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
    const res = await fetch(`/api${path}`);
    return res.json();
  },
  async post(path: string, body: any) {
    const res = await fetch(`/api${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    return res.json();
  }
};
