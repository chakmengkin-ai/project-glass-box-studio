export const runtime = 'nodejs';
export const maxDuration = 300;

const precisionWords = [
  'preserve', 'source lock', 'source-lock', 'exact', 'unchanged', 'geometry',
  'joinery', 'signage', 'typography', 'text', 'logo', 'only change', 'minimum change',
  'minimum-change', 'camera', 'composition', 'proportion', 'repair', 'final', 'editorial'
];

function chooseModel(mode, prompt) {
  if (mode === 'flare') return 'gpt-image-2.5-flare';
  if (mode === 'sunburst') return 'gpt-image-2.5-sunburst';
  const p = prompt.toLowerCase();
  return precisionWords.some((w) => p.includes(w))
    ? 'gpt-image-2.5-sunburst'
    : 'gpt-image-2.5-flare';
}

export async function POST(request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return Response.json({ error: 'OPENAI_API_KEY is not configured on the server.' }, { status: 500 });
    }

    const incoming = await request.formData();
    const prompt = String(incoming.get('prompt') || '').trim();
    const mode = String(incoming.get('mode') || 'auto');
    const quality = String(incoming.get('quality') || 'auto');
    const size = String(incoming.get('size') || 'auto');
    const sourceLock = String(incoming.get('sourceLock') || 'high');
    const image = incoming.get('image');

    if (!prompt) return Response.json({ error: 'Add an instruction first.' }, { status: 400 });

    const model = chooseModel(mode, prompt);
    const lockInstruction = image && sourceLock !== 'off'
      ? `\n\nSOURCE LOCK (${sourceLock.toUpperCase()}): Treat the uploaded image as the authoritative source. Preserve camera, composition, perspective, architecture, proportions, openings, ceiling geometry, joinery geometry, furniture placement, lighting fixture positions, floor pattern and all unspecified elements. Apply only the requested change. Do not redesign unrelated areas.`
      : '';
    const finalPrompt = prompt + lockInstruction;

    let upstream;
    if (image && typeof image !== 'string' && image.size > 0) {
      const form = new FormData();
      form.append('model', model);
      form.append('prompt', finalPrompt);
      form.append('image', image, image.name || 'source.png');
      form.append('quality', quality);
      if (size !== 'auto') form.append('size', size);
      upstream = await fetch('https://api.openai.com/v1/images/edits', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}` },
        body: form
      });
    } else {
      const body = { model, prompt: finalPrompt, quality };
      if (size !== 'auto') body.size = size;
      upstream = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
    }

    const data = await upstream.json();
    if (!upstream.ok) {
      return Response.json({ error: data?.error?.message || 'OpenAI image request failed.', details: data }, { status: upstream.status });
    }

    const item = data?.data?.[0];
    const imageData = item?.b64_json ? `data:image/png;base64,${item.b64_json}` : item?.url;
    if (!imageData) return Response.json({ error: 'The API returned no image.', details: data }, { status: 502 });

    return Response.json({ image: imageData, model, quality, revisedPrompt: item?.revised_prompt || null });
  } catch (error) {
    return Response.json({ error: error?.message || 'Unexpected server error.' }, { status: 500 });
  }
}
