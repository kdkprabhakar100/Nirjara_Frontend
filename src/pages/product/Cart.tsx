import {
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import {
  Link,
} from "react-router";

import {
  toast,
} from "react-toastify";

import {
  useCart,
} from "../../context/CartContext";

/* ============================================================
   MONEY
============================================================ */

function formatPrice(
  value: number
) {
  return new Intl.NumberFormat(
    "en-NP",
    {
      maximumFractionDigits: 0,
    }
  ).format(value);
}

/* ============================================================
   CART
============================================================ */

export default function Cart() {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  /* ==========================================================
     TOTAL
  ========================================================== */

  const total =
    cart.reduce(
      (
        sum,
        item
      ) =>
        sum +
        item.price *
          item.quantity,
      0
    );

  const totalItems =
    cart.reduce(
      (
        sum,
        item
      ) =>
        sum +
        item.quantity,
      0
    );

  /* ==========================================================
     EMPTY CART
  ========================================================== */

  if (
    cart.length ===
    0
  ) {
    return (
      <main
        className="
          min-h-[calc(100svh-56px)]
          bg-[#FFF5F8]

          px-4
          pb-10
          pt-[88px]

          sm:px-6
          sm:pt-[96px]

          lg:min-h-[calc(100vh-72px)]
          lg:pt-[104px]
        "
      >
        <div
          className="
            mx-auto
            flex
            max-w-[1120px]
            justify-center
          "
        >
          <div
            className="
              w-full
              max-w-[420px]

              rounded-[22px]

              border
              border-[#E75480]/10

              bg-white

              px-6
              py-7

              text-center

              shadow-[0_12px_32px_rgba(58,42,47,0.045)]

              sm:px-8
              sm:py-8
            "
          >
            {/* ICON */}

            <div
              className="
                mx-auto

                flex
                h-11
                w-11

                items-center
                justify-center

                rounded-full

                bg-[#FFF5F8]

                text-[#E75480]
              "
            >
              <ShoppingBag
                size={18}
                strokeWidth={1.6}
              />
            </div>

            {/* LABEL */}

            <p
              className="
                mt-4

                text-[7px]
                font-semibold
                uppercase
                tracking-[3px]

                text-[#E75480]
              "
            >
              Your Bag
            </p>

            {/* TITLE */}

            <h1
              className="
                mt-2

                font-serif

                text-[27px]
                leading-tight

                text-[#3A2A2F]

                sm:text-[30px]
              "
            >
              Your cart is empty
            </h1>

            {/* DESCRIPTION */}

            <p
              className="
                mx-auto
                mt-2.5
                max-w-[320px]

                text-[11px]
                leading-5

                text-[#8A6F78]

                sm:text-[12px]
              "
            >
              Discover your next beauty essential and add it to your bag.
            </p>

            {/* BUTTON */}

            <Link
              to="/products"
              className="
                mt-5

                inline-flex
                items-center
                justify-center
                gap-2

                rounded-full

                bg-[#E75480]

                px-7
                py-3

                text-[8px]
                font-semibold
                uppercase
                tracking-[1.8px]

                text-white

                transition-all
                duration-300

                hover:-translate-y-0.5
                hover:bg-[#D94773]
              "
            >
              Continue Shopping

              <ArrowRight
                size={12}
              />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /* ==========================================================
     PAGE
  ========================================================== */

  return (
    <main
      className="
        min-h-screen
        bg-[#FFF5F8]

        px-4
        pb-12
        pt-[88px]

        sm:px-6
        sm:pt-[96px]

        lg:px-8
        lg:pt-[104px]
      "
    >
      <div
        className="
          mx-auto
          max-w-[1120px]
        "
      >
        {/* ====================================================
            HEADER
        ==================================================== */}

        <header
          className="
            mb-6
            text-center

            lg:mb-7
          "
        >
          <p
            className="
              text-[8px]
              font-semibold
              uppercase
              tracking-[3.5px]
              text-[#E75480]
            "
          >
            Beauty Essentials
          </p>

          <h1
            className="
              mt-2
              font-serif
              text-[32px]
              leading-tight
              text-[#3A2A2F]

              sm:text-[38px]
            "
          >
            Shopping{" "}

            <span
              className="
                italic
                text-[#E75480]
              "
            >
              Cart
            </span>
          </h1>

          <p
            className="
              mt-1.5
              text-[10px]
              text-[#8A6F78]
            "
          >
            {totalItems}{" "}
            {totalItems ===
            1
              ? "item"
              : "items"}{" "}
            in your bag
          </p>
        </header>

        {/* ====================================================
            CART LAYOUT
        ==================================================== */}

        <div
          className="
            grid
            gap-5

            lg:grid-cols-[1fr_330px]
            lg:items-start
          "
        >
          {/* ==================================================
              CART ITEMS
          ================================================== */}

          <section
            className="
              overflow-hidden
              rounded-[24px]
              border
              border-[#E75480]/10
              bg-white
              shadow-[0_12px_35px_rgba(58,42,47,0.045)]
            "
          >
            {/* CART HEADER */}

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-[#E75480]/8
                px-5
                py-3.5

                sm:px-6
              "
            >
              <div>
                <p
                  className="
                    text-[7px]
                    font-semibold
                    uppercase
                    tracking-[2px]
                    text-[#E75480]
                  "
                >
                  Your Bag
                </p>

                <h2
                  className="
                    mt-0.5
                    font-serif
                    text-[20px]
                    text-[#3A2A2F]
                  "
                >
                  Selected Products
                </h2>
              </div>

              <span
                className="
                  rounded-full
                  bg-[#FFF5F8]
                  px-3
                  py-1.5
                  text-[9px]
                  font-medium
                  text-[#E75480]
                "
              >
                {cart.length}{" "}
                {cart.length ===
                1
                  ? "product"
                  : "products"}
              </span>
            </div>

            {/* ITEMS */}

            <div
              className="
                divide-y
                divide-[#E75480]/8
              "
            >
              {cart.map(
                (
                  item
                ) => (
                  <article
                    key={
                      item._id
                    }
                    className="
                      group

                      flex
                      gap-4
                      px-4
                      py-4

                      sm:items-center
                      sm:px-5

                      lg:px-6
                    "
                  >
                    {/* IMAGE */}

                    <Link
                      to={`/products/${item._id}`}
                      className="
                        h-[82px]
                        w-[82px]
                        shrink-0
                        overflow-hidden
                        rounded-[15px]
                        border
                        border-[#E75480]/8
                        bg-[#FFF9FB]

                        sm:h-[96px]
                        sm:w-[96px]
                      "
                    >
                      <img
                        src={
                          item.image
                        }
                        alt={
                          item.name
                        }
                        className="
                          h-full
                          w-full
                          object-cover
                          transition-transform
                          duration-500

                          group-hover:scale-[1.03]
                        "
                      />
                    </Link>

                    {/* CONTENT */}

                    <div
                      className="
                        min-w-0
                        flex-1
                      "
                    >
                      <div
                        className="
                          flex
                          items-start
                          justify-between
                          gap-3
                        "
                      >
                        <div
                          className="
                            min-w-0
                          "
                        >
                          <Link
                            to={`/products/${item._id}`}
                            className="
                              line-clamp-2
                              font-serif
                              text-[16px]
                              leading-[1.25]
                              text-[#3A2A2F]
                              transition-colors

                              hover:text-[#E75480]

                              sm:text-[18px]
                            "
                          >
                            {
                              item.name
                            }
                          </Link>

                          <p
                            className="
                              mt-1
                              text-[11px]
                              font-semibold
                              text-[#E75480]
                            "
                          >
                            Rs.{" "}
                            {formatPrice(
                              item.price
                            )}
                          </p>
                        </div>

                        {/* DESKTOP REMOVE */}

                        <button
                          type="button"
                          aria-label={`Remove ${item.name}`}
                          onClick={() => {
                            removeFromCart(
                              item._id
                            );

                            toast.info(
                              "Removed from cart"
                            );
                          }}
                          className="
                            hidden
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-[#E75480]/10
                            bg-white
                            text-[#A98994]
                            transition

                            hover:border-red-200
                            hover:bg-red-50
                            hover:text-red-500

                            sm:flex
                          "
                        >
                          <Trash2
                            size={13}
                          />
                        </button>
                      </div>

                      {/* BOTTOM ROW */}

                      <div
                        className="
                          mt-2.5
                          flex
                          flex-wrap
                          items-center
                          justify-between
                          gap-3
                        "
                      >
                        {/* QUANTITY */}

                        <div
                          className="
                            inline-flex
                            items-center
                            rounded-full
                            border
                            border-[#E75480]/10
                            bg-[#FFF9FB]
                            p-1
                          "
                        >
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() => {
                              decreaseQuantity(
                                item._id
                              );

                              toast.info(
                                "Quantity updated"
                              );
                            }}
                            className="
                              flex
                              h-7
                              w-7
                              items-center
                              justify-center
                              rounded-full
                              text-[#E75480]
                              transition

                              hover:bg-white
                            "
                          >
                            <Minus
                              size={12}
                            />
                          </button>

                          <span
                            className="
                              min-w-[32px]
                              text-center
                              text-[11px]
                              font-semibold
                              text-[#3A2A2F]
                            "
                          >
                            {
                              item.quantity
                            }
                          </span>

                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => {
                              increaseQuantity(
                                item._id
                              );

                              toast.success(
                                "Quantity updated"
                              );
                            }}
                            className="
                              flex
                              h-7
                              w-7
                              items-center
                              justify-center
                              rounded-full
                              text-[#E75480]
                              transition

                              hover:bg-white
                            "
                          >
                            <Plus
                              size={12}
                            />
                          </button>
                        </div>

                        {/* ITEM TOTAL */}

                        <p
                          className="
                            text-[10px]
                            text-[#8A6F78]
                          "
                        >
                          Item total{" "}

                          <span
                            className="
                              ml-1
                              font-semibold
                              text-[#3A2A2F]
                            "
                          >
                            Rs.{" "}
                            {formatPrice(
                              item.price *
                                item.quantity
                            )}
                          </span>
                        </p>
                      </div>

                      {/* MOBILE REMOVE */}

                      <button
                        type="button"
                        onClick={() => {
                          removeFromCart(
                            item._id
                          );

                          toast.info(
                            "Removed from cart"
                          );
                        }}
                        className="
                          mt-2.5
                          inline-flex
                          items-center
                          gap-1.5
                          text-[7px]
                          font-semibold
                          uppercase
                          tracking-[1.3px]
                          text-[#A98994]

                          sm:hidden
                        "
                      >
                        <Trash2
                          size={10}
                        />

                        Remove
                      </button>
                    </div>
                  </article>
                )
              )}
            </div>

            {/* CONTINUE SHOPPING */}

            <div
              className="
                border-t
                border-[#E75480]/8
                px-5
                py-3

                sm:px-6
              "
            >
              <Link
                to="/products"
                className="
                  inline-flex
                  items-center
                  gap-2
                  text-[7px]
                  font-semibold
                  uppercase
                  tracking-[1.7px]
                  text-[#E75480]
                  transition

                  hover:text-[#D94773]
                "
              >
                ← Continue Shopping
              </Link>
            </div>
          </section>

          {/* ==================================================
              SUMMARY
          ================================================== */}

          <aside
            className="
              lg:sticky
              lg:top-24
            "
          >
            <div
              className="
                rounded-[24px]
                border
                border-[#E75480]/10
                bg-white
                p-5
                shadow-[0_12px_35px_rgba(58,42,47,0.045)]

                sm:p-6
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2.5
                "
              >
                <div
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    bg-[#FFF5F8]
                    text-[#E75480]
                  "
                >
                  <ShoppingBag
                    size={14}
                  />
                </div>

                <div>
                  <p
                    className="
                      text-[7px]
                      font-semibold
                      uppercase
                      tracking-[2px]
                      text-[#E75480]
                    "
                  >
                    Summary
                  </p>

                  <h2
                    className="
                      font-serif
                      text-[20px]
                      text-[#3A2A2F]
                    "
                  >
                    Your Order
                  </h2>
                </div>
              </div>

              {/* SUMMARY ROWS */}

              <div
                className="
                  mt-4
                  space-y-2.5
                "
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >
                  <p
                    className="
                      text-[10px]
                      text-[#8A6F78]
                    "
                  >
                    Products
                  </p>

                  <p
                    className="
                      text-[10px]
                      font-semibold
                      text-[#3A2A2F]
                    "
                  >
                    {totalItems}
                  </p>
                </div>

                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >
                  <p
                    className="
                      text-[10px]
                      text-[#8A6F78]
                    "
                  >
                    Subtotal
                  </p>

                  <p
                    className="
                      text-[10px]
                      font-semibold
                      text-[#3A2A2F]
                    "
                  >
                    Rs.{" "}
                    {formatPrice(
                      total
                    )}
                  </p>
                </div>

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                  "
                >
                  <p
                    className="
                      text-[10px]
                      text-[#8A6F78]
                    "
                  >
                    Shipping
                  </p>

                  <p
                    className="
                      text-right
                      text-[9px]
                      text-[#A98994]
                    "
                  >
                    Calculated at checkout
                  </p>
                </div>
              </div>

              {/* TOTAL */}

              <div
                className="
                  mt-4
                  flex
                  items-end
                  justify-between
                  gap-3
                  border-t
                  border-[#E75480]/10
                  pt-4
                "
              >
                <div>
                  <p
                    className="
                      text-[7px]
                      font-semibold
                      uppercase
                      tracking-[1.8px]
                      text-[#8A6F78]
                    "
                  >
                    Total
                  </p>

                  <p
                    className="
                      mt-1
                      text-[8px]
                      text-[#A98994]
                    "
                  >
                    Before shipping
                  </p>
                </div>

                <p
                  className="
                    font-serif
                    text-[25px]
                    leading-none
                    text-[#E75480]
                  "
                >
                  Rs.{" "}
                  {formatPrice(
                    total
                  )}
                </p>
              </div>

              {/* CHECKOUT */}

              <Link
                to="/checkout"
                className="
                  mt-4
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  bg-[#E75480]
                  px-5
                  py-3
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[1.8px]
                  text-white
                  shadow-[0_8px_22px_rgba(231,84,128,0.17)]
                  transition-all
                  duration-300

                  hover:-translate-y-0.5
                  hover:bg-[#D94773]
                  hover:shadow-[0_10px_26px_rgba(231,84,128,0.23)]
                "
              >
                Proceed to Checkout

                <ArrowRight
                  size={12}
                />
              </Link>

              {/* TRUST */}

              <div
                className="
                  mt-3.5
                  flex
                  items-center
                  justify-center
                  gap-2
                "
              >
                <ShieldCheck
                  size={11}
                  className="
                    text-[#E75480]
                  "
                />

                <p
                  className="
                    text-[7px]
                    text-[#8A6F78]
                  "
                >
                  Secure checkout
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}