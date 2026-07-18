import type { ReactNode } from "react";

/** Shared kicker + display heading, with an optional aside (e.g. a source link). */
export default function SectionHeader({
  kicker,
  title,
  aside,
}: {
  kicker: string;
  title: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="kicker">{kicker}</p>
        <h2 className="display mt-2 text-3xl sm:text-4xl">{title}</h2>
      </div>
      {aside && <div className="pb-1 font-mono text-xs text-muted">{aside}</div>}
    </div>
  );
}
