import { Link } from "react-router-dom";

type BreadcrumbItem = {
  label: string;
  to?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export default function Breadcrumbs({
  items,
}: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="
        flex
        flex-wrap
        items-center
        gap-2

        text-[9px]
        font-semibold
        uppercase
        tracking-[0.16em]

        text-[#A88993]
      "
    >
      {items.map((item, index) => (
        <div
          key={`${item.label}-${index}`}
          className="flex items-center gap-2"
        >
          {index > 0 && (
            <span
              aria-hidden="true"
              className="text-[#D7C5CB]"
            >
              /
            </span>
          )}

          {item.to ? (
            <Link
              to={item.to}
              className="
                transition-colors
                duration-200

                hover:text-[#E75480]
              "
            >
              {item.label}
            </Link>
          ) : (
            <span
              aria-current="page"
              className="
                max-w-[260px]
                truncate
                text-[#E75480]
              "
            >
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}