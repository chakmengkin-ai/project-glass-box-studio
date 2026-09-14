# ASC IMAGE Mobile

Mobile-first image generation and editing studio for A SYMMETRY COLLECTIVE DESIGN.

## Goal
Open from phone or tablet, upload a source image, choose AUTO / FLARE / SUNBURST, enter a revision instruction, generate, compare source vs output, and save/share.

## Models
- `gpt-image-2.5-flare` — fast everyday generation / iteration
- `gpt-image-2.5-sunburst` — precision-focused generation / editing
- AUTO routes source-sensitive / precision language to Sunburst and simpler requests to Flare.

## Local run
```bash
npm install
cp .env.example .env.local
# configure OPENAI_API_KEY securely
npm run dev
```

## Production target
Deploy to Vercel. Keep `OPENAI_API_KEY` server-side only. Do not expose it in browser code.

## Codex handoff
Read `AGENTS.md` first. The required end state is a tested production URL that works on phone/tablet, not just localhost.
