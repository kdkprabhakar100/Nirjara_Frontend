import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Check,
  ChevronDown,
  CreditCard,
  MapPin,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
  UploadCloud,
  UserRound,
} from "lucide-react";

import {
  useNavigate,
} from "react-router";

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
   MONEY
============================================================ */

function formatMoney(
  value: number
) {
  return `Rs. ${Number(
    value || 0
  ).toLocaleString()}`;
}

/* ============================================================
   CHECKOUT
============================================================ */

export default function Checkout() {
  const navigate =
    useNavigate();

  const {
    cart,
    clearCart,
  } = useCart();

  /* ==========================================================
     CUSTOMER FORM
  ========================================================== */

  const [
    form,
    setForm,
  ] = useState({
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
     SUBMIT
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
     ITEM COUNT
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

     These come from Admin / Site Settings.
     Nothing is hard-coded here.
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
     FETCH SETTINGS
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
               SHIPPING FROM ADMIN
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
              "CHECKOUT SETTINGS ERROR:",
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

      void fetchSettings();
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

      const stillAvailable =
        enabledShippingOptions.some(
          (
            option
          ) =>
            option.key ===
            selectedShippingKey
        );

      if (
        !stillAvailable
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
     PREVIEW CLEANUP
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
     UPDATE FORM
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

      /* SCREENSHOT */

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
           UPLOAD PAYMENT PROOF
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

                      Only the shipping key is sent.

                      Backend calculates the real
                      shipping price again using
                      Site Settings.
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

        sessionStorage.setItem(
          "nirjara-last-order",
          JSON.stringify(
            data
          )
        );

        clearCart();

        navigate(
          "/order-success",
          {
            replace:
              true,

            state: {
              order:
                data,
            },
          }
        );
      } catch (
        error
      ) {
        console.error(
          error
        );

        toast.error(
          error instanceof Error
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
      <main
        className="
          min-h-screen
          bg-[#FFF5F8]
          px-5
          pb-16
          pt-28
        "
      >
        <div
          className="
            mx-auto
            max-w-[520px]
            rounded-[24px]
            border
            border-[#E75480]/10
            bg-white
            p-8
            text-center
            shadow-[0_12px_35px_rgba(58,42,47,0.05)]
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
              bg-[#FFF5F8]
              text-[#E75480]
            "
          >
            <ShoppingBag
              size={20}
            />
          </div>

          <p
            className="
              mt-5
              text-[9px]
              font-semibold
              uppercase
              tracking-[3px]
              text-[#E75480]
            "
          >
            Your Bag
          </p>

          <h1
            className="
              mt-2
              font-serif
              text-3xl
              text-[#3A2A2F]
            "
          >
            Your cart is empty
          </h1>

          <p
            className="
              mt-3
              text-sm
              leading-6
              text-[#8A6F78]
            "
          >
            Add some products before continuing to checkout.
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
              text-[9px]
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
        pb-16
        pt-24

        sm:px-6
        sm:pt-28

        lg:px-8
      "
    >
      <div
        className="
          mx-auto
          max-w-[1180px]
        "
      >
        {/* ====================================================
            HEADER
        ==================================================== */}

        <header
          className="
            mb-7
            text-center
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
            Secure Checkout
          </p>

          <h1
            className="
              mt-2
              font-serif
              text-[34px]
              leading-tight
              text-[#3A2A2F]

              sm:text-[40px]
            "
          >
            Complete Your Order
          </h1>

          <p
            className="
              mx-auto
              mt-2
              max-w-xl
              text-[12px]
              leading-6
              text-[#8A6F78]

              sm:text-[13px]
            "
          >
            Delivery, payment and order confirmation — all in one simple checkout.
          </p>

          {/* STEPS */}

          <div
            className="
              mx-auto
              mt-5
              flex
              max-w-[560px]
              items-center
            "
          >
            <CheckoutStep
              number="1"
              label="Delivery"
              active
            />

            <div
              className="
                mx-2
                h-px
                flex-1
                bg-[#E75480]/15
              "
            />

            <CheckoutStep
              number="2"
              label="Payment"
              active={
                Boolean(
                  selectedShippingOption
                )
              }
            />

            <div
              className="
                mx-2
                h-px
                flex-1
                bg-[#E75480]/15
              "
            />

            <CheckoutStep
              number="3"
              label="Confirm"
              active={
                Boolean(
                  paymentProof
                )
              }
            />
          </div>
        </header>

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

            lg:grid-cols-[1.12fr_0.88fr]
            lg:items-start
          "
        >
          {/* ==================================================
              LEFT
          ================================================== */}

          <div
            className="
              overflow-hidden
              rounded-[26px]
              border
              border-[#E75480]/10
              bg-white
              shadow-[0_14px_40px_rgba(58,42,47,0.045)]
            "
          >
            {/* ================================================
                SHIPPING
            ================================================ */}

            <CheckoutSection
              number="01"
              icon={
                <Truck
                  size={17}
                />
              }
              title="Delivery Region"
              description="Choose where your order should be delivered."
            >
              {settingsLoading ? (
                <LoadingBox
                  text="Loading delivery options..."
                />
              ) : enabledShippingOptions.length ===
                0 ? (
                <div
                  className="
                    rounded-[16px]
                    border
                    border-red-100
                    bg-red-50
                    p-4
                  "
                >
                  <p
                    className="
                      text-sm
                      font-medium
                      text-red-700
                    "
                  >
                    Shipping is currently unavailable.
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      leading-5
                      text-red-600/80
                    "
                  >
                    Please contact Nirjara Beauty before placing your order.
                  </p>
                </div>
              ) : (
                <>
                  {/* ==========================================
                      DYNAMIC SHIPPING DROPDOWN
                  ========================================== */}

                  <label
                    htmlFor="shipping-region"
                    className="
                      mb-1.5
                      block
                      text-[8px]
                      font-semibold
                      uppercase
                      tracking-[1.6px]
                      text-[#8A6F78]
                    "
                  >
                    Delivery Region
                  </label>

                  <div
                    className="
                      relative
                    "
                  >
                    <MapPin
                      size={15}
                      className="
                        pointer-events-none
                        absolute
                        left-4
                        top-1/2
                        z-10
                        -translate-y-1/2
                        text-[#E75480]
                      "
                    />

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
                        h-12
                        w-full
                        appearance-none
                        rounded-[15px]
                        border
                        border-[#E75480]/12
                        bg-[#FFF9FB]

                        pl-11
                        pr-11

                        text-[13px]
                        font-medium
                        text-[#3A2A2F]

                        outline-none
                        transition

                        hover:border-[#E75480]/25

                        focus:border-[#E75480]/45
                        focus:bg-white
                      "
                    >
                      <option
                        value=""
                      >
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

                    <ChevronDown
                      size={16}
                      className="
                        pointer-events-none
                        absolute
                        right-4
                        top-1/2
                        -translate-y-1/2
                        text-[#E75480]
                      "
                    />
                  </div>

                  {/* ==========================================
                      SELECTED SHIPPING INFO
                  ========================================== */}

                  {selectedShippingOption && (
                    <div
                      className="
                        mt-3
                        flex
                        items-center
                        justify-between
                        gap-4
                        rounded-[15px]
                        border
                        border-[#E75480]/10
                        bg-[#FFF9FB]
                        px-4
                        py-3
                      "
                    >
                      <div
                        className="
                          flex
                          min-w-0
                          items-center
                          gap-3
                        "
                      >
                        <span
                          className="
                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-white
                            text-[#E75480]
                          "
                        >
                          <Check
                            size={13}
                          />
                        </span>

                        <div
                          className="
                            min-w-0
                          "
                        >
                          <p
                            className="
                              truncate
                              text-[11px]
                              font-semibold
                              text-[#3A2A2F]
                            "
                          >
                            {
                              selectedShippingOption.label
                            }
                          </p>

                          <p
                            className="
                              mt-0.5
                              text-[9px]
                              text-[#8A6F78]
                            "
                          >
                            Selected delivery region
                          </p>
                        </div>
                      </div>

                      {selectedShippingOption.freeShipping ? (
                        <span
                          className="
                            shrink-0
                            rounded-full
                            bg-green-50
                            px-3
                            py-1.5
                            text-[9px]
                            font-semibold
                            uppercase
                            tracking-[1px]
                            text-green-700
                          "
                        >
                          Free
                        </span>
                      ) : (
                        <p
                          className="
                            shrink-0
                            text-[11px]
                            font-semibold
                            text-[#E75480]
                          "
                        >
                          {formatMoney(
                            selectedShippingOption.price
                          )}
                        </p>
                      )}
                    </div>
                  )}

                  {/* FREE SHIPPING NOTE */}

                  {selectedShippingOption?.freeShipping &&
                    selectedShippingOption.freeShippingNote && (
                      <div
                        className="
                          mt-2.5
                          rounded-[13px]
                          bg-green-50
                          px-4
                          py-2.5
                        "
                      >
                        <p
                          className="
                            text-[10px]
                            leading-5
                            text-green-700
                          "
                        >
                          {
                            selectedShippingOption.freeShippingNote
                          }
                        </p>
                      </div>
                    )}
                </>
              )}
            </CheckoutSection>

            {/* ================================================
                CUSTOMER DETAILS
            ================================================ */}

            <CheckoutSection
              number="02"
              icon={
                <UserRound
                  size={17}
                />
              }
              title="Delivery Details"
              description="Tell us where and who should receive the order."
              bordered
            >
              <div
                className="
                  grid
                  gap-3.5

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

                <div
                  className="
                    sm:col-span-2
                  "
                >
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

                <div
                  className="
                    sm:col-span-2
                  "
                >
                  <label
                    className="
                      mb-1.5
                      block
                      text-[8px]
                      font-semibold
                      uppercase
                      tracking-[1.6px]
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
                      rounded-[14px]
                      border
                      border-[#E75480]/12
                      bg-[#FFF9FB]
                      px-4
                      py-3
                      text-[13px]
                      text-[#3A2A2F]
                      outline-none
                      transition

                      placeholder:text-[#8A6F78]/45

                      focus:border-[#E75480]/45
                      focus:bg-white
                    "
                  />
                </div>
              </div>
            </CheckoutSection>

            {/* ================================================
                PAYMENT
            ================================================ */}

            <CheckoutSection
              number="03"
              icon={
                <CreditCard
                  size={17}
                />
              }
              title="Payment"
              description="Scan the QR, pay the final amount and upload your payment screenshot."
              bordered
            >
              {settingsLoading ? (
                <LoadingBox
                  text="Loading payment details..."
                />
              ) : !paymentSettings.qrImage ? (
                <div
                  className="
                    rounded-[16px]
                    border
                    border-dashed
                    border-red-200
                    bg-red-50
                    p-5
                    text-center
                  "
                >
                  <p
                    className="
                      text-sm
                      font-semibold
                      text-red-700
                    "
                  >
                    Payment temporarily unavailable
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      leading-5
                      text-red-600/80
                    "
                  >
                    The payment QR has not been configured yet.
                  </p>
                </div>
              ) : (
                <div
                  className="
                    grid
                    gap-4

                    sm:grid-cols-[185px_1fr]
                    sm:items-start
                  "
                >
                  {/* QR */}

                  <div
                    className="
                      rounded-[18px]
                      border
                      border-[#E75480]/10
                      bg-[#FFF9FB]
                      p-3
                      text-center
                    "
                  >
                    <p
                      className="
                        text-[7px]
                        font-semibold
                        uppercase
                        tracking-[1.8px]
                        text-[#A98994]
                      "
                    >
                      Scan to Pay
                    </p>

                    <div
                      className="
                        mx-auto
                        mt-2.5
                        overflow-hidden
                        rounded-[14px]
                        bg-white
                        p-2
                      "
                    >
                      <img
                        src={
                          paymentSettings.qrImage
                        }
                        alt="Nirjara Beauty payment QR"
                        className="
                          mx-auto
                          max-h-[160px]
                          w-full
                          object-contain
                        "
                      />
                    </div>

                    {paymentSettings.accountName && (
                      <div
                        className="
                          mt-2.5
                        "
                      >
                        <p
                          className="
                            text-[6px]
                            uppercase
                            tracking-[1.5px]
                            text-[#A98994]
                          "
                        >
                          Pay To
                        </p>

                        <p
                          className="
                            mt-0.5
                            text-[11px]
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
                  </div>

                  {/* PAYMENT INFO */}

                  <div>
                    <div
                      className="
                        rounded-[16px]
                        border
                        border-[#E75480]/10
                        bg-[#FFF9FB]
                        p-4
                      "
                    >
                      <p
                        className="
                          text-[7px]
                          font-semibold
                          uppercase
                          tracking-[1.8px]
                          text-[#A98994]
                        "
                      >
                        Amount to Pay
                      </p>

                      <p
                        className="
                          mt-1
                          font-serif
                          text-[28px]
                          leading-none
                          text-[#E75480]
                        "
                      >
                        {selectedShippingOption
                          ? formatMoney(
                              finalTotal
                            )
                          : "Select shipping"}
                      </p>

                      {paymentSettings.instructions && (
                        <p
                          className="
                            mt-3
                            text-[10px]
                            leading-5
                            text-[#8A6F78]
                          "
                        >
                          {
                            paymentSettings.instructions
                          }
                        </p>
                      )}
                    </div>

                    {/* UPLOAD */}

                    <div
                      className="
                        mt-3
                      "
                    >
                      {!paymentProofPreview ? (
                        <label
                          className="
                            flex
                            cursor-pointer
                            items-center
                            gap-3
                            rounded-[16px]
                            border
                            border-dashed
                            border-[#E75480]/25
                            bg-white
                            px-4
                            py-4
                            transition

                            hover:border-[#E75480]/50
                            hover:bg-[#FFF9FB]
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

                          <span
                            className="
                              flex
                              h-10
                              w-10
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              bg-[#FFF5F8]
                              text-[#E75480]
                            "
                          >
                            <UploadCloud
                              size={17}
                            />
                          </span>

                          <div>
                            <p
                              className="
                                text-[11px]
                                font-semibold
                                text-[#3A2A2F]
                              "
                            >
                              Upload payment screenshot
                            </p>

                            <p
                              className="
                                mt-0.5
                                text-[9px]
                                text-[#8A6F78]
                              "
                            >
                              JPG or PNG · Maximum 5 MB
                            </p>
                          </div>
                        </label>
                      ) : (
                        <div
                          className="
                            flex
                            items-center
                            gap-3
                            rounded-[16px]
                            border
                            border-[#E75480]/12
                            bg-[#FFF9FB]
                            p-3
                          "
                        >
                          <img
                            src={
                              paymentProofPreview
                            }
                            alt="Payment screenshot preview"
                            className="
                              h-14
                              w-14
                              shrink-0
                              rounded-[10px]
                              bg-white
                              object-cover
                            "
                          />

                          <div
                            className="
                              min-w-0
                              flex-1
                            "
                          >
                            <p
                              className="
                                truncate
                                text-[11px]
                                font-semibold
                                text-[#3A2A2F]
                              "
                            >
                              {
                                paymentProof?.name
                              }
                            </p>

                            <p
                              className="
                                mt-0.5
                                text-[9px]
                                text-green-700
                              "
                            >
                              Screenshot ready
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={
                              removePaymentProof
                            }
                            aria-label="Remove payment screenshot"
                            className="
                              flex
                              h-9
                              w-9
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              border
                              border-red-100
                              bg-white
                              text-red-500

                              hover:bg-red-50
                            "
                          >
                            <Trash2
                              size={14}
                            />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* VERIFICATION */}

              <div
                className="
                  mt-4
                  flex
                  items-start
                  gap-2.5
                  rounded-[14px]
                  bg-[#FFF5F8]
                  px-4
                  py-3
                "
              >
                <ShieldCheck
                  size={15}
                  className="
                    mt-0.5
                    shrink-0
                    text-[#E75480]
                  "
                />

                <p
                  className="
                    text-[10px]
                    leading-5
                    text-[#8A6F78]
                  "
                >
                  Your payment will be reviewed by Nirjara Beauty before your order is confirmed.
                </p>
              </div>
            </CheckoutSection>
          </div>

          {/* ==================================================
              ORDER SUMMARY
          ================================================== */}

          <aside
            className="
              lg:sticky
              lg:top-24
            "
          >
            <div
              className="
                overflow-hidden
                rounded-[26px]
                border
                border-[#E75480]/10
                bg-white
                shadow-[0_14px_40px_rgba(58,42,47,0.045)]
              "
            >
              {/* HEADER */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                  border-b
                  border-[#E75480]/10
                  px-5
                  py-4

                  sm:px-6
                "
              >
                <div>
                  <p
                    className="
                      text-[8px]
                      font-semibold
                      uppercase
                      tracking-[2.5px]
                      text-[#E75480]
                    "
                  >
                    Your Bag
                  </p>

                  <h2
                    className="
                      mt-1
                      font-serif
                      text-[24px]
                      text-[#3A2A2F]
                    "
                  >
                    Order Summary
                  </h2>
                </div>

                <span
                  className="
                    rounded-full
                    bg-[#FFF5F8]
                    px-3
                    py-1.5
                    text-[10px]
                    font-medium
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

              <div
                className="
                  max-h-[260px]
                  overflow-y-auto
                  px-5
                  py-3

                  sm:px-6
                "
              >
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
                        gap-3
                        border-b
                        border-[#E75480]/8
                        py-3

                        last:border-b-0
                      "
                    >
                      <div
                        className="
                          h-14
                          w-14
                          shrink-0
                          overflow-hidden
                          rounded-[12px]
                          border
                          border-[#E75480]/8
                          bg-[#FFF9FB]
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
                          "
                        />
                      </div>

                      <div
                        className="
                          min-w-0
                          flex-1
                        "
                      >
                        <p
                          className="
                            line-clamp-2
                            text-[11px]
                            font-medium
                            leading-4
                            text-[#3A2A2F]
                          "
                        >
                          {
                            item.name
                          }
                        </p>

                        <p
                          className="
                            mt-1
                            text-[9px]
                            text-[#8A6F78]
                          "
                        >
                          Qty:{" "}
                          {
                            item.quantity
                          }
                        </p>
                      </div>

                      <p
                        className="
                          whitespace-nowrap
                          text-[11px]
                          font-semibold
                          text-[#3A2A2F]
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

              {/* TOTALS */}

              <div
                className="
                  border-t
                  border-[#E75480]/10
                  px-5
                  py-5

                  sm:px-6
                "
              >
                <div
                  className="
                    space-y-2.5
                  "
                >
                  <SummaryRow
                    label="Products"
                    value={
                      formatMoney(
                        subtotal
                      )
                    }
                  />

                  <SummaryRow
                    label="Shipping"
                    value={
                      !selectedShippingOption
                        ? "Select region"
                        : selectedShippingOption.freeShipping
                        ? "Free"
                        : formatMoney(
                            shippingCost
                          )
                    }
                    accent={
                      Boolean(
                        selectedShippingOption?.freeShipping
                      )
                    }
                  />
                </div>

                <div
                  className="
                    mt-4
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
                        text-[8px]
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
                        text-[10px]
                        text-[#8A6F78]
                      "
                    >
                      Amount to pay
                    </p>
                  </div>

                  <p
                    className="
                      font-serif
                      text-[28px]
                      leading-none
                      text-[#E75480]
                    "
                  >
                    {formatMoney(
                      finalTotal
                    )}
                  </p>
                </div>

                {/* PLACE ORDER */}

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
                    mt-5
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-full
                    bg-[#E75480]
                    px-6
                    py-3.5
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[1.8px]
                    text-white
                    shadow-[0_8px_22px_rgba(231,84,128,0.18)]
                    transition

                    hover:bg-[#D94873]

                    disabled:cursor-not-allowed
                    disabled:bg-[#E7CBD4]
                    disabled:shadow-none
                  "
                >
                  {loading ? (
                    "Submitting Order..."
                  ) : (
                    <>
                      <PackageCheck
                        size={14}
                      />

                      {selectedShippingOption
                        ? `Place Order · ${formatMoney(
                            finalTotal
                          )}`
                        : "Select Shipping"}
                    </>
                  )}
                </button>

                {!selectedShippingOption &&
                  !settingsLoading &&
                  enabledShippingOptions.length >
                    0 && (
                    <p
                      className="
                        mt-2.5
                        text-center
                        text-[9px]
                        text-[#8A6F78]
                      "
                    >
                      Select a delivery region to continue.
                    </p>
                  )}

                {selectedShippingOption &&
                  !paymentProof &&
                  paymentSettings.qrImage &&
                  !settingsLoading && (
                    <p
                      className="
                        mt-2.5
                        text-center
                        text-[9px]
                        text-[#8A6F78]
                      "
                    >
                      Upload your payment screenshot to place the order.
                    </p>
                  )}

                <div
                  className="
                    mt-4
                    flex
                    items-center
                    justify-center
                    gap-2
                    text-[8px]
                    text-[#8A6F78]
                  "
                >
                  <ShieldCheck
                    size={12}
                    className="
                      text-[#E75480]
                    "
                  />

                  Secure checkout • Payment verification
                </div>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}

/* ============================================================
   CHECKOUT SECTION
============================================================ */

function CheckoutSection({
  number,
  icon,
  title,
  description,
  children,
  bordered = false,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
  bordered?: boolean;
}) {
  return (
    <section
      className={`
        p-5

        sm:p-6

        ${
          bordered
            ? "border-t border-[#E75480]/10"
            : ""
        }
      `}
    >
      <div
        className="
          mb-4
          flex
          items-start
          gap-3
        "
      >
        <div
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-[#FFF5F8]
            text-[#E75480]
          "
        >
          {icon}
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
            {number}
          </p>

          <h2
            className="
              mt-0.5
              font-serif
              text-[22px]
              leading-tight
              text-[#3A2A2F]
            "
          >
            {title}
          </h2>

          <p
            className="
              mt-1
              text-[10px]
              leading-5
              text-[#8A6F78]
            "
          >
            {description}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
}

/* ============================================================
   INPUT
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
          mb-1.5
          block
          text-[8px]
          font-semibold
          uppercase
          tracking-[1.6px]
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
          h-11
          w-full
          rounded-[14px]
          border
          border-[#E75480]/12
          bg-[#FFF9FB]
          px-4
          text-[13px]
          text-[#3A2A2F]
          outline-none
          transition

          placeholder:text-[#8A6F78]/45

          focus:border-[#E75480]/45
          focus:bg-white
        "
      />
    </div>
  );
}

/* ============================================================
   CHECKOUT STEP
============================================================ */

function CheckoutStep({
  number,
  label,
  active = false,
}: {
  number: string;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className="
        flex
        shrink-0
        items-center
        gap-2
      "
    >
      <span
        className={`
          flex
          h-7
          w-7
          items-center
          justify-center
          rounded-full
          border
          text-[9px]
          font-semibold

          ${
            active
              ? "border-[#E75480] bg-[#E75480] text-white"
              : "border-[#E75480]/15 bg-white text-[#A98994]"
          }
        `}
      >
        {active ? (
          <Check
            size={11}
          />
        ) : (
          number
        )}
      </span>

      <span
        className={`
          hidden
          text-[8px]
          font-semibold
          uppercase
          tracking-[1.5px]

          sm:block

          ${
            active
              ? "text-[#E75480]"
              : "text-[#A98994]"
          }
        `}
      >
        {label}
      </span>
    </div>
  );
}

/* ============================================================
   SUMMARY ROW
============================================================ */

function SummaryRow({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-4
      "
    >
      <p
        className="
          text-[11px]
          text-[#8A6F78]
        "
      >
        {label}
      </p>

      <p
        className={`
          text-[11px]
          font-semibold

          ${
            accent
              ? "text-green-700"
              : "text-[#3A2A2F]"
          }
        `}
      >
        {value}
      </p>
    </div>
  );
}

/* ============================================================
   LOADING
============================================================ */

function LoadingBox({
  text,
}: {
  text: string;
}) {
  return (
    <div
      className="
        flex
        min-h-[90px]
        items-center
        justify-center
        rounded-[16px]
        bg-[#FFF9FB]
      "
    >
      <p
        className="
          text-[11px]
          text-[#8A6F78]
        "
      >
        {text}
      </p>
    </div>
  );
}