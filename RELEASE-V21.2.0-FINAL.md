# JYC Website V23.0.0 — Final Release

## What changed

- Added an **Agentic AI bridge modal** that automatically opens on every fresh load of the JYC home page and Events routes, including direct event-detail URLs. It does not use first-visit storage, so returning users see it too.
- Rebuilt the bridge as a **separate Agentic AI visual system** rather than a JYC/Phoenix card: dark technical canvas, neural nodes, scanline, luminous core, JAI/AGENTIC identity and dedicated event CTA.
- Preserved the external Agentic AI experience link: `https://demo-agentic-ai-website.vercel.app/`.
- Removed duplicate Phoenix treatments from loading/404 states and removed the theme-switch flight bird from source. The hero remains the primary Phoenix brand moment.
- Removed the remaining hero "Next JYC Moment" plaque so the homepage does not reintroduce the previously rejected utility.
- Removed orbit artwork from the interactive Phoenix component at source level rather than only hiding it with CSS.
- Kept the Phoenix behind the hero content and retained the home scroll-aware navigation.
- Strengthened public-page centering, max-widths, mobile gutters and long-title wrapping.
- Kept the 21-community hub directory/content layer and the supplied JYC programme material from the previous release.
- Added release-level documentation and retained the GitHub CI / security / SEO / browser-QA structure.

## QA intent

The release is designed for a GitHub repository workflow:

```bash
npm ci
npm run qa
npm run build
npm run qa:browser
```

The final packaging step deliberately excludes `node_modules` and generated `dist` output.

## Build Fix — Lightning CSS compatibility

Fixed invalid CSS animation identifiers in the legacy V19/V20 view-transition styles. Animation names beginning with numeric characters were renamed to valid CSS identifiers (`jyc19-*` / `jyc20-*`), allowing Vite 8 + Lightning CSS production minification to parse the stylesheet correctly.
