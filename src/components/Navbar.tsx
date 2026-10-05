import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";

const navItems = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Gallery", path: "/gallery" },
  { label: "Branches", path: "/branches" },
  { label: "Academy", path: "/academy" },
  { label: "Blog", path: "/blog" },
  { label: "Contact", path: "/contact" },
  { label: "Products", path: "/products" },
  { label: "Events", path: "/events" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const { cart } = useCart();

  const cartCount = cart.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  /* ============================================================
     CLOSE MENU WHEN CLICKING OUTSIDE
  ============================================================ */

  useEffect(() => {
    const handleOutsideClick = () => {
      setOpen(false);
    };

    if (open) {
      document.addEventListener(
        "click",
        handleOutsideClick
      );
    }

    return () => {
      document.removeEventListener(
        "click",
        handleOutsideClick
      );
    };
  }, [open]);

  return (
    <nav
      className="
        fixed
        left-0
        right-0
        top-0
        z-50
        border-b
        border-[#E75480]/15
        bg-white/95
        px-4
        py-4
        shadow-sm
        backdrop-blur
      "
    >
      {/* ========================================================
          NAVBAR CONTAINER
      ======================================================== */}

      <div
        className="
          mx-auto
          flex
          max-w-7xl
          items-center
          justify-between
          gap-2

          lg:gap-4
        "
      >
        {/* ======================================================
            LOGO
        ====================================================== */}

        <NavLink
          to="/"
          onClick={() => setOpen(false)}
          className="flex shrink-0 items-center"
          aria-label="Nirjara Beauty Home"
        >
          <img
            src="/images/Nirjara-logo.png"
            alt="Nirjara Beauty"
            className="
              h-[42px]
              w-auto
              object-contain

              sm:h-[46px]

              lg:h-[48px]

              xl:h-[52px]
            "
          />
        </NavLink>

        {/* ======================================================
            DESKTOP MENU
        ====================================================== */}

        <div
          className="
            hidden
            items-center
            gap-4

            lg:flex

            xl:gap-6
          "
        >
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `
                  text-[11px]
                  uppercase
                  tracking-[2px]
                  transition

                  ${
                    isActive
                      ? "text-[#E75480]"
                      : "text-[#8A6F78]"
                  }

                  hover:text-[#E75480]
                `
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* ======================================================
            DESKTOP RIGHT SIDE
        ====================================================== */}

        <div
          className="
            hidden
            items-center
            gap-3

            lg:flex
          "
        >
          {/* DESKTOP CART */}

          <NavLink
            to="/cart"
            aria-label="View cart"
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
              transition-all
              duration-300

              hover:-translate-y-0.5
              hover:border-[#E75480]/40
              hover:bg-[#FCE7EF]
            "
          >
            <ShoppingBag
              size={20}
              strokeWidth={1.8}
            />

            {cartCount > 0 && (
              <span
                className="
                  absolute
                  -right-1
                  -top-1
                  flex
                  h-5
                  min-w-[20px]
                  items-center
                  justify-center
                  rounded-full
                  bg-[#E75480]
                  px-1
                  text-[10px]
                  font-medium
                  text-white
                "
              >
                {cartCount}
              </span>
            )}
          </NavLink>

          {/* DESKTOP BOOK BUTTON */}

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
              transition-all
              duration-300

              hover:-translate-y-0.5
              hover:bg-[#d63c6d]

              xl:px-6
            "
          >
            Book Now
          </NavLink>
        </div>

        {/* ======================================================
            MOBILE + TABLET RIGHT SIDE

            CART BESIDE MENU
        ====================================================== */}

        <div
          className="
            flex
            items-center
            gap-2

            lg:hidden
          "
        >
          {/* MOBILE / TABLET CART */}

          <NavLink
            to="/cart"
            onClick={() => setOpen(false)}
            aria-label="View cart"
            className="
              relative
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              border
              border-[#E75480]/20
              bg-[#FFF5F8]
              text-[#E75480]
              transition-all
              duration-300

              hover:border-[#E75480]/40
              hover:bg-[#FCE7EF]

              sm:h-11
              sm:w-11
            "
          >
            <ShoppingBag
              size={18}
              strokeWidth={1.8}
            />

            {cartCount > 0 && (
              <span
                className="
                  absolute
                  -right-1
                  -top-1
                  flex
                  h-[18px]
                  min-w-[18px]
                  items-center
                  justify-center
                  rounded-full
                  bg-[#E75480]
                  px-1
                  text-[9px]
                  font-medium
                  text-white
                "
              >
                {cartCount}
              </span>
            )}
          </NavLink>

          {/* MOBILE / TABLET MENU BUTTON */}

          <button
            type="button"
            aria-label={
              open
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={open}
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
            className="
              flex
              h-10
              items-center
              justify-center
              rounded-full
              border
              border-[#E75480]/20
              bg-[#FFF5F8]
              px-4
              text-[10px]
              uppercase
              tracking-[2px]
              text-[#E75480]
              transition-all
              duration-300

              hover:border-[#E75480]/40
              hover:bg-[#FCE7EF]

              sm:h-11
              sm:px-5
            "
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {/* ========================================================
          MOBILE + TABLET MENU
      ======================================================== */}

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
            shadow-[0_18px_45px_rgba(58,42,47,0.12)]

            sm:w-[230px]

            lg:hidden
          "
        >
          <div className="flex flex-col gap-1.5">

            {/* ==================================================
                MENU ITEMS
            ================================================== */}

            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() =>
                  setOpen(false)
                }
                className={({ isActive }) =>
                  `
                    rounded-xl
                    px-3
                    py-2.5
                    text-[10px]
                    uppercase
                    tracking-[2px]
                    transition-all
                    duration-200

                    ${
                      isActive
                        ? "bg-[#E75480] text-white"
                        : "bg-[#FFF5F8] text-[#8A6F78]"
                    }

                    hover:bg-[#FCE7EF]
                    hover:text-[#E75480]
                  `
                }
              >
                {item.label}
              </NavLink>
            ))}

            {/* ==================================================
                MOBILE BOOK BUTTON
            ================================================== */}

            <NavLink
              to="/booking"
              onClick={() =>
                setOpen(false)
              }
              className="
                mt-1
                rounded-xl
                bg-[#E75480]
                px-3
                py-2.5
                text-center
                text-[10px]
                uppercase
                tracking-[2px]
                text-white
                transition-all
                duration-300

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