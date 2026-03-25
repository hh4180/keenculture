# AGENTS.md - Keen Creative JP

Guidance for coding agents working in this repository.

## Project Snapshot
- Astro 5 static site
- Tailwind CSS v4 via `@tailwindcss/vite`
- TypeScript strict mode
- Cloudflare Pages deployment target
- Main content is mostly Simplified Chinese with some English/Japanese labels

## Source of Truth
Prefer observed repository patterns over generic Astro advice.
Most important files: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/layouts/BaseLayout.astro`, `src/components/*.astro`, `src/pages/*.astro`, and `src/styles/global.css`.

## Repository Structure
```text
src/
  components/
    Footer.astro
    Header.astro
    SEO.astro
  layouts/
    BaseLayout.astro
  pages/
    about.astro
    contact.astro
    index.astro
    services.astro
  styles/
    global.css
public/
  images/
```

## Commands
Run commands from the repo root.

```bash
# Development server
npm run dev

# Type/lint check
npm run check
npm run lint

# Production build
npm run build

# Preview production build
npm run preview

# Single-file check
npx astro check src/pages/contact.astro
```

Notes:
- `build` runs `astro check && astro build`
- `lint` is not ESLint here; it is the same as `astro check`
- There is no dedicated test runner configured right now

## Tests
What was found:
- No `vitest`, `jest`, `playwright`, or similar config at repo root
- No repo test files outside `node_modules`
- No valid “single test” command exists today

If a change needs verification, use:
- `npm run check`
- `npm run build`
- targeted manual review of the affected page/component

## Editor Rule Files
Checked and not found:
- `.cursorrules`
- `.cursor/rules/**`
- `.github/copilot-instructions.md`

Do not claim those files exist unless they are added later.

## Architecture Patterns
### Layout pattern
Every page should use `BaseLayout`.
`BaseLayout.astro` already imports global styles, SEO, header, and footer.

### Component structure
Typical `.astro` files follow this order: frontmatter, relative imports, `export interface Props` when needed, `Astro.props` destructuring, local arrays/objects for repeated content, Tailwind-heavy markup, and a small inline `<script>` only when necessary.

### Data-in-frontmatter pattern
Small static collections live directly in the page/component frontmatter.

Examples:
- navigation items in `src/components/Header.astro`
- footer sections in `src/components/Footer.astro`
- services, brands, stats, timelines in page files

Prefer that over creating separate data modules for tiny static lists.

## Imports
Use relative imports. That is the current codebase convention.
Do not switch to path aliases unless the whole repo is intentionally updated.

## TypeScript and Astro Conventions
- Strict mode is enabled via `astro/tsconfigs/strict`
- Use `export interface Props` for component/layout props
- Destructure `Astro.props` near the top of the file
- Use literal unions where helpful, e.g. `type?: 'website' | 'article'`
- Avoid `any`, `@ts-ignore`, and broad type assertions

## Naming Conventions
- Components/layouts: PascalCase file names
- Pages: lowercase route names like `about.astro` and `services.astro`
- Variables and props: camelCase
- Repeated collections: plural names like `services`, `brands`, `footerLinks`

## Styling Guidelines
- Use Tailwind utility classes in markup
- Keep global CSS minimal
- Tailwind is loaded from `src/styles/global.css` via `@import "tailwindcss"`
- Theme customization currently lives in `@theme` custom properties
- Reuse the existing slate/amber palette and spacing rhythm
- Common patterns already in use include `container mx-auto px-4 sm:px-6 lg:px-8`, `rounded-xl` / `rounded-2xl`, `bg-slate-*`, `text-slate-*`, `text-amber-*`, and mobile-first responsive classes
Avoid custom CSS when Tailwind utilities are enough.

## Markup, Scripts, and Error Handling
- Use semantic sections and headings
- Keep SEO metadata flowing through `BaseLayout`
- Preserve the existing multilingual marketing tone
- Use descriptive `alt` text for images
- Keep CTA copy concise and business-oriented
- Keep client-side scripts minimal and local to the component
- Prefer null-safe DOM access in inline scripts
- Do not silently swallow meaningful failures in new code

## Verification Expectations
After changes, run:

```bash
npm run check
npm run build
```

If touching one `.astro` file heavily, also run:

```bash
npx astro check path/to/file.astro
```

## Do Not
- Do not invent commands that are not in `package.json`
- Do not describe a nonexistent test suite as if it exists
- Do not replace relative imports with aliases ad hoc
- Do not add React/Vue/Svelte for small interactions
- Do not add large custom CSS blocks when Tailwind is enough
- Do not commit `dist/` or `node_modules/`

## Do
- Reuse `BaseLayout`, `SEO`, `Header`, and `Footer`
- Match the existing Tailwind-heavy style
- Keep small static content close to the page/component
- Verify with `npm run check` and `npm run build`
- Update this file if commands, tooling, or rule files change
