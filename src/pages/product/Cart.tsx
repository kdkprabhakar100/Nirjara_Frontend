import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";

export default function Cart() {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const total = cart.reduce(
    (acc, item) =>
      acc + item.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#FFF5F8] px-6 text-center">

        <div>
          <h1 className="font-serif text-4xl text-[#E75480] sm:text-5xl">
            Your cart is empty
          </h1>

          <p className="mt-4 text-[#8A6F78]">
            Add some beautiful products to continue shopping.
          </p>

          <Link
            to="/products"
            className="
              mt-8
              inline-block
              rounded-full
              bg-[#E75480]
              px-8
              py-4
              text-sm
              uppercase
              tracking-[2px]
              text-white
              transition
              hover:bg-[#d63c6d]
            "
          >
            Continue Shopping
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#FFF5F8] px-4 pb-20 pt-32 sm:px-6 lg:px-10">

      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="text-center">
          <p className="text-xs uppercase tracking-[5px] text-[#E75480]">
            Beauty Essentials
          </p>

          <h1 className="mt-4 font-serif text-5xl text-[#3A2A2F] sm:text-6xl">
            Shopping Cart
          </h1>
        </div>

        {/* CART ITEMS */}
        <div className="mt-16 space-y-6">

          {cart.map((item) => (
            <div
              key={item._id}
              className="
                flex flex-col gap-6
                rounded-[30px]
                bg-white
                p-5
                shadow-sm
                sm:flex-row
                sm:items-center
              "
            >

              {/* IMAGE */}
              <img
                src={item.image}
                alt={item.name}
                className="
                  h-32
                  w-full
                  rounded-2xl
                  object-cover
                  sm:h-32
                  sm:w-32
                "
              />

              {/* CONTENT */}
              <div className="flex-1">

                <h2 className="font-serif text-3xl text-[#3A2A2F]">
                  {item.name}
                </h2>

                <p className="mt-3 text-2xl font-semibold text-[#E75480]">
                  ${item.price}
                </p>

                {/* QUANTITY */}
                <div className="mt-5 flex items-center gap-3">

                  <button
                    onClick={() => {
                      decreaseQuantity(item._id);

                      toast.info("Quantity updated");
                    }}
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-full
                      bg-[#FFF5F8]
                      text-xl
                      text-[#E75480]
                      transition
                      hover:bg-[#FCE7EF]
                    "
                  >
                    -
                  </button>

                  <span className="min-w-[20px] text-center text-lg font-medium">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => {
                      increaseQuantity(item._id);

                      toast.success("Quantity updated 💖");
                    }}
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-full
                      bg-[#FFF5F8]
                      text-xl
                      text-[#E75480]
                      transition
                      hover:bg-[#FCE7EF]
                    "
                  >
                    +
                  </button>
                </div>
              </div>

              {/* REMOVE */}
              <button
                onClick={() => {
                  removeFromCart(item._id);

                  toast.error("Removed from cart");
                }}
                className="
                  rounded-full
                  border
                  border-red-200
                  px-5
                  py-3
                  text-sm
                  uppercase
                  tracking-[2px]
                  text-red-500
                  transition
                  hover:bg-red-50
                "
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* TOTAL */}
        <div className="mt-10 rounded-[32px] bg-white p-8 shadow-sm">

          <div className="flex items-center justify-between">

            <h2 className="font-serif text-3xl text-[#3A2A2F]">
              Total
            </h2>

            <p className="text-4xl font-semibold text-[#E75480]">
              ${total.toFixed(2)}
            </p>
          </div>

          {/* CHECKOUT */}
          <Link
            to="/checkout"
            className="
              mt-8
              block
              rounded-full
              bg-[#E75480]
              px-6
              py-4
              text-center
              text-sm
              uppercase
              tracking-[3px]
              text-white
              transition
              hover:bg-[#d63c6d]
            "
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </section>
  );
}