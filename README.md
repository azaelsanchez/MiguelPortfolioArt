# Portfolio — Miguel Ángel Gómez Balbuena

Portfolio bilingüe (ES/EN) de Miguel Ángel Gómez Balbuena, Doctor en Bellas
Artes, diseñador gráfico, ilustrador y creador audiovisual. Sustituye a la web
de Wix de 2021.

El plan de desarrollo completo está en [`PLAN.md`](./PLAN.md).

## Stack

- **Next.js 16** (App Router) + React 19 + TypeScript estricto
- **Tailwind CSS v4** con design tokens en `src/app/globals.css`
- **next-intl** para las rutas `/es` y `/en`
- **Contentful** como CMS (Fase 3; hasta entonces se usan datos mock)
- **pnpm** como gestor de paquetes

## Puesta en marcha

```bash
pnpm install
cp .env.example .env.local   # opcional en Fase 1: sin CMS se usan datos mock
pnpm dev
```

La web queda en `http://localhost:3000`; `/` redirige a `/es`.

## Scripts

| Script              | Qué hace                                |
| ------------------- | --------------------------------------- |
| `pnpm dev`          | Servidor de desarrollo                  |
| `pnpm build`        | Build de producción (incluye typecheck) |
| `pnpm start`        | Sirve el build de producción            |
| `pnpm lint`         | ESLint                                  |
| `pnpm typecheck`    | `tsc --noEmit`                          |
| `pnpm format`       | Prettier sobre todo el repo             |
| `pnpm format:check` | Prettier en modo comprobación           |

Antes de cada commit: `pnpm lint && pnpm typecheck && pnpm build`.

## Estructura

```
src/
  app/[locale]/        páginas por idioma (layout raíz incluido)
  components/
    layout/            Header, Footer, MobileMenu, LocaleSwitcher
    ui/                Button, Container
  lib/
    contentful/        tipos de dominio, adaptador mock y fachada de consultas
    i18n/              routing, navegación tipada y config por petición
  messages/            textos de interfaz (es.json, en.json)
  proxy.ts             redirección e idioma por defecto
scripts/
  generate-mock-images.mjs   placeholders de `public/mock/`
```

## Datos

Mientras no exista `CONTENTFUL_SPACE_ID`, `src/lib/contentful/queries.ts`
resuelve todo contra `src/lib/contentful/mock.ts`, que reproduce el inventario
de la sección 4 del PLAN (proyectos, exposiciones, formación, experiencia y
habilidades). Los componentes solo ven los tipos de dominio de `types.ts`, así
que la Fase 3 podrá enchufar Contentful sin tocarlos.

Las imágenes de `public/mock/` son placeholders generados con
`node scripts/generate-mock-images.mjs`; se borran cuando los assets reales
vivan en Contentful.

## Estado

- **Fase 1 — Base:** completada salvo el repo en GitHub y el proyecto en
  Vercel, que requieren credenciales.
- Fases 2 a 6: pendientes. Ver `PLAN.md`.

Los puntos que dependen de Miguel o de credenciales están marcados en el código
con `TODO(azael):`.
