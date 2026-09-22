# BJOT Board Template Renderer

## Purpose and architecture

This is a client-side React/Next.js editor for producing consistent branded UTME question-and-solution PNG cards. `app/page.tsx` owns the editable lesson model, preview, subject-template selection, notation cleanup, and `html-to-image` export. `app/template2.css` and `app/arts.css` contain the science and arts layouts. Static brand assets live in `public`.

## Verified commands

```bash
npm ci
npm run dev
npm run lint
npm run build
```

Node.js 22.13 or newer is required. The build uses Vinext, Vite, and the Cloudflare plugin.

## Working rules

- Preserve the fixed 920 × 1080 poster canvas unless a requested template change explicitly alters it.
- Keep the editor state, live preview, and downloaded PNG derived from the same content object.
- Test both a science subject and a non-science subject after layout changes.
- Check long questions, solutions, and tips for clipping before considering a visual change complete.
- Never commit `.env` files, generated output folders, deployment caches, or credentials.
- Run lint and build after implementation changes. Report the existing `<img>` performance warning separately from errors.
