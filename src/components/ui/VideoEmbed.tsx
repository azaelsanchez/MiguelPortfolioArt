/** Normaliza una URL de Vimeo o YouTube a su variante embebible. */
function toEmbedUrl(url: string): string | null {
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;

  const youtube = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/,
  );
  if (youtube) return `https://www.youtube-nocookie.com/embed/${youtube[1]}`;

  return null;
}

type Props = {
  url: string;
  title: string;
};

/** Embed responsivo 16:9 de Vimeo/YouTube. Nunca se sirve vídeo desde el repo. */
export function VideoEmbed({ url, title }: Props) {
  const embedUrl = toEmbedUrl(url);
  if (!embedUrl) return null;

  return (
    <div className="bg-canvas-sunken relative aspect-video w-full overflow-hidden">
      <iframe
        src={embedUrl}
        title={title}
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
        allowFullScreen
        loading="lazy"
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}
