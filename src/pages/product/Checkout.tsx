import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";

export default function Checkout() {
  const navigate = useNavigate();

  const { cart, clearCart } = useCart();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
  });

  const total = cart.reduce(
    (acc, item) =>
      acc + item.price * item.quantity,
    0
  );

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (cart.length === 0) {
      toast.error("Your cart is empty");

      navigate("/products");

      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orders`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            customerName: form.customerName,

            email: form.email,

            phone: form.phone,

            address: form.address,

            items: cart.map((item) => ({
              _id: item._id,

              name: item.name,

              image: item.image,

              price: item.price,

              quantity: item.quantity,
            })),

            totalAmount: total,

            status: "Pending",
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to place order");
      }

      clearCart();

      toast.success("Order placed successfully 💖");

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (error) {
      console.log(error);

      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#FFF5F8] px-4 pb-20 pt-32 sm:px-6 lg:px-10">

      <div className="mx-auto max-w-3xl rounded-[32px] bg-white p-6 shadow-sm sm:p-10">

        {/* HEADER */}
        <div className="text-center">
          <p className="text-xs uppercase tracking-[5px] text-[#E75480]">
            Secure Checkout
          </p>

          <h1 className="mt-4 font-serif text-4xl text-[#3A2A2F] sm:text-5xl">
            Checkout
          </h1>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-6"
        >

          {/* NAME */}
          <input
            type="text"
            placeholder="Full Name"
            required
            value={form.customerName}
            onChange={(e) =>
              setForm({
                ...form,
                customerName: e.target.value,
              })
            }
            className="
              w-full
              rounded-2xl
              border
              border-[#F3D3DC]
              bg-[#FFF5F8]
              p-4
              outline-none
              transition
              focus:border-[#E75480]
            "
          />

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email Address"
            required
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
            className="
              w-full
              rounded-2xl
              border
              border-[#F3D3DC]
              bg-[#FFF5F8]
              p-4
              outline-none
              transition
              focus:border-[#E75480]
            "
          />

          {/* PHONE */}
          <input
            type="text"
            placeholder="Phone Number"
            required
            value={form.phone}
            onChange={(e) =>
              setForm({
                ...form,
                phone: e.target.value,
              })
            }
            className="
              w-full
              rounded-2xl
              border
              border-[#F3D3DC]
              bg-[#FFF5F8]
              p-4
              outline-none
              transition
              focus:border-[#E75480]
            "
          />

          {/* ADDRESS */}
          <textarea
            placeholder="Delivery Address"
            required
            rows={5}
            value={form.address}
            onChange={(e) =>
              setForm({
                ...form,
                address: e.target.value,
              })
            }
            className="
              w-full
              rounded-2xl
              border
              border-[#F3D3DC]
              bg-[#FFF5F8]
              p-4
              outline-none
              transition
              focus:border-[#E75480]
            "
          />

          {/* TOTAL */}
          <div className="rounded-3xl bg-[#FFF5F8] p-6">

            <div className="flex items-center justify-between">

              <h2 className="font-serif text-2xl text-[#3A2A2F]">
                Total
              </h2>

              <p className="text-3xl font-semibold text-[#E75480]">
                ${total.toFixed(2)}
              </p>
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              rounded-full
              bg-[#E75480]
              px-6
              py-4
              text-sm
              uppercase
              tracking-[3px]
              text-white
              transition
              hover:bg-[#d63c6d]
              disabled:opacity-60
            "
          >
            {loading
              ? "Placing Order..."
              : "Place Order"}
          </button>
        </form>
      </div>
    </section>
  );
}