type BrandWordmarkProps = {
  variant?: "header" | "footer";
};

export function BrandWordmark({ variant = "header" }: BrandWordmarkProps) {
  const isFooter = variant === "footer";
  const label = isFooter ? "daviandrade.dev" : "dandrade.dev";
  const viewBox = isFooter ? "0 0 300 44" : "0 0 220 44";
  const name = isFooter ? "daviandrade" : "dandrade";

  return (
    <svg
      className={isFooter ? "site-footer-brand" : "brand-wordmark-svg"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      role="img"
      aria-label={label}
      overflow="visible"
    >
      <text
        x="0"
        y="33"
        fontFamily="'Arial Black', 'Helvetica Neue', sans-serif"
        fontSize="32"
        fontWeight="900"
      >
        <tspan className="brand-wordmark-name">{name}</tspan>
        <tspan className="brand-wordmark-suffix">.dev</tspan>
      </text>
    </svg>
  );
}
