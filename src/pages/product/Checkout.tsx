import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useCart,
} from "../../context/CartContext";

import {
  toast,
} from "react-toastify";

import {
  uploadPaymentProof,
} from "../../services/upload/uploadService";

/* ============================================================
   TYPES
============================================================ */

type PaymentSettings = {
  qrImage: string;
  accountName: string;
  instructions: string;
};

type ShippingOption = {
  key: string;
  label: string;
  price: number;
  enabled: boolean;
  freeShipping: boolean;
  freeShippingNote: string;
};

type ShippingSettings = {
  options: ShippingOption[];
};

/* ============================================================
   DEFAULT SETTINGS
============================================================ */

const defaultPaymentSettings: PaymentSettings = {
  qrImage: "",
  accountName: "",
  instructions:
    "Scan the QR code, complete your payment, and upload a screenshot of the payment confirmation.",
};

const defaultShippingSettings: ShippingSettings = {
  options: [],
};

/* ============================================================
   MONEY FORMAT
============================================================ */

const formatMoney = (
  value: number
) => {
  return `Rs. ${Number(
    value || 0
  ).toLocaleString()}`;
};

/* ============================================================
   CHECKOUT
============================================================ */

export default function Checkout() {
  const navigate =
    useNavigate();

  const {
    cart,
    clearCart,
  } =
    useCart();

  /* ==========================================================
     CUSTOMER FORM
  ========================================================== */

  const [
    form,
    setForm,
  ] =
    useState({
      customerName: "",
      email: "",
      phone: "",
      address: "",
    });

  /* ==========================================================
     PAYMENT SETTINGS
  ========================================================== */

  const [
    paymentSettings,
    setPaymentSettings,
  ] =
    useState<PaymentSettings>(
      defaultPaymentSettings
    );

  /* ==========================================================
     SHIPPING SETTINGS
  ========================================================== */

  const [
    shippingSettings,
    setShippingSettings,
  ] =
    useState<ShippingSettings>(
      defaultShippingSettings
    );

  const [
    selectedShippingKey,
    setSelectedShippingKey,
  ] =
    useState("");

  /* ==========================================================
     SETTINGS LOADING
  ========================================================== */

  const [
    settingsLoading,
    setSettingsLoading,
  ] =
    useState(true);

  /* ==========================================================
     PAYMENT PROOF
  ========================================================== */

  const [
    paymentProof,
    setPaymentProof,
  ] =
    useState<File | null>(
      null
    );

  const [
    paymentProofPreview,
    setPaymentProofPreview,
  ] =
    useState("");

  /* ==========================================================
     SUBMIT STATE
  ========================================================== */

  const [
    loading,
    setLoading,
  ] =
    useState(false);

  /* ==========================================================
     PRODUCT SUBTOTAL
  ========================================================== */

  const subtotal =
    useMemo(
      () =>
        cart.reduce(
          (
            total,
            item
          ) =>
            total +
            item.price *
              item.quantity,

          0
        ),
      [
        cart,
      ]
    );

  /* ==========================================================
     TOTAL ITEMS
  ========================================================== */

  const totalItems =
    useMemo(
      () =>
        cart.reduce(
          (
            count,
            item
          ) =>
            count +
            item.quantity,

          0
        ),
      [
        cart,
      ]
    );

  /* ==========================================================
     ENABLED SHIPPING OPTIONS
  ========================================================== */

  const enabledShippingOptions =
    useMemo(
      () =>
        shippingSettings.options.filter(
          (
            option
          ) =>
            option.enabled
        ),

      [
        shippingSettings,
      ]
    );

  /* ==========================================================
     SELECTED SHIPPING OPTION
  ========================================================== */

  const selectedShippingOption =
    useMemo(
      () =>
        enabledShippingOptions.find(
          (
            option
          ) =>
            option.key ===
            selectedShippingKey
        ) ??
        null,

      [
        enabledShippingOptions,
        selectedShippingKey,
      ]
    );

  /* ==========================================================
     SHIPPING COST

     DISPLAY ONLY.

     Backend will calculate the final shipping
     price again before creating the order.
  ========================================================== */

  const shippingCost =
    selectedShippingOption
      ? selectedShippingOption.freeShipping
        ? 0
        : Number(
            selectedShippingOption.price ||
              0
          )
      : 0;

  /* ==========================================================
     FINAL TOTAL
  ========================================================== */

  const finalTotal =
    subtotal +
    shippingCost;

  /* ==========================================================
     FETCH CHECKOUT SETTINGS
  ========================================================== */

  useEffect(
    () => {
      const fetchSettings =
        async () => {
          try {
            setSettingsLoading(
              true
            );

            const response =
              await fetch(
                `${
                  import.meta.env
                    .VITE_API_URL
                }/api/site-settings`
              );

            if (
              !response.ok
            ) {
              throw new Error(
                "Unable to load checkout settings"
              );
            }

            const data =
              await response.json();

            /* ================================================
               PAYMENT
            ================================================ */

            setPaymentSettings({
              qrImage:
                data.payment
                  ?.qrImage ??
                "",

              accountName:
                data.payment
                  ?.accountName ??
                "",

              instructions:
                data.payment
                  ?.instructions ??
                defaultPaymentSettings.instructions,
            });

            /* ================================================
               SHIPPING
            ================================================ */

            const options:
              ShippingOption[] =
              Array.isArray(
                data.shipping
                  ?.options
              )
                ? data.shipping.options.map(
                    (
                      option: ShippingOption
                    ) => ({
                      key:
                        option.key,

                      label:
                        option.label,

                      price:
                        Number(
                          option.price ||
                            0
                        ),

                      enabled:
                        option.enabled ===
                        true,

                      freeShipping:
                        option.freeShipping ===
                        true,

                      freeShippingNote:
                        option.freeShippingNote ||
                        "",
                    })
                  )
                : [];

            setShippingSettings({
              options,
            });
          } catch (
            error
          ) {
            console.error(
              error
            );

            setPaymentSettings(
              defaultPaymentSettings
            );

            setShippingSettings(
              defaultShippingSettings
            );

            toast.error(
              "Unable to load checkout settings."
            );
          } finally {
            setSettingsLoading(
              false
            );
          }
        };

      fetchSettings();
    },
    []
  );

  /* ==========================================================
     KEEP SHIPPING SELECTION VALID
  ========================================================== */

  useEffect(
    () => {
      if (
        !selectedShippingKey
      ) {
        return;
      }

      const available =
        enabledShippingOptions.some(
          (
            option
          ) =>
            option.key ===
            selectedShippingKey
        );

      if (
        !available
      ) {
        setSelectedShippingKey(
          ""
        );
      }
    },

    [
      enabledShippingOptions,
      selectedShippingKey,
    ]
  );

  /* ==========================================================
     PAYMENT PREVIEW CLEANUP
  ========================================================== */

  useEffect(
    () => {
      return () => {
        if (
          paymentProofPreview
        ) {
          URL.revokeObjectURL(
            paymentProofPreview
          );
        }
      };
    },

    [
      paymentProofPreview,
    ]
  );

  /* ==========================================================
     UPDATE CUSTOMER FIELD
  ========================================================== */

  const updateField = (
    field:
      | "customerName"
      | "email"
      | "phone"
      | "address",

    value: string
  ) => {
    setForm(
      (
        previous
      ) => ({
        ...previous,

        [field]:
          value,
      })
    );
  };

  /* ==========================================================
     PAYMENT SCREENSHOT
  ========================================================== */

  const handlePaymentProofChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target
        .files?.[0];

    if (
      !file
    ) {
      return;
    }

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      toast.error(
        "Please upload an image of your payment screenshot."
      );

      event.target.value =
        "";

      return;
    }

    if (
      file.size >
      5 *
        1024 *
        1024
    ) {
      toast.error(
        "Payment screenshot must be smaller than 5 MB."
      );

      event.target.value =
        "";

      return;
    }

    if (
      paymentProofPreview
    ) {
      URL.revokeObjectURL(
        paymentProofPreview
      );
    }

    setPaymentProof(
      file
    );

    setPaymentProofPreview(
      URL.createObjectURL(
        file
      )
    );
  };

  /* ==========================================================
     REMOVE PAYMENT SCREENSHOT
  ========================================================== */

  const removePaymentProof =
    () => {
      if (
        paymentProofPreview
      ) {
        URL.revokeObjectURL(
          paymentProofPreview
        );
      }

      setPaymentProof(
        null
      );

      setPaymentProofPreview(
        ""
      );
    };

  /* ==========================================================
     SUBMIT ORDER
  ========================================================== */

  const handleSubmit =
    async (
      event: React.FormEvent
    ) => {
      event.preventDefault();

      /* CART */

      if (
        cart.length ===
        0
      ) {
        toast.error(
          "Your cart is empty"
        );

        navigate(
          "/products"
        );

        return;
      }

      /* SHIPPING */

      if (
        !selectedShippingOption
      ) {
        toast.error(
          "Please select a shipping region."
        );

        return;
      }

      /* QR */

      if (
        !paymentSettings.qrImage
      ) {
        toast.error(
          "Online payment is currently unavailable."
        );

        return;
      }

      /* PAYMENT SCREENSHOT */

      if (
        !paymentProof
      ) {
        toast.error(
          "Please upload your payment screenshot."
        );

        return;
      }

      try {
        setLoading(
          true
        );

        /* ================================================
           UPLOAD PAYMENT SCREENSHOT
        ================================================ */

const paymentProofUrl =
  await uploadPaymentProof(
    paymentProof
  );

        if (
          !paymentProofUrl
        ) {
          throw new Error(
            "Payment screenshot could not be uploaded."
          );
        }

        /* ================================================
           CREATE ORDER
        ================================================ */

        const response =
          await fetch(
            `${
              import.meta.env
                .VITE_API_URL
            }/api/orders`,

            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify(
                  {
                    customerName:
                      form.customerName.trim(),

                    email:
                      form.email.trim(),

                    phone:
                      form.phone.trim(),

                    address:
                      form.address.trim(),

                    /*
                      IMPORTANT:

                      Send ONLY shipping key.

                      Backend gets the real shipping
                      price from Site Settings.
                    */

                    shippingKey:
                      selectedShippingOption.key,

                    paymentProof:
                      paymentProofUrl,

                    items:
                      cart.map(
                        (
                          item
                        ) => ({
                          _id:
                            item._id,

                          quantity:
                            item.quantity,
                        })
                      ),
                  }
                ),
            }
          );

        const data =
          await response
            .json()
            .catch(
              () =>
                ({})
            );

        if (
          !response.ok
        ) {
          throw new Error(
            data?.message ||
              "Failed to place order"
          );
        }

        /* ================================================
           SUCCESS
        ================================================ */

        clearCart();

        toast.success(
          "Order placed! Payment is waiting for verification 💖"
        );

        setTimeout(
          () => {
            navigate(
              "/"
            );
          },

          1500
        );
      } catch (
        error
      ) {
        console.error(
          error
        );

        toast.error(
          error instanceof
          Error
            ? error.message
            : "Something went wrong"
        );
      } finally {
        setLoading(
          false
        );
      }
    };

  /* ==========================================================
     EMPTY CART
  ========================================================== */

  if (
    cart.length ===
    0
  ) {
    return (
      <section className="min-h-screen bg-[#FFF5F8] px-5 pb-20 pt-28">
        <div
          className="
            mx-auto
            max-w-lg
            rounded-[28px]
            border
            border-[#E75480]/10
            bg-white
            p-8
            text-center
            shadow-sm
          "
        >
          <p
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-[4px]
              text-[#E75480]
            "
          >
            Your Bag
          </p>

          <h1
            className="
              mt-3
              font-serif
              text-3xl
              text-[#3A2A2F]
            "
          >
            Your cart is empty
          </h1>

          <p className="mt-3 text-sm text-[#8A6F78]">
            Add some products before continuing
            to checkout.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/products"
              )
            }
            className="
              mt-6
              rounded-full
              bg-[#E75480]
              px-7
              py-3
              text-xs
              font-semibold
              uppercase
              tracking-[2px]
              text-white
              transition

              hover:bg-[#D94873]
            "
          >
            Browse Products
          </button>
        </div>
      </section>
    );
  }

  /* ==========================================================
     UI
  ========================================================== */

  return (
    <section
      className="
        min-h-screen
        bg-[#FFF5F8]
        px-4
        pb-20
        pt-24

        sm:px-6
        sm:pt-28

        lg:px-8
      "
    >
      <div className="mx-auto max-w-5xl">

        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="mb-6 text-center">
          <p
            className="
              text-[9px]
              font-semibold
              uppercase
              tracking-[4px]
              text-[#E75480]
            "
          >
            Secure Checkout
          </p>

          <h1
            className="
              mt-2
              font-serif
              text-3xl
              text-[#3A2A2F]

              sm:text-4xl
            "
          >
            Complete Your Order
          </h1>

          <p
            className="
              mx-auto
              mt-2
              max-w-lg
              text-sm
              leading-6
              text-[#8A6F78]
            "
          >
            Review your products, choose your
            delivery region and complete your payment.
          </p>
        </div>

        {/* ====================================================
            CHECKOUT FORM
        ==================================================== */}

        <form
          onSubmit={
            handleSubmit
          }
          className="
            grid
            gap-6

            lg:grid-cols-[1.05fr_0.95fr]
          "
        >

          {/* ==================================================
              LEFT
          ================================================== */}

          <div className="space-y-5">

            {/* ================================================
                ORDER SUMMARY
            ================================================ */}

            <div
              className="
                rounded-[26px]
                border
                border-[#E75480]/10
                bg-white
                p-5
                shadow-sm

                sm:p-6
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                "
              >
                <div>
                  <p
                    className="
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[3px]
                      text-[#E75480]
                    "
                  >
                    Your Bag
                  </p>

                  <h2
                    className="
                      mt-2
                      font-serif
                      text-2xl
                      text-[#3A2A2F]
                    "
                  >
                    Order Summary
                  </h2>
                </div>

                <span
                  className="
                    shrink-0
                    rounded-full
                    bg-[#FFF5F8]
                    px-3
                    py-1.5
                    text-xs
                    text-[#E75480]
                  "
                >
                  {totalItems}{" "}
                  item
                  {totalItems ===
                  1
                    ? ""
                    : "s"}
                </span>
              </div>

              {/* PRODUCTS */}

              <div className="mt-5 space-y-3">
                {cart.map(
                  (
                    item
                  ) => (
                    <div
                      key={
                        item._id
                      }
                      className="
                        flex
                        items-center
                        gap-4
                        rounded-2xl
                        bg-[#FFF8FA]
                        p-3
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
                          h-16
                          w-16
                          shrink-0
                          rounded-xl
                          object-cover
                        "
                      />

                      <div className="min-w-0 flex-1">
                        <p
                          className="
                            truncate
                            text-sm
                            font-medium
                            text-[#3A2A2F]
                          "
                        >
                          {
                            item.name
                          }
                        </p>

                        <p className="mt-1 text-xs text-[#8A6F78]">
                          Quantity:{" "}
                          {
                            item.quantity
                          }
                        </p>
                      </div>

                      <p
                        className="
                          whitespace-nowrap
                          text-sm
                          font-semibold
                          text-[#E75480]
                        "
                      >
                        {formatMoney(
                          item.price *
                            item.quantity
                        )}
                      </p>
                    </div>
                  )
                )}
              </div>

              {/* PRICE BREAKDOWN */}

              <div
                className="
                  mt-5
                  space-y-3
                  border-t
                  border-[#E75480]/10
                  pt-5
                "
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-4
                  "
                >
                  <p className="text-sm text-[#8A6F78]">
                    Products
                  </p>

                  <p className="text-sm font-medium text-[#3A2A2F]">
                    {formatMoney(
                      subtotal
                    )}
                  </p>
                </div>

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-4
                  "
                >
                  <p className="text-sm text-[#8A6F78]">
                    Shipping
                  </p>

                  {!selectedShippingOption ? (
                    <p className="text-xs text-[#8A6F78]">
                      Select below
                    </p>
                  ) : selectedShippingOption.freeShipping ? (
                    <div className="text-right">
                      <span
                        className="
                          rounded-full
                          bg-green-100
                          px-3
                          py-1
                          text-[10px]
                          font-semibold
                          uppercase
                          tracking-[1px]
                          text-green-700
                        "
                      >
                        Free
                      </span>

                      {selectedShippingOption.price >
                        0 && (
                        <p className="mt-1 text-[11px] text-[#8A6F78] line-through">
                          {formatMoney(
                            selectedShippingOption.price
                          )}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm font-medium text-[#3A2A2F]">
                      {formatMoney(
                        shippingCost
                      )}
                    </p>
                  )}
                </div>

                <div
                  className="
                    flex
                    items-end
                    justify-between
                    gap-4
                    border-t
                    border-[#E75480]/10
                    pt-4
                  "
                >
                  <div>
                    <p
                      className="
                        text-xs
                        uppercase
                        tracking-[2px]
                        text-[#8A6F78]
                      "
                    >
                      Total
                    </p>

                    <p className="mt-1 text-xs text-[#8A6F78]">
                      Amount to pay
                    </p>
                  </div>

                  <p
                    className="
                      font-serif
                      text-3xl
                      text-[#E75480]
                    "
                  >
                    {formatMoney(
                      finalTotal
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* ================================================
                SHIPPING DROPDOWN
            ================================================ */}

            <div
              className="
                rounded-[26px]
                border
                border-[#E75480]/10
                bg-white
                p-5
                shadow-sm

                sm:p-6
              "
            >
              <div className="mb-5">
                <p
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[3px]
                    text-[#E75480]
                  "
                >
                  01 · Shipping
                </p>

                <h2
                  className="
                    mt-2
                    font-serif
                    text-2xl
                    text-[#3A2A2F]
                  "
                >
                  Delivery Region
                </h2>

                <p className="mt-1 text-xs leading-5 text-[#8A6F78]">
                  Choose where your order should be
                  delivered. The shipping fee will be
                  added automatically.
                </p>
              </div>

              {settingsLoading ? (
                <div
                  className="
                    rounded-2xl
                    bg-[#FFF8FA]
                    p-5
                    text-center
                  "
                >
                  <p className="text-sm text-[#8A6F78]">
                    Loading shipping options...
                  </p>
                </div>
              ) : enabledShippingOptions.length ===
                0 ? (
                <div
                  className="
                    rounded-2xl
                    border
                    border-red-100
                    bg-red-50
                    p-5
                  "
                >
                  <p className="text-sm font-medium text-red-700">
                    Shipping is currently unavailable.
                  </p>

                  <p className="mt-1 text-xs leading-5 text-red-600/80">
                    Please contact Nirjara Beauty before
                    placing your order.
                  </p>
                </div>
              ) : (
                <>
                  {/* DROPDOWN */}

                  <div>
                    <label
                      htmlFor="shipping-region"
                      className="
                        mb-2
                        block
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[2px]
                        text-[#8A6F78]
                      "
                    >
                      Shipping Region
                    </label>

                    <div className="relative">
                      <select
                        id="shipping-region"
                        required
                        value={
                          selectedShippingKey
                        }
                        onChange={(
                          event
                        ) =>
                          setSelectedShippingKey(
                            event.target
                              .value
                          )
                        }
                        className="
                          h-14
                          w-full
                          appearance-none
                          rounded-2xl
                          border
                          border-[#E75480]/15
                          bg-[#FFF8FA]
                          px-4
                          pr-12
                          text-sm
                          font-medium
                          text-[#3A2A2F]
                          outline-none
                          transition

                          hover:border-[#E75480]/30

                          focus:border-[#E75480]/60
                          focus:bg-white
                        "
                      >
                        <option value="">
                          Select delivery region
                        </option>

                        {enabledShippingOptions.map(
                          (
                            option
                          ) => (
                            <option
                              key={
                                option.key
                              }
                              value={
                                option.key
                              }
                            >
                              {
                                option.label
                              }
                              {" — "}
                              {option.freeShipping
                                ? "FREE SHIPPING"
                                : formatMoney(
                                    option.price
                                  )}
                            </option>
                          )
                        )}
                      </select>

                      {/* CUSTOM ARROW */}

                      <div
                        className="
                          pointer-events-none
                          absolute
                          right-4
                          top-1/2
                          -translate-y-1/2
                          text-[#E75480]
                        "
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* SELECTED SHIPPING PREVIEW */}

                  {selectedShippingOption && (
                    <div
                      className="
                        mt-4
                        rounded-2xl
                        border
                        border-[#E75480]/10
                        bg-[#FFF8FA]
                        p-4
                      "
                    >
                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          gap-4
                        "
                      >
                        <div>
                          <p className="text-sm font-semibold text-[#3A2A2F]">
                            {
                              selectedShippingOption.label
                            }
                          </p>

                          <p className="mt-1 text-xs text-[#8A6F78]">
                            Selected shipping option
                          </p>
                        </div>

                        {selectedShippingOption.freeShipping ? (
                          <div className="text-right">
                            <span
                              className="
                                inline-block
                                rounded-full
                                bg-green-100
                                px-3
                                py-1.5
                                text-[10px]
                                font-semibold
                                uppercase
                                tracking-[1px]
                                text-green-700
                              "
                            >
                              Free Shipping
                            </span>

                            {selectedShippingOption.price >
                              0 && (
                              <p className="mt-1 text-[11px] text-[#8A6F78] line-through">
                                {formatMoney(
                                  selectedShippingOption.price
                                )}
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm font-semibold text-[#E75480]">
                            {formatMoney(
                              selectedShippingOption.price
                            )}
                          </p>
                        )}
                      </div>

                      {/* FREE SHIPPING NOTE */}

                      {selectedShippingOption.freeShipping &&
                        selectedShippingOption.freeShippingNote && (
                          <div
                            className="
                              mt-3
                              rounded-xl
                              bg-green-50
                              px-3
                              py-2.5
                            "
                          >
                            <p className="text-xs leading-5 text-green-700">
                              {
                                selectedShippingOption.freeShippingNote
                              }
                            </p>
                          </div>
                        )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* ================================================
                DELIVERY DETAILS
            ================================================ */}

            <div
              className="
                rounded-[26px]
                border
                border-[#E75480]/10
                bg-white
                p-5
                shadow-sm

                sm:p-6
              "
            >
              <div className="mb-5">
                <p
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[3px]
                    text-[#E75480]
                  "
                >
                  02 · Delivery
                </p>

                <h2
                  className="
                    mt-2
                    font-serif
                    text-2xl
                    text-[#3A2A2F]
                  "
                >
                  Your Details
                </h2>

                <p className="mt-1 text-xs text-[#8A6F78]">
                  Where should we deliver your order?
                </p>
              </div>

              <div
                className="
                  grid
                  gap-4

                  sm:grid-cols-2
                "
              >
                <CheckoutInput
                  label="Full Name"
                  placeholder="Your full name"
                  value={
                    form.customerName
                  }
                  onChange={(
                    value
                  ) =>
                    updateField(
                      "customerName",
                      value
                    )
                  }
                />

                <CheckoutInput
                  label="Phone"
                  placeholder="Phone number"
                  value={
                    form.phone
                  }
                  onChange={(
                    value
                  ) =>
                    updateField(
                      "phone",
                      value
                    )
                  }
                />

                <div className="sm:col-span-2">
                  <CheckoutInput
                    label="Email"
                    type="email"
                    placeholder="Email address"
                    value={
                      form.email
                    }
                    onChange={(
                      value
                    ) =>
                      updateField(
                        "email",
                        value
                      )
                    }
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    className="
                      mb-2
                      block
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[2px]
                      text-[#8A6F78]
                    "
                  >
                    Delivery Address
                  </label>

                  <textarea
                    required
                    rows={
                      3
                    }
                    value={
                      form.address
                    }
                    placeholder="Street, area, city..."
                    onChange={(
                      event
                    ) =>
                      updateField(
                        "address",
                        event.target
                          .value
                      )
                    }
                    className="
                      w-full
                      resize-none
                      rounded-2xl
                      border
                      border-[#E75480]/15
                      bg-[#FFF8FA]
                      px-4
                      py-3.5
                      text-sm
                      text-[#3A2A2F]
                      outline-none
                      transition

                      placeholder:text-[#8A6F78]/50

                      focus:border-[#E75480]/50
                      focus:bg-white
                    "
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ==================================================
              RIGHT - PAYMENT
          ================================================== */}

          <div>
            <div
              className="
                rounded-[26px]
                border
                border-[#E75480]/10
                bg-white
                p-5
                shadow-sm

                sm:p-6

                lg:sticky
                lg:top-24
              "
            >
              <div>
                <p
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[3px]
                    text-[#E75480]
                  "
                >
                  03 · Payment
                </p>

                <h2
                  className="
                    mt-2
                    font-serif
                    text-2xl
                    text-[#3A2A2F]
                  "
                >
                  Pay Online
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#8A6F78]">
                  Select shipping first, then scan the QR
                  and pay the final total shown below.
                </p>
              </div>

              {/* SETTINGS LOADING */}

              {settingsLoading ? (
                <div
                  className="
                    mt-6
                    flex
                    min-h-[240px]
                    items-center
                    justify-center
                    rounded-[22px]
                    bg-[#FFF8FA]
                  "
                >
                  <p className="text-sm text-[#8A6F78]">
                    Loading payment details...
                  </p>
                </div>
              ) : !paymentSettings.qrImage ? (
                /* =============================================
                   NO QR
                ============================================= */

                <div
                  className="
                    mt-6
                    rounded-[22px]
                    border
                    border-dashed
                    border-red-200
                    bg-red-50
                    p-6
                    text-center
                  "
                >
                  <div
                    className="
                      mx-auto
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-full
                      bg-white
                      text-xl
                    "
                  >
                    !
                  </div>

                  <p className="mt-4 text-sm font-semibold text-red-700">
                    Payment temporarily unavailable
                  </p>

                  <p className="mt-2 text-xs leading-5 text-red-600/80">
                    The payment QR has not been
                    configured yet. Please try again
                    later.
                  </p>
                </div>
              ) : (
                <>
                  {/* ===========================================
                      QR
                  =========================================== */}

                  <div
                    className="
                      mt-6
                      rounded-[22px]
                      bg-[#FFF8FA]
                      p-5
                      text-center
                    "
                  >
                    <p
                      className="
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[2px]
                        text-[#8A6F78]
                      "
                    >
                      Scan to Pay
                    </p>

                    <div
                      className="
                        mx-auto
                        mt-4
                        flex
                        max-w-[240px]
                        items-center
                        justify-center
                        rounded-[20px]
                        bg-white
                        p-3
                        shadow-sm
                      "
                    >
                      <img
                        src={
                          paymentSettings.qrImage
                        }
                        alt="Nirjara Beauty payment QR"
                        className="
                          max-h-[220px]
                          w-full
                          object-contain
                        "
                      />
                    </div>

                    {/* ACCOUNT NAME */}

                    {paymentSettings.accountName && (
                      <div className="mt-4">
                        <p
                          className="
                            text-[10px]
                            uppercase
                            tracking-[2px]
                            text-[#8A6F78]
                          "
                        >
                          Pay To
                        </p>

                        <p
                          className="
                            mt-1
                            text-sm
                            font-semibold
                            text-[#3A2A2F]
                          "
                        >
                          {
                            paymentSettings.accountName
                          }
                        </p>
                      </div>
                    )}

                    {/* PAYMENT BREAKDOWN */}

                    <div
                      className="
                        mt-4
                        rounded-2xl
                        bg-white
                        px-4
                        py-4
                      "
                    >
                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          gap-4
                        "
                      >
                        <p className="text-xs text-[#8A6F78]">
                          Products
                        </p>

                        <p className="text-xs font-medium text-[#3A2A2F]">
                          {formatMoney(
                            subtotal
                          )}
                        </p>
                      </div>

                      <div
                        className="
                          mt-2
                          flex
                          items-center
                          justify-between
                          gap-4
                        "
                      >
                        <p className="text-xs text-[#8A6F78]">
                          Shipping
                        </p>

                        {!selectedShippingOption ? (
                          <p className="text-xs text-[#E75480]">
                            Not selected
                          </p>
                        ) : selectedShippingOption.freeShipping ? (
                          <p
                            className="
                              text-xs
                              font-semibold
                              uppercase
                              tracking-[1px]
                              text-green-700
                            "
                          >
                            Free
                          </p>
                        ) : (
                          <p className="text-xs font-medium text-[#3A2A2F]">
                            {formatMoney(
                              shippingCost
                            )}
                          </p>
                        )}
                      </div>

                      <div
                        className="
                          mt-3
                          border-t
                          border-[#E75480]/10
                          pt-3
                        "
                      >
                        <p className="text-xs text-[#8A6F78]">
                          Amount to Pay
                        </p>

                        <p
                          className="
                            mt-1
                            font-serif
                            text-3xl
                            text-[#E75480]
                          "
                        >
                          {formatMoney(
                            finalTotal
                          )}
                        </p>
                      </div>
                    </div>

                    {/* FREE SHIPPING PROMOTION */}

                    {selectedShippingOption?.freeShipping &&
                      selectedShippingOption.freeShippingNote && (
                        <div
                          className="
                            mt-3
                            rounded-2xl
                            border
                            border-green-100
                            bg-green-50
                            px-4
                            py-3
                            text-left
                          "
                        >
                          <p
                            className="
                              text-[10px]
                              font-semibold
                              uppercase
                              tracking-[1.5px]
                              text-green-700
                            "
                          >
                            Free Shipping
                          </p>

                          <p className="mt-1 text-xs leading-5 text-green-700/80">
                            {
                              selectedShippingOption.freeShippingNote
                            }
                          </p>
                        </div>
                      )}
                  </div>

                  {/* ===========================================
                      PAYMENT INSTRUCTIONS
                  =========================================== */}

                  {paymentSettings.instructions && (
                    <div
                      className="
                        mt-4
                        rounded-2xl
                        border
                        border-[#E75480]/10
                        bg-white
                        p-4
                      "
                    >
                      <p
                        className="
                          text-[10px]
                          font-semibold
                          uppercase
                          tracking-[2px]
                          text-[#E75480]
                        "
                      >
                        Instructions
                      </p>

                      <p
                        className="
                          mt-2
                          text-xs
                          leading-5
                          text-[#8A6F78]
                        "
                      >
                        {
                          paymentSettings.instructions
                        }
                      </p>
                    </div>
                  )}

                  {/* ===========================================
                      PAYMENT SCREENSHOT
                  =========================================== */}

                  <div className="mt-5">
                    <label
                      className="
                        mb-2
                        block
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[2px]
                        text-[#8A6F78]
                      "
                    >
                      Payment Screenshot
                    </label>

                    {!paymentProofPreview ? (
                      <label
                        className="
                          flex
                          cursor-pointer
                          flex-col
                          items-center
                          justify-center
                          rounded-[20px]
                          border
                          border-dashed
                          border-[#E75480]/30
                          bg-[#FFF8FA]
                          px-5
                          py-7
                          text-center
                          transition

                          hover:border-[#E75480]
                          hover:bg-[#FFF5F8]
                        "
                      >
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={
                            handlePaymentProofChange
                          }
                        />

                        <div
                          className="
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-full
                            bg-white
                            text-xl
                            shadow-sm
                          "
                        >
                          ↑
                        </div>

                        <p
                          className="
                            mt-3
                            text-sm
                            font-medium
                            text-[#3A2A2F]
                          "
                        >
                          Upload payment screenshot
                        </p>

                        <p className="mt-1 text-xs text-[#8A6F78]">
                          JPG, PNG or other image · Max 5 MB
                        </p>
                      </label>
                    ) : (
                      <div
                        className="
                          overflow-hidden
                          rounded-[20px]
                          border
                          border-[#E75480]/15
                          bg-[#FFF8FA]
                          p-3
                        "
                      >
                        <img
                          src={
                            paymentProofPreview
                          }
                          alt="Payment screenshot preview"
                          className="
                            max-h-[260px]
                            w-full
                            rounded-2xl
                            bg-white
                            object-contain
                          "
                        />

                        <div
                          className="
                            mt-3
                            flex
                            items-center
                            justify-between
                            gap-3
                          "
                        >
                          <div className="min-w-0">
                            <p
                              className="
                                truncate
                                text-xs
                                font-medium
                                text-[#3A2A2F]
                              "
                            >
                              {
                                paymentProof?.name
                              }
                            </p>

                            <p className="mt-1 text-[11px] text-[#8A6F78]">
                              Screenshot ready to upload
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={
                              removePaymentProof
                            }
                            className="
                              shrink-0
                              rounded-full
                              border
                              border-red-200
                              bg-white
                              px-4
                              py-2
                              text-[10px]
                              font-semibold
                              uppercase
                              tracking-[1.5px]
                              text-red-600
                              transition

                              hover:bg-red-50
                            "
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ===========================================
                      PAYMENT VERIFICATION NOTE
                  =========================================== */}

                  <div
                    className="
                      mt-4
                      rounded-2xl
                      bg-[#FFF5F8]
                      p-4
                    "
                  >
                    <p className="text-xs leading-5 text-[#8A6F78]">
                      Your order will remain{" "}
                      <strong className="text-[#3A2A2F]">
                        Pending Verification
                      </strong>{" "}
                      until Nirjara Beauty confirms your
                      payment screenshot. You will receive
                      an email after your payment has been
                      verified.
                    </p>
                  </div>
                </>
              )}

              {/* ==============================================
                  PLACE ORDER
              ============================================== */}

              <button
                type="submit"
                disabled={
                  loading ||
                  settingsLoading ||
                  !selectedShippingOption ||
                  !paymentSettings.qrImage ||
                  !paymentProof ||
                  enabledShippingOptions.length ===
                    0
                }
                className="
                  mt-6
                  w-full
                  rounded-full
                  bg-[#E75480]
                  px-6
                  py-4
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[2.5px]
                  text-white
                  shadow-sm
                  transition

                  hover:bg-[#D94873]

                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {loading
                  ? "Submitting Order..."
                  : selectedShippingOption
                    ? `Place Order · ${formatMoney(
                        finalTotal
                      )}`
                    : "Select Shipping"}
              </button>

              {/* SHIPPING MESSAGE */}

              {!selectedShippingOption &&
                !settingsLoading &&
                enabledShippingOptions.length >
                  0 && (
                  <p className="mt-3 text-center text-[11px] text-[#8A6F78]">
                    Select your shipping region to
                    continue.
                  </p>
                )}

              {/* SCREENSHOT MESSAGE */}

              {selectedShippingOption &&
                !paymentProof &&
                paymentSettings.qrImage &&
                !settingsLoading && (
                  <p className="mt-3 text-center text-[11px] text-[#8A6F78]">
                    Upload your payment screenshot to
                    place the order.
                  </p>
                )}
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

/* ============================================================
   CHECKOUT INPUT
============================================================ */

type CheckoutInputProps = {
  label: string;

  value: string;

  placeholder: string;

  type?: string;

  onChange:
    (
      value: string
    ) => void;
};

function CheckoutInput({
  label,
  value,
  placeholder,
  type = "text",
  onChange,
}: CheckoutInputProps) {
  return (
    <div>
      <label
        className="
          mb-2
          block
          text-[10px]
          font-semibold
          uppercase
          tracking-[2px]
          text-[#8A6F78]
        "
      >
        {label}
      </label>

      <input
        required
        type={
          type
        }
        value={
          value
        }
        placeholder={
          placeholder
        }
        onChange={(
          event
        ) =>
          onChange(
            event.target
              .value
          )
        }
        className="
          h-12
          w-full
          rounded-2xl
          border
          border-[#E75480]/15
          bg-[#FFF8FA]
          px-4
          text-sm
          text-[#3A2A2F]
          outline-none
          transition

          placeholder:text-[#8A6F78]/50

          focus:border-[#E75480]/50
          focus:bg-white
        "
      />
    </div>
  );
}