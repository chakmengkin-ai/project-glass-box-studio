# ASC IMAGE Mobile — Codex Execution Contract

## Objective
Deliver this repository as a working production mobile-first web app, deployed to the user's connected Vercel account. Do not stop at localhost, source code, or instructions. The task is complete only when a tested production URL is available.

## Product behavior
- Mobile-first PWA for phone/tablet.
- Upload a source image from camera, gallery, or files.
- Modes: AUTO / FLARE / SUNBURST.
- Flare model ID: `gpt-image-2.5-flare`.
- Sunburst model ID: `gpt-image-2.5-sunburst`.
- AUTO: ordinary/faster generation and low-risk iteration -> Flare; precision/source-sensitive/editing requests -> Sunburst.
- Preserve source-lock behavior and minimum-change prompt logic.
- Support generation without a source image and revision/editing with a source image.
- Verify the currently supported OpenAI endpoint for source-image workflows for each model. Do not assume Flare supports `/v1/images/edits`; use the current supported Image API or Responses API path if needed.
- Quality options should support current model values: auto, low, medium, high, xhigh, max.
- Keep output comparison and save/share behavior.

## Security
- `OPENAI_API_KEY` must exist server-side only.
- Never commit, echo, log, expose, or send the raw key to the client.
- Use Vercel environment variables for production.

## Deployment
- Target the user's connected Vercel workspace, preferably `ken's projects`.
- Install dependencies and run a production build.
- Fix build/runtime issues rather than merely reporting them.
- Deploy production to Vercel.
- Inspect build/runtime logs if anything fails.
- Test the deployed URL at phone width and confirm the page loads.
- Test at least one server request path far enough to confirm the backend route is wired correctly; if API billing/key authorization prevents a full image generation, report that specific blocker rather than claiming success.

## Scope guard
Keep V1 focused. Do not add authentication, databases, analytics, ComfyUI, project management, or unrelated features unless required for basic operation.
