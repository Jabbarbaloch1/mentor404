export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      {eyebrow && (
        <p className="font-mono-cyber mb-3 text-xs uppercase tracking-widest text-indigo-bright">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p
          className={`mt-3 text-ink-dim ${
            align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
