import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Services", path: "/services" },
  { label: "Gallery", path: "/gallery" },
  { label: "Branches", path: "/branches" },
  { label: "Academy", path: "/academy" },
  { label: "Blog", path: "/blog" },
  { label: "Contact", path: "/contact" },
  { label: "Products", path: "/products" },
  { label: "events", path: "/events" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const { cart } = useCart();

  const cartCount = cart.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  /* CLOSE MENU WHEN CLICKING OUTSIDE */
  useEffect(() => {
    const handleOutsideClick = () => {
      setOpen(false);
    };

    if (open) {
      document.addEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener(
        "click",
        handleOutsideClick
      );
    };
  }, [open]);

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-[#E75480]/15 bg-white/95 px-4 py-4 shadow-sm backdrop-blur">

      {/* NAVBAR CONTAINER */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 lg:gap-4">

        {/* LOGO */}
        <NavLink
          to="/"
          onClick={() => setOpen(false)}
          className="shrink-0 font-serif text-base leading-tight tracking-[2px] text-[#E75480] sm:text-xl xl:text-2xl"
        >
          NIRJARA{" "}
          <span className="block italic tracking-[3px] text-[#C77A95] sm:inline">
            Beauty
          </span>
        </NavLink>

        {/* DESKTOP MENU */}
        <div className="hidden items-center gap-4 lg:flex xl:gap-6">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `text-[11px] uppercase tracking-[2px] transition ${
                  isActive
                    ? "text-[#E75480]"
                    : "text-[#8A6F78]"
                } hover:text-[#E75480]`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden items-center gap-3 lg:flex">

          {/* CART ICON */}
          <NavLink
            to="/cart"
            className="
              relative
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              border
              border-[#E75480]/20
              bg-[#FFF5F8]
              text-[#E75480]
              transition
              hover:bg-[#FCE7EF]
            "
          >
            <ShoppingBag size={20} />

            {cartCount > 0 && (
              <span
                className="
                  absolute
                  -right-1
                  -top-1
                  flex
                  h-5
                  w-5
                  items-center
                  justify-center
                  rounded-full
                  bg-[#E75480]
                  text-[10px]
                  text-white
                "
              >
                {cartCount}
              </span>
            )}
          </NavLink>

          {/* BOOK BUTTON */}
          <NavLink
            to="/booking"
            className="
              shrink-0
              rounded-full
              bg-[#E75480]
              px-5
              py-3
              text-[11px]
              font-medium
              uppercase
              tracking-[2px]
              text-white
              transition
              hover:bg-[#d63c6d]
              xl:px-6
            "
          >
            Book Now
          </NavLink>
        </div>

        {/* MOBILE/TABLET MENU BUTTON */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpen(!open);
          }}
          className="
            rounded-full
            border
            border-[#E75480]/20
            bg-[#FFF5F8]
            px-4
            py-2
            text-[10px]
            uppercase
            tracking-[2px]
            text-[#E75480]
            lg:hidden
          "
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {/* MOBILE + TABLET MENU */}
      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="
            absolute
            right-3
            top-full
            mt-2
            w-[210px]
            rounded-[22px]
            border
            border-[#E75480]/10
            bg-white
            p-2
            shadow-xl
            sm:w-[230px]
            lg:hidden
          "
        >
          <div className="flex flex-col gap-1.5">

            {/* MENU ITEMS */}
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-3 py-2.5 text-[10px] uppercase tracking-[2px] transition ${
                    isActive
                      ? "bg-[#E75480] text-white"
                      : "bg-[#FFF5F8] text-[#8A6F78]"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}

            {/* MOBILE CART */}
            <NavLink
              to="/cart"
              onClick={() => setOpen(false)}
              className="
                relative
                flex
                items-center
                justify-center
                rounded-xl
                bg-[#FFF5F8]
                px-3
                py-2.5
                text-[#E75480]
              "
            >
              <ShoppingBag size={18} />

              {cartCount > 0 && (
                <span
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    rounded-full
                    bg-[#E75480]
                    px-1.5
                    py-[2px]
                    text-[9px]
                    text-white
                  "
                >
                  {cartCount}
                </span>
              )}
            </NavLink>

            {/* MOBILE BOOK BUTTON */}
            <NavLink
              to="/booking"
              onClick={() => setOpen(false)}
              className="
                rounded-xl
                bg-[#E75480]
                px-3
                py-2.5
                text-center
                text-[10px]
                uppercase
                tracking-[2px]
                text-white
                transition
                hover:bg-[#d63c6d]
              "
            >
              Book Now
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
}