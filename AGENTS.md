# AGENTS.md - Keen Creative JP

Practical guide for agentic coding assistants working in this repository.

## 1) Project Snapshot
- Framework: Astro 5 (`astro`)
- Styling: Tailwind CSS v4 via `@tailwindcss/vite`
- Language: TypeScript strict mode
- Deployment target: Cloudflare Pages (static output)
- Content profile: Japanese + Traditional Chinese + Simplified Chinese + English

Primary files to inspect first:
- `package.json`
- `astro.config.mjs`
- `tsconfig.json`
- `src/layouts/BaseLayout.astro`
- `src/components/*.astro`
- `src/pages/**/*.astro`
- `src/styles/global.css`

## 2) Repository Structure (Observed)
```text
src/
  components/
    Footer.astro
    Header.astro
    SEO.astro
  layouts/
    BaseLayout.astro
  pages/
    index.astro
    about.astro
    services.astro
    contact.astro
    ja/*.astro
    en/*.astro
    zh/*.astro
    zh-hant/*.astro
  styles/
    global.css
public/
  images/
```

## 3) Build / Lint / Test Commands
Run all commands from repo root.

```bash
# Development
npm run dev

# Project diagnostics / type checks
npm run check
npm run lint

# Production build (includes check)
npm run build

# Local preview
npm run preview

# Astro CLI passthrough
npm run astro -- --help

# Single-file Astro check
npx astro check src/pages/contact.astro
```

### Command facts (verified from `package.json`)
- `check` = `astro check`
- `lint` = `astro check` (not ESLint)
- `build` = `astro check && astro build`

## 4) Testing Reality (Important)
There is currently **no dedicated test runner** configured.

What was verified:
- No `test` script in `package.json`
- No Vitest/Jest/Playwright/Cypress/Mocha/Ava config in repo
- No valid “single test” command today

So verification currently means:
1. `npm run check`
2. `npm run build`
3. manual behavior review for affected pages/components

Do not claim tests passed if no tests were run.

## 5) Cursor / Copilot Rule Files
Checked and **not found**:
- `.cursorrules`
- `.cursor/rules/**`
- `.github/copilot-instructions.md`

Do not invent guidance from those files unless they are added later.

## 6) Architecture & Composition Conventions

### Layout-first page architecture
- Use `BaseLayout` for page structure.
- `BaseLayout` handles global CSS, SEO component, header, footer, and `<slot />`.

### Page localization structure
- Root pages often re-export default Japanese pages (e.g. `src/pages/index.astro` imports `./ja/index.astro`).
- Locale folders are route-based (`/en`, `/zh`, `/zh-hant`, default `/` for Japanese).

### Data-in-frontmatter pattern
- Keep small static collections in frontmatter (`const` arrays/maps), not separate data modules.
- Examples: nav labels and footer copy maps.

## 7) Imports, Formatting, and File Style

### Imports
- Use **relative imports** (current repository norm).
- Do not introduce alias imports ad hoc.

### Formatting style (observed)
- 2-space indentation.
- Single quotes in frontmatter JS/TS.
- Double quotes in HTML attributes.
- Semicolons are commonly present in frontmatter.

### File naming
- Components/layouts: PascalCase (`Header.astro`, `BaseLayout.astro`)
- Pages/routes: lowercase (`about.astro`, `services.astro`)
- Variables/props/functions: camelCase

## 8) TypeScript / Astro Conventions
- Strict config extends `astro/tsconfigs/strict`.
- Prefer `export interface Props` for typed component/layout props.
- Destructure `Astro.props` near top of frontmatter.
- Use literal unions where meaningful (e.g. locales, SEO type).
- Use `as const` for static lookup maps.
- Avoid `any`, `@ts-ignore`, and broad unsafe assertions.

## 9) Styling Guidelines
- Tailwind utilities are the primary styling method.
- Keep `global.css` minimal; use it mainly for theme tokens.
- Tailwind is loaded in `src/styles/global.css` via `@import "tailwindcss"`.
- Reuse established palette/spacing patterns across pages.
- Prefer utility classes over custom CSS blocks.

Common utility patterns in this repo include:
- `container mx-auto px-4 sm:px-6 lg:px-8`
- `rounded-lg`, `rounded-xl`, `rounded-2xl`
- `bg-slate-*`, `text-slate-*`, `text-amber-*`
- mobile-first responsive classes (`sm:`, `md:`, `lg:`)

## 10) Markup, Scripts, and Error Handling
- Use semantic structure (`header`, `nav`, `main`, `footer`, section headings).
- Keep multilingual marketing tone consistent with existing copy.
- Use descriptive image `alt` text.
- Keep inline scripts minimal and component-local.
- Prefer null-safe DOM access (`?.`) in client-side scripts.
- Favor safe defaults and path normalization in URL/locale logic.
- Do not silently swallow meaningful failures.

## 11) SEO / URL Conventions
- Keep SEO metadata centralized through `SEO.astro` via `BaseLayout`.
- Keep canonical URL generation normalized (strip search/hash, trim trailing slash).
- Maintain alternate `hreflang` links for localized routes.

## 12) Verification Workflow for Agents
After any change, run:

```bash
npm run check
npm run build
```

If one `.astro` file was heavily edited, also run:

```bash
npx astro check path/to/file.astro
```

## 13) Do / Don’t Checklist

### Do
- Reuse `BaseLayout`, `SEO`, `Header`, and `Footer`
- Follow existing Tailwind-heavy composition
- Keep small static data close to pages/components
- Keep localization logic consistent with existing route-prefix helpers
- Update this document when tooling/commands/conventions change

### Don’t
- Don’t invent commands not present in `package.json`
- Don’t claim `npm test` or single-test workflows exist
- Don’t present `astro check` as runtime behavior testing
- Don’t switch to alias imports without an explicit repo-wide migration
- Don’t add heavy custom CSS when utilities are sufficient
- Don’t commit generated or dependency directories (`dist/`, `node_modules/`)
