import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin({
  requestConfig: "./src/lib/i18n/request.ts",
});

const nextConfig: NextConfig = {
  typedRoutes: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.ctfassets.net",
      },
      // TODO(azael): retirar cuando la migración desde Wix haya terminado.
      {
        protocol: "https",
        hostname: "static.wixstatic.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
