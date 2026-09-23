import { Reveal } from "@/components/ui/Reveal";

export type TimelineItem = {
  id: string;
  years: string;
  title: string;
  subtitle: string;
  highlights?: string[];
};

type Props = {
  items: TimelineItem[];
};

export function Timeline({ items }: Props) {
  return (
    <ol className="border-line mt-8 space-y-10 border-l md:space-y-12">
      {items.map((item) => (
        <li key={item.id} className="relative pl-8 md:pl-10">
          <span
            aria-hidden
            className="bg-accent absolute top-1.5 -left-[5px] h-2.5 w-2.5 rounded-full"
          />
          <Reveal>
            <p className="eyebrow">{item.years}</p>
            <p className="font-display text-ink mt-1 text-lg md:text-xl">
              {item.title}
            </p>
            <p className="text-ink-muted mt-1">{item.subtitle}</p>
            {item.highlights && item.highlights.length > 0 && (
              <ul className="text-ink-muted mt-3 space-y-1.5">
                {item.highlights.map((highlight) => (
                  <li key={highlight} className="flex gap-2 text-sm">
                    <span aria-hidden className="text-ink-subtle">
                      –
                    </span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            )}
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
