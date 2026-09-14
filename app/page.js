'use client';

import { useEffect, useMemo, useState } from 'react';

export default function Home() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [result, setResult] = useState('');
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState('auto');
  const [quality, setQuality] = useState('auto');
  const [size, setSize] = useState('auto');
  const [sourceLock, setSourceLock] = useState('high');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [usedModel, setUsedModel] = useState('');

  useEffect(() => {
    if (!file) { setPreview(''); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const modelLabel = useMemo(() => {
    if (mode === 'flare') return 'FLARE';
    if (mode === 'sunburst') return 'SUNBURST';
    return 'AUTO';
  }, [mode]);

  async function generate(e) {
    e.preventDefault();
    setBusy(true); setError(''); setResult(''); setUsedModel('');
    try {
      const fd = new FormData();
      if (file) fd.append('image', file);
      fd.append('prompt', prompt);
      fd.append('mode', mode);
      fd.append('quality', quality);
      fd.append('size', size);
      fd.append('sourceLock', sourceLock);
      const res = await fetch('/api/generate', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed.');
      setResult(data.image);
      setUsedModel(data.model);
    } catch (err) {
      setError(err.message || 'Generation failed.');
    } finally { setBusy(false); }
  }

  async function shareResult() {
    if (!result) return;
    try {
      const blob = await (await fetch(result)).blob();
      const shareFile = new File([blob], 'ASC-IMAGE.png', { type: blob.type || 'image/png' });
      if (navigator.share && navigator.canShare?.({ files: [shareFile] })) {
        await navigator.share({ title: 'ASC IMAGE', files: [shareFile] });
      } else {
        const a = document.createElement('a'); a.href = result; a.download = 'ASC-IMAGE.png'; a.click();
      }
    } catch { /* user cancelled */ }
  }

  return (
    <main className="shell">
      <header className="topbar">
        <div><div className="eyebrow">A SYMMETRY COLLECTIVE DESIGN</div><h1>ASC IMAGE</h1></div>
        <div className="status">2.5</div>
      </header>

      <form onSubmit={generate} className="stack">
        <section className="card uploadCard">
          <label className="uploadZone">
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            {preview ? <img src={preview} alt="Source preview" /> : <div className="uploadEmpty"><span>＋</span><strong>Source image</strong><small>Camera · Gallery · Files</small></div>}
          </label>
          {preview && <button type="button" className="textButton" onClick={() => setFile(null)}>Remove source</button>}
        </section>

        <section className="card">
          <div className="sectionLabel">MODEL</div>
          <div className="segmented three">
            {['auto','flare','sunburst'].map((x) => <button type="button" key={x} className={mode===x?'active':''} onClick={() => setMode(x)}>{x.toUpperCase()}</button>)}
          </div>
          <div className="modelHint">{modelLabel === 'AUTO' ? 'ASC routes precision edits to Sunburst; fast edits to Flare.' : modelLabel === 'FLARE' ? 'Fast everyday generation and iteration.' : 'Maximum precision for source-sensitive editing.'}</div>
        </section>

        <section className="card">
          <label className="sectionLabel" htmlFor="prompt">INSTRUCTION</label>
          <textarea id="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Example: Replace only the TV wall material with warm grey travertine. Preserve everything else exactly." required />
        </section>

        <section className="card gridCard">
          <label><span className="sectionLabel">SOURCE LOCK</span><select value={sourceLock} onChange={(e)=>setSourceLock(e.target.value)} disabled={!file}><option value="high">High</option><option value="medium">Medium</option><option value="off">Off</option></select></label>
          <label><span className="sectionLabel">QUALITY</span><select value={quality} onChange={(e)=>setQuality(e.target.value)}><option value="auto">Auto</option><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="xhigh">X-High</option><option value="max">Max</option></select></label>
          <label><span className="sectionLabel">OUTPUT</span><select value={size} onChange={(e)=>setSize(e.target.value)}><option value="auto">Auto</option><option value="1024x1024">Square</option><option value="1536x1024">Landscape</option><option value="1024x1536">Portrait</option></select></label>
        </section>

        <button className="generate" disabled={busy || !prompt.trim()}>{busy ? 'GENERATING…' : `GENERATE · ${modelLabel}`}</button>
      </form>

      {error && <div className="error">{error}</div>}

      {result && <section className="resultArea">
        <div className="resultHeader"><span>RESULT</span><small>{usedModel.replace('gpt-image-2.5-','').toUpperCase()}</small></div>
        <div className="compare">
          {preview && <div><small>SOURCE</small><img src={preview} alt="Source" /></div>}
          <div><small>OUTPUT</small><img src={result} alt="Generated result" /></div>
        </div>
        <div className="actions"><button onClick={shareResult}>SAVE / SHARE</button><button onClick={() => { setFile(null); setPrompt(''); setResult(''); }}>NEW</button></div>
      </section>}

      <footer>Source-lock first. Minimum change. No unnecessary drift.</footer>
    </main>
  );
}
