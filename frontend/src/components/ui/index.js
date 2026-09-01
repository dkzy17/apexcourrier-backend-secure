/**
 * Shared primitives for the ApexCourrier design system.
 *
 * These encode the rules taken from the Figma landing page so every surface
 * stays consistent:
 *   - accent is brand orange, surfaces are flat with 2px radii
 *   - section headings are Manrope, two-tone (regular + bold emphasis)
 *   - directional affordances are the CSS chevron below, never an icon font
 *   - icons are thin-stroke (lucide), currentColor, never in a tinted chip
 */
import Link from "next/link";

const CHEVRON_SIZES = {
  sm: { box: 11, arm: 8, stroke: 1.6 },
  md: { box: 14, arm: 10, stroke: 1.6 },
  lg: { box: 22, arm: 16, stroke: 2 },
};

/** The design's directional marker: a rotated open corner, not a glyph. */
export const Chevron = ({ size = "sm", direction = "right", className = "" }) => {
  const { box, arm, stroke } = CHEVRON_SIZES[size] || CHEVRON_SIZES.sm;
  const rotation = {
    right: "-rotate-45",
    left: "rotate-[135deg]",
    down: "rotate-45",
    up: "-rotate-[135deg]",
  }[direction];

  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center ${className}`}
      style={{ width: box, height: box }}
    >
      <span
        className={`border-b border-r border-current ${rotation}`}
        style={{ width: arm, height: arm, borderBottomWidth: stroke, borderRightWidth: stroke }}
      />
    </span>
  );
};

/** Primary orange call-to-action. `sheen` adds the Figma's light sweep. */
export const ActionLink = ({
  href,
  children,
  sheen = false,
  sheenTravel = 340,
  className = "",
  ...rest
}) => (
  <Link
    href={href}
    className={`group relative inline-flex w-fit items-center gap-5 overflow-hidden rounded bg-brand px-[15px] py-[14px] text-[14px] font-bold uppercase leading-[17px] tracking-[1.3px] text-white transition-colors hover:bg-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${className}`}
    {...rest}
  >
    {sheen && (
      <span
        aria-hidden="true"
        className="animate-sheen absolute left-[-19px] top-1/2 h-[45px] w-[7px] -translate-y-1/2 -rotate-12 bg-white/70 blur-[7px]"
        style={{ "--sheen-travel": `${sheenTravel}px` }}
      />
    )}
    {children}
    <Chevron />
  </Link>
);

/** Secondary, outline-only action used on orange surfaces and quiet rows. */
export const OutlineLink = ({ href, children, onBrand = false, className = "", ...rest }) => (
  <Link
    href={href}
    className={`inline-flex w-fit items-center gap-3 rounded border px-4 py-[14px] text-[14px] transition-colors ${
      onBrand
        ? "border-white/70 text-white hover:bg-white hover:text-brand"
        : "border-ink/30 text-ink hover:border-brand hover:text-brand"
    } ${className}`}
    {...rest}
  >
    {children}
  </Link>
);

/** Inline "Explore →" style link in the brand colour. */
export const ArrowLink = ({ href, children, className = "", ...rest }) => (
  <Link
    href={href}
    className={`group inline-flex w-fit items-center gap-4 text-[14px] font-bold uppercase tracking-[1px] text-brand transition-colors hover:text-brand-dark ${className}`}
    {...rest}
  >
    {children}
    <Chevron size="md" className="transition-transform duration-300 group-hover:translate-x-1" />
  </Link>
);

/**
 * Centred section heading. Pass the sentence with <strong> around the words the
 * design bolds — that two-tone treatment is the system's signature.
 */
export const SectionHeading = ({ children, body, align = "center", className = "" }) => (
  <div
    className={`flex flex-col gap-3 ${
      align === "center" ? "items-center text-center" : "items-start text-left"
    } ${className}`}
  >
    <h2 className="font-display text-[26px] font-medium text-black sm:text-[30px] lg:text-[34px] [&_strong]:font-bold">
      {children}
    </h2>
    {body && (
      <p className={`max-w-[1264px] text-[14px] leading-6 text-body ${align === "center" ? "" : ""}`}>
        {body}
      </p>
    )}
  </div>
);

/**
 * A labelled fact. Icons sit inline at text size in the brand colour — the
 * design has no tinted icon chips, so this is the only icon container.
 */
export const InfoTile = ({ icon: Icon, label, children, className = "" }) => (
  <div className={`flex flex-col gap-3 border border-line p-6 transition-colors hover:border-brand ${className}`}>
    <div className="flex items-center gap-3">
      {Icon && <Icon className="size-4 shrink-0 text-brand" strokeWidth={1.75} aria-hidden="true" />}
      <h3 className="font-display text-[16px] font-bold text-ink">{label}</h3>
    </div>
    <div className="text-[14px] leading-6 text-body">{children}</div>
  </div>
);
