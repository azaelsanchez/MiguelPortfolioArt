# Portfolio — Miguel Ángel Gómez Balbuena

Portfolio bilingüe (ES/EN) de Miguel Ángel Gómez Balbuena, Doctor en Bellas
Artes, diseñador gráfico, ilustrador y creador audiovisual. Sustituye a la web
de Wix de 2021.

## Stack

- **Next.js 16** (App Router) + React 19 + TypeScript estricto
- **Tailwind CSS v4** con design tokens en `src/app/globals.css`
- **Motion** (reveals, lightbox, filtros animados) + **Lenis** (scroll suave)
- **next-intl** para las rutas `/es` y `/en`
- **Contentful** como CMS (mappers y fachada listos; ver [Datos](#datos))
- **Resend + Zod + Turnstile** en el formulario de contacto (Server Action)
- **Vercel Analytics + Speed Insights**
- **pnpm** como gestor de paquetes

## Puesta en marcha

```bash
pnpm install
cp .env.example .env.local   # opcional: sin CMS/credenciales se usan datos mock
pnpm dev
```

La web queda en `http://localhost:3000`; `/` redirige a `/es`.

## Scripts

| Script                    | Qué hace                                                    |
| ------------------------- | ----------------------------------------------------------- |
| `pnpm dev`                | Servidor de desarrollo                                      |
| `pnpm build`              | Build de producción (incluye typecheck)                     |
| `pnpm start`              | Sirve el build de producción                                |
| `pnpm lint`               | ESLint                                                      |
| `pnpm typecheck`          | `tsc --noEmit`                                              |
| `pnpm format`             | Prettier sobre todo el repo                                 |
| `pnpm format:check`       | Prettier en modo comprobación                               |
| `pnpm contentful:migrate` | Aplica `scripts/contentful/migrate.js` (crea el modelo)     |
| `pnpm contentful:seed`    | Siembra el contenido inicial (`scripts/contentful/seed.ts`) |

Antes de cada commit: `pnpm lint && pnpm typecheck && pnpm build`.

## Estructura

```
src/
  app/
    [locale]/               páginas por idioma (layout raíz incluido)
      work/, work/[slug]/, about/, contact/
    api/draft/               activa el draft mode desde Contentful
    api/revalidate/          webhook de Contentful → revalidateTag
    sitemap.ts, robots.ts
  components/
    layout/                 Header, Footer, MobileMenu, LocaleSwitcher
    home/                   FeaturedWorks
    work/                   WorkGrid, WorkCard, CategoryFilter, Lightbox, ProjectNav
    about/                  Bio, Timeline, ExhibitionList, Skills
    contact/                ContactForm, Turnstile
    ui/                     Button, Container, Reveal, PaintWash, GrainOverlay,
                             VideoEmbed, JsonLd, MotionProvider, SmoothScroll
  lib/
    contentful/             tipos de dominio, mock, cliente, mappers y fachada de consultas
    i18n/                   routing, navegación tipada y config por petición
    actions/contact.ts      Server Action del formulario (Zod, honeypot, rate limit, Resend)
    seo.ts                  URL del sitio y alternates/hreflang
  messages/                 textos de interfaz (es.json, en.json)
  proxy.ts                  redirección e idioma por defecto
scripts/
  generate-mock-images.mjs  placeholders de `public/mock/`
  contentful/
    migrate.js               modelo de contenido
    seed.ts                  siembra el inventario de `lib/contentful/mock.ts`
```

## Estilo: "manchas de tinta" en vez de blanco plano

El lienzo no es un blanco de interfaz liso: lleva grano de papel global
(`<GrainOverlay>`, ruido SVG `feTurbulence` a ~3.5% de opacidad, sin
imágenes) y manchas de color muy desaturadas en los huecos de cada página
(`<PaintWash>`, formas `border-radius` asimétrico + `blur`, en `multiply`
sobre el papel, con una deriva lentísima). Los colores de esas manchas son
sus propios tokens (`--color-wash-*` en `globals.css`) para poder retocarlos
en modo oscuro sin tocar el componente.

## Datos

`src/lib/contentful/queries.ts` es la única fachada que usan las páginas.
Sin `CONTENTFUL_SPACE_ID` resuelve todo contra `src/lib/contentful/mock.ts`
(reproduce el inventario de contenido: proyectos, exposiciones,
formación, experiencia y habilidades). Con credenciales, habla con la
Delivery/Preview API a través de `client.ts` y pasa la respuesta por
`mappers.ts`. Los componentes solo ven los tipos de dominio de `types.ts`, así
que nunca hay que tocarlos al cambiar de fuente.

El SDK oficial de Contentful usa `axios`, no `fetch`, así que el
`tags: ['contentful']` de `fetch` no aplica aquí: cada consulta se envuelve
con `unstable_cache(..., { tags: ['contentful'] })`, que es lo que invalida
`app/api/revalidate/route.ts` en cada publish/unpublish desde Contentful. En
draft mode (activado desde `app/api/draft/route.ts`) se salta ese caché.

Las imágenes de `public/mock/` son placeholders generados con
`node scripts/generate-mock-images.mjs`; se borran cuando los assets reales
vivan en Contentful.

### Poner Contentful en marcha

1. Crea el espacio y los locales `es` (por defecto) y `en` — exactamente esos
   códigos, no `es-ES`/`en-US`.
2. Rellena `.env.local` con `CONTENTFUL_SPACE_ID`, `CONTENTFUL_DELIVERY_TOKEN`,
   `CONTENTFUL_PREVIEW_TOKEN` y, solo en local, `CONTENTFUL_MANAGEMENT_TOKEN`.
3. `pnpm contentful:migrate` — crea el modelo de contenido.
4. `pnpm contentful:seed` — siembra categorías, exposiciones, formación,
   experiencia y habilidades (se publican solas). Proyectos y `SiteSettings`
   quedan en borrador: hace falta subir la obra real, el retrato y el CV desde
   la UI de Contentful, enlazarlos y publicar a mano.
5. En Contentful, añade el webhook de `/api/revalidate` (cabecera
   `x-revalidate-secret`) y la Content preview URL de `/api/draft`.

## Formulario de contacto

`components/contact/ContactForm.tsx` llama a la Server Action
`lib/actions/contact.ts`: valida con Zod, descarta honeypot, aplica un
rate-limit básico en memoria por IP, verifica Turnstile (si hay
`TURNSTILE_SECRET_KEY`) y envía con Resend (si hay `RESEND_API_KEY` y
`CONTACT_TO_EMAIL`). Sin esas claves, el formulario valida correctamente pero
no llega a enviar nada — queda dicho en consola con un `TODO(azael)`.

## Estado

- **Fases 1, 2, 4 y 5** (base, páginas con datos mock, formulario y pulido:
  animaciones, Lenis, SEO, JSON-LD, sitemap/robots, Analytics) completadas.
- **Fase 3 (Contentful):** todo el código (cliente, mappers, migración, seed,
  draft mode, revalidación) está listo, pero sin probar contra un espacio
  real — hace falta crear la cuenta y las credenciales.
- **Fase 6 (lanzamiento):** pendiente — dominio, revisión de contenido con
  Miguel y retirada de Wix.
- Repo en GitHub y proyecto en Vercel: pendientes de credenciales.

Los puntos que dependen de Miguel o de credenciales están marcados en el código
con `TODO(azael):`.
