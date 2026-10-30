import {
  useEffect,
  useState,
} from "react";

import {
  NavLink,
} from "react-router-dom";

import {
  ShoppingBag,
  Menu,
  X,
} from "lucide-react";

import {
  useCart,
} from "../context/CartContext";

/* ============================================================
   NAVIGATION
============================================================ */

const navItems = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "About",
    path: "/about",
  },
  {
    label: "Services",
    path: "/services",
  },
  {
    label: "Academy",
    path: "/academy",
  },
  {
    label: "Products",
    path: "/products",
  },
  {
    label: "Contact",
    path: "/contact",
  },
];

/* ============================================================
   NAVBAR
============================================================ */

export default function Navbar() {
  const [
    open,
    setOpen,
  ] = useState(false);

  const {
    cart,
  } = useCart();

  const cartCount =
    cart.reduce(
      (
        total,
        item
      ) =>
        total +
        item.quantity,

      0
    );

  /* ============================================================
     CLOSE MENU WHEN CLICKING OUTSIDE
  ============================================================ */

  useEffect(
    () => {
      const handleOutsideClick =
        () => {
          setOpen(
            false
          );
        };

      if (
        open
      ) {
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
    },

    [
      open,
    ]
  );

  /* ============================================================
     RENDER
  ============================================================ */

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
        py-2.5

        shadow-sm
        backdrop-blur

        sm:px-5
        sm:py-3

        lg:px-6
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

          gap-3

          lg:gap-5
        "
      >
        {/* ======================================================
            LOGO
        ====================================================== */}

        <NavLink
          to="/"
          onClick={() =>
            setOpen(
              false
            )
          }
          className="
            flex
            shrink-0
            items-center
          "
          aria-label="Nirjara Beauty Home"
        >
          <img
            src="/images/Nirjara-logo.png"
            alt="Nirjara Beauty"
            className="
              h-[34px]
              w-auto
              object-contain

              min-[375px]:h-[36px]

              sm:h-[40px]

              lg:h-[42px]

              xl:h-[44px]
            "
          />
        </NavLink>

        {/* ======================================================
            DESKTOP NAVIGATION

            Only shown from 1024px / lg upward.
        ====================================================== */}

        <div
          className="
            hidden

            items-center

            gap-5

            lg:flex

            xl:gap-7
          "
        >
          {navItems.map(
            (
              item
            ) => (
              <NavLink
                key={
                  item.path
                }
                to={
                  item.path
                }
                className={({
                  isActive,
                }) =>
                  `
                    relative

                    text-[10px]
                    font-medium
                    uppercase
                    tracking-[2px]

                    transition-colors
                    duration-200

                    ${
                      isActive
                        ? "text-[#E75480]"
                        : "text-[#8A6F78]"
                    }

                    hover:text-[#E75480]
                  `
                }
              >
                {
                  item.label
                }
              </NavLink>
            )
          )}
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
          {/* ==================================================
              DESKTOP CART
          ================================================== */}

          <NavLink
            to="/cart"
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

              hover:-translate-y-0.5
              hover:border-[#E75480]/40
              hover:bg-[#FCE7EF]
            "
          >
            <ShoppingBag
              size={
                18
              }
              strokeWidth={
                1.8
              }
            />

            {cartCount >
              0 && (
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
                {
                  cartCount
                }
              </span>
            )}
          </NavLink>

          {/* ==================================================
              DESKTOP BOOK NOW
          ================================================== */}

          <NavLink
            to="/booking"
            className="
              shrink-0

              rounded-full

              bg-[#E75480]

              px-5
              py-2.5

              text-[10px]
              font-medium
              uppercase
              tracking-[2px]

              text-white

              shadow-[0_8px_24px_rgba(231,84,128,0.16)]

              transition-all
              duration-300

              hover:-translate-y-0.5
              hover:bg-[#D63C6D]
              hover:shadow-[0_12px_28px_rgba(231,84,128,0.24)]

              xl:px-6
            "
          >
            Book Now
          </NavLink>
        </div>

        {/* ======================================================
            MOBILE + TABLET RIGHT SIDE

            Used on:
            phones
            small tablets
            large tablets

            Hidden only at lg.
        ====================================================== */}

        <div
          className="
            flex
            items-center
            gap-2

            lg:hidden
          "
        >
          {/* ==================================================
              MOBILE CART
          ================================================== */}

          <NavLink
            to="/cart"
            onClick={() =>
              setOpen(
                false
              )
            }
            aria-label="View cart"
            className="
              relative

              flex
              h-9
              w-9

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

              sm:h-10
              sm:w-10
            "
          >
            <ShoppingBag
              size={
                17
              }
              strokeWidth={
                1.8
              }
            />

            {cartCount >
              0 && (
              <span
                className="
                  absolute
                  -right-1
                  -top-1

                  flex
                  h-[17px]
                  min-w-[17px]

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
                {
                  cartCount
                }
              </span>
            )}
          </NavLink>

          {/* ==================================================
              HAMBURGER BUTTON
          ================================================== */}

          <button
            type="button"
            aria-label={
              open
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={
              open
            }
            onClick={(
              event
            ) => {
              event.stopPropagation();

              setOpen(
                (
                  previous
                ) =>
                  !previous
              );
            }}
            className="
              flex
              h-9
              w-9

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

              sm:h-10
              sm:w-10
            "
          >
            {open ? (
              <X
                size={
                  18
                }
                strokeWidth={
                  1.8
                }
              />
            ) : (
              <Menu
                size={
                  18
                }
                strokeWidth={
                  1.8
                }
              />
            )}
          </button>
        </div>
      </div>

      {/* ========================================================
          MOBILE + TABLET DROPDOWN
      ======================================================== */}

      {open && (
        <div
          onClick={(
            event
          ) =>
            event.stopPropagation()
          }
          className="
            absolute

            right-3
            top-full

            mt-2

            w-[220px]

            overflow-hidden

            rounded-[22px]

            border
            border-[#E75480]/10

            bg-white

            p-2

            shadow-[0_18px_45px_rgba(58,42,47,0.12)]

            sm:right-4
            sm:w-[240px]

            lg:hidden
          "
        >
          <div
            className="
              flex
              flex-col
              gap-1.5
            "
          >
            {/* ==================================================
                MOBILE NAVIGATION
            ================================================== */}

            {navItems.map(
              (
                item
              ) => (
                <NavLink
                  key={
                    item.path
                  }
                  to={
                    item.path
                  }
                  onClick={() =>
                    setOpen(
                      false
                    )
                  }
                  className={({
                    isActive,
                  }) =>
                    `
                      rounded-xl

                      px-4
                      py-2.5

                      text-[10px]
                      font-medium
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
                  {
                    item.label
                  }
                </NavLink>
              )
            )}

            {/* ==================================================
                MOBILE BOOK NOW
            ================================================== */}

            <NavLink
              to="/booking"
              onClick={() =>
                setOpen(
                  false
                )
              }
              className="
                mt-1

                rounded-xl

                bg-[#E75480]

                px-4
                py-2.5

                text-center
                text-[10px]
                font-semibold
                uppercase
                tracking-[2px]

                text-white

                transition-all
                duration-300

                hover:bg-[#D63C6D]
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