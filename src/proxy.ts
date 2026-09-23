import createMiddleware from "next-intl/middleware";
import { routing } from "@/lib/i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Todo excepto rutas de API, estáticos de Next y ficheros con extensión.
  matcher: ["/", "/(es|en)/:path*", "/((?!api|_next|_vercel|.*\..*).*)"],
};
