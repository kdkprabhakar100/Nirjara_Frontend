import { Link } from "react-router-dom";

export default function Footer() {
  const pages = [
    { label: "Home", path: "/" },
    { label: "Services", path: "/services" },
    { label: "Branches", path: "/branches" },
    { label: "Academy", path: "/academy" },
    { label: "Blog", path: "/blog" },
    { label: "Contact", path: "/contact" },
    { label: "Careers", path: "/careers" },
  ];

  return (
    <footer className="border-t border-[#E75480]/10 bg-white px-5 py-12 text-[#3A2A2F] sm:px-6 md:px-12">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <h2 className="font-serif text-2xl tracking-[3px] text-[#E75480]">
            NIRJARA <span className="italic text-[#C77A95]">Beauty</span>
          </h2>

          <p className="mt-4 max-w-md text-sm leading-7 text-[#8A6F78]">
            A professional beauty salon and academy offering salon services,
            beauty training, and customer-focused care in Kathmandu.
          </p>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-[3px] text-[#E75480]">
            Pages
          </h3>

          <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-[#8A6F78] sm:flex sm:flex-col">
            {pages.map((page) => (
              <Link
                key={page.path}
                to={page.path}
                className="transition hover:text-[#E75480]"
              >
                {page.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-[3px] text-[#E75480]">
            Contact
          </h3>

          <div className="mt-5 space-y-2 text-sm leading-7 text-[#8A6F78]">
            <p>Teku, Kathmandu</p>
            <p>Chabahil, Kathmandu</p>
            <p>+977 9851097472</p>
            <p>+977 9849193532</p>
            <p>Developed by Prabhakar Khadka</p>

            <Link
              to="/admin/login"
              className="block pt-2 text-xs transition hover:text-[#E75480]"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-6xl border-t border-[#E75480]/10 pt-6 text-center text-xs text-[#8A6F78] md:text-left">
        © 2026 Nirjara Beauty Salon & Academy. All rights reserved.
      </div>
    </footer>
  );
}