import {
  useEffect,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

/* ============================================================
   TYPES
============================================================ */

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
  image?: string;
};

type OrderShipping = {
  key: string;
  label: string;
  regularPrice: number;
  cost: number;
  freeShipping: boolean;
  freeShippingNote?: string;
};

type CompletedOrder = {
  _id: string;

  orderNumber: string;

  customerName: string;
  email: string;
  phone: string;
  address: string;

  items: OrderItem[];

  subtotal: number;

  shipping: OrderShipping;

  totalAmount: number;

  paymentMethod: string;

  paymentStatus:
    | "Pending Verification"
    | "Verified"
    | "Rejected"
    | string;

  status: string;

  createdAt?: string;
};

type OrderLocationState = {
  order?: CompletedOrder;
};

/* ============================================================
   HELPERS
============================================================ */

const formatMoney = (
  value: number
) =>
  `Rs. ${Number(
    value || 0
  ).toLocaleString()}`;

const formatDate = (
  value?: string
) => {
  if (
    !value
  ) {
    return new Date().toLocaleDateString();
  }

  const date =
    new Date(
      value
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return new Date().toLocaleDateString();
  }

  return date.toLocaleDateString(
    undefined,
    {
      year:
        "numeric",

      month:
        "short",

      day:
        "numeric",
    }
  );
};

/* ============================================================
   ORDER SUCCESS
============================================================ */

export default function OrderSuccess() {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const locationState =
    location.state as
      | OrderLocationState
      | null;

  const [
    order,
    setOrder,
  ] =
    useState<CompletedOrder | null>(
      locationState?.order ??
        null
    );

  const [
    downloading,
    setDownloading,
  ] =
    useState(false);

  /* ==========================================================
     RESTORE AFTER REFRESH
  ========================================================== */

  useEffect(
    () => {
      if (
        locationState?.order
      ) {
        setOrder(
          locationState.order
        );

        sessionStorage.setItem(
          "nirjara-last-order",
          JSON.stringify(
            locationState.order
          )
        );

        return;
      }

      try {
        const stored =
          sessionStorage.getItem(
            "nirjara-last-order"
          );

        if (
          !stored
        ) {
          return;
        }

        setOrder(
          JSON.parse(
            stored
          ) as CompletedOrder
        );
      } catch (
        error
      ) {
        console.error(
          "ORDER RESTORE ERROR:",
          error
        );
      }
    },
    [
      locationState?.order,
    ]
  );

  /* ==========================================================
     EMPTY STATE
  ========================================================== */

  if (
    !order
  ) {
    return (
      <section
        className="
          min-h-screen
          bg-[#FFF5F8]
          px-4
          pb-20
          pt-28
        "
      >
        <div
          className="
            mx-auto
            max-w-md
            rounded-[24px]
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
              tracking-[3px]
              text-[#E75480]
            "
          >
            Order
          </p>

          <h1
            className="
              mt-2
              font-serif
              text-2xl
              text-[#3A2A2F]
            "
          >
            Order details unavailable
          </h1>

          <p
            className="
              mt-2
              text-sm
              leading-6
              text-[#8A6F78]
            "
          >
            We could not find the most recent
            order information on this device.
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
              px-6
              py-3
              text-xs
              font-semibold
              uppercase
              tracking-[1.5px]
              text-white
            "
          >
            Continue Shopping
          </button>
        </div>
      </section>
    );
  }

  /* ==========================================================
     VALUES
  ========================================================== */

  const subtotal =
    Number(
      order.subtotal ??
        0
    );

  const shippingCost =
    Number(
      order.shipping?.cost ??
        0
    );

  const total =
    Number(
      order.totalAmount ??
        subtotal +
          shippingCost
    );

  const totalQuantity =
    order.items.reduce(
      (
        sum,
        item
      ) =>
        sum +
        Number(
          item.quantity ||
            0
        ),
      0
    );

  const orderDate =
    formatDate(
      order.createdAt
    );

  /* ==========================================================
     DOWNLOAD PDF BILL
  ========================================================== */

  const downloadBill =
    async () => {
      try {
        setDownloading(
          true
        );

        const {
          jsPDF,
        } =
          await import(
            "jspdf"
          );

        const doc =
          new jsPDF({
            unit:
              "mm",

            format:
              "a4",
          });

        const pageWidth =
          doc.internal.pageSize.getWidth();

        const left =
          18;

        const right =
          pageWidth -
          18;

        let y =
          20;

        const line = (
          yPosition: number
        ) => {
          doc.setDrawColor(
            225
          );

          doc.line(
            left,
            yPosition,
            right,
            yPosition
          );
        };

        /* HEADER */

        doc.setFont(
          "helvetica",
          "bold"
        );

        doc.setFontSize(
          19
        );

        doc.text(
          "NIRJARA BEAUTY",
          left,
          y
        );

        doc.setFont(
          "helvetica",
          "normal"
        );

        doc.setFontSize(
          9
        );

        doc.setTextColor(
          100
        );

        doc.text(
          "ORDER RECEIPT",
          right,
          y,
          {
            align:
              "right",
          }
        );

        y +=
          8;

        doc.setTextColor(
          40
        );

        doc.setFontSize(
          9
        );

        doc.text(
          `Order: ${order.orderNumber}`,
          left,
          y
        );

        doc.text(
          `Date: ${orderDate}`,
          right,
          y,
          {
            align:
              "right",
          }
        );

        y +=
          6;

        doc.setTextColor(
          180,
          90,
          120
        );

        doc.text(
          `Payment: ${order.paymentStatus || "Pending Verification"}`,
          left,
          y
        );

        y +=
          7;

        line(
          y
        );

        y +=
          8;

        /* CUSTOMER */

        doc.setTextColor(
          40
        );

        doc.setFont(
          "helvetica",
          "bold"
        );

        doc.setFontSize(
          10
        );

        doc.text(
          "BILL TO",
          left,
          y
        );

        y +=
          6;

        doc.setFont(
          "helvetica",
          "normal"
        );

        doc.setFontSize(
          9
        );

        doc.text(
          order.customerName ||
            "-",
          left,
          y
        );

        y +=
          5;

        doc.text(
          order.phone ||
            "-",
          left,
          y
        );

        y +=
          5;

        doc.text(
          order.email ||
            "-",
          left,
          y
        );

        y +=
          5;

        const addressLines =
          doc.splitTextToSize(
            order.address ||
              "-",
            90
          );

        doc.text(
          addressLines,
          left,
          y
        );

        y +=
          addressLines.length *
            5 +
          6;

        line(
          y
        );

        y +=
          8;

        /* ITEMS HEADER */

        doc.setFont(
          "helvetica",
          "bold"
        );

        doc.setFontSize(
          9
        );

        doc.text(
          "ITEM",
          left,
          y
        );

        doc.text(
          "QTY",
          125,
          y,
          {
            align:
              "right",
          }
        );

        doc.text(
          "PRICE",
          155,
          y,
          {
            align:
              "right",
          }
        );

        doc.text(
          "TOTAL",
          right,
          y,
          {
            align:
              "right",
          }
        );

        y +=
          5;

        line(
          y
        );

        y +=
          6;

        /* ITEMS */

        doc.setFont(
          "helvetica",
          "normal"
        );

        for (
          const item
          of order.items
        ) {
          const itemTotal =
            Number(
              item.price
            ) *
            Number(
              item.quantity
            );

          const nameLines =
            doc.splitTextToSize(
              item.name,
              75
            );

          doc.text(
            nameLines,
            left,
            y
          );

          doc.text(
            String(
              item.quantity
            ),
            125,
            y,
            {
              align:
                "right",
            }
          );

          doc.text(
            formatMoney(
              item.price
            ),
            155,
            y,
            {
              align:
                "right",
            }
          );

          doc.text(
            formatMoney(
              itemTotal
            ),
            right,
            y,
            {
              align:
                "right",
            }
          );

          y +=
            Math.max(
              6,
              nameLines.length *
                5
            );

          if (
            y >
            260
          ) {
            doc.addPage();

            y =
              20;
          }
        }

        y +=
          2;

        line(
          y
        );

        y +=
          8;

        /* TOTALS */

        doc.setFontSize(
          9
        );

        doc.text(
          "Subtotal",
          140,
          y
        );

        doc.text(
          formatMoney(
            subtotal
          ),
          right,
          y,
          {
            align:
              "right",
          }
        );

        y +=
          6;

        doc.text(
          `Shipping${
            order.shipping?.label
              ? ` (${order.shipping.label})`
              : ""
          }`,
          140,
          y
        );

        doc.text(
          shippingCost ===
          0
            ? "FREE"
            : formatMoney(
                shippingCost
              ),
          right,
          y,
          {
            align:
              "right",
          }
        );

        y +=
          7;

        doc.setFont(
          "helvetica",
          "bold"
        );

        doc.setFontSize(
          12
        );

        doc.text(
          "TOTAL",
          140,
          y
        );

        doc.text(
          formatMoney(
            total
          ),
          right,
          y,
          {
            align:
              "right",
          }
        );

        y +=
          10;

        line(
          y
        );

        y +=
          8;

        /* FOOTER */

        doc.setFont(
          "helvetica",
          "normal"
        );

        doc.setFontSize(
          8
        );

        doc.setTextColor(
          100
        );

        const note =
          order.paymentStatus ===
          "Verified"
            ? "Payment verified. Thank you for shopping with Nirjara Beauty."
            : "Payment proof received. Your payment is pending verification.";

        doc.text(
          doc.splitTextToSize(
            note,
            right -
              left
          ),
          left,
          y
        );

        y +=
          10;

        doc.text(
          `Items: ${totalQuantity}`,
          left,
          y
        );

        doc.text(
          `Payment method: ${order.paymentMethod || "QR Payment"}`,
          right,
          y,
          {
            align:
              "right",
          }
        );

        doc.save(
          `${order.orderNumber || "nirjara-order"}-receipt.pdf`
        );
      } catch (
        error
      ) {
        console.error(
          "DOWNLOAD BILL ERROR:",
          error
        );

        alert(
          "Could not download the bill. Please try again."
        );
      } finally {
        setDownloading(
          false
        );
      }
    };

  /* ==========================================================
     UI
  ========================================================== */

  return (
    <section
      className="
        min-h-screen
        bg-[#FFF5F8]
        px-4
        pb-16
        pt-24

        sm:px-6
        sm:pt-28
      "
    >
      <div
        className="
          mx-auto
          max-w-2xl
        "
      >
        {/* SUCCESS NOTE */}

        <div
          className="
            mb-5
            text-center
          "
        >
          <div
            className="
              mx-auto
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              bg-[#E75480]
              text-lg
              text-white
            "
          >
            ✓
          </div>

          <h1
            className="
              mt-3
              font-serif
              text-2xl
              text-[#3A2A2F]

              sm:text-3xl
            "
          >
            Order placed successfully
          </h1>

          <p
            className="
              mt-1
              text-xs
              leading-5
              text-[#8A6F78]
            "
          >
            Payment proof received and waiting
            for verification.
          </p>
        </div>

        {/* RECEIPT */}

        <div
          id="order-receipt"
          className="
            overflow-hidden
            rounded-[20px]
            border
            border-[#E75480]/10
            bg-white
            shadow-sm
          "
        >
          {/* RECEIPT HEADER */}

          <div
            className="
              border-b
              border-dashed
              border-[#E75480]/20
              px-5
              py-5

              sm:px-7
            "
          >
            <div
              className="
                flex
                flex-col
                gap-4

                sm:flex-row
                sm:items-start
                sm:justify-between
              "
            >
              <div>
                <p
                  className="
                    font-serif
                    text-xl
                    text-[#3A2A2F]
                  "
                >
                  Nirjara Beauty
                </p>

                <p
                  className="
                    mt-1
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[2.5px]
                    text-[#E75480]
                  "
                >
                  Order Receipt
                </p>
              </div>

              <div
                className="
                  text-left

                  sm:text-right
                "
              >
                <p
                  className="
                    text-[10px]
                    uppercase
                    tracking-[1.5px]
                    text-[#8A6F78]
                  "
                >
                  Order Number
                </p>

                <p
                  className="
                    mt-1
                    font-medium
                    text-[#3A2A2F]
                  "
                >
                  {
                    order.orderNumber
                  }
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    text-[#8A6F78]
                  "
                >
                  {orderDate}
                </p>
              </div>
            </div>

            <div
              className="
                mt-4
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-amber-50
                px-3
                py-1.5
                text-[10px]
                font-semibold
                text-amber-700
              "
            >
              <span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-amber-500
                "
              />

              {order.paymentStatus ||
                "Pending Verification"}
            </div>
          </div>

          {/* BILL TO */}

          <div
            className="
              border-b
              border-dashed
              border-[#E75480]/20
              px-5
              py-4

              sm:px-7
            "
          >
            <p
              className="
                text-[9px]
                font-semibold
                uppercase
                tracking-[2px]
                text-[#8A6F78]
              "
            >
              Bill To
            </p>

            <div
              className="
                mt-2
                grid
                gap-x-8
                gap-y-1
                text-sm
                text-[#3A2A2F]

                sm:grid-cols-2
              "
            >
              <p>
                {
                  order.customerName
                }
              </p>

              <p>
                {
                  order.phone
                }
              </p>

              <p
                className="
                  break-all
                "
              >
                {
                  order.email
                }
              </p>

              <p>
                {
                  order.shipping?.label ||
                  "Delivery"
                }
              </p>
            </div>

            <p
              className="
                mt-2
                text-xs
                leading-5
                text-[#8A6F78]
              "
            >
              {
                order.address
              }
            </p>
          </div>

          {/* ITEMS */}

          <div
            className="
              px-5
              py-4

              sm:px-7
            "
          >
            <div
              className="
                grid
                grid-cols-[1fr_50px_90px]
                gap-3
                border-b
                border-[#E75480]/10
                pb-2
                text-[9px]
                font-semibold
                uppercase
                tracking-[1.5px]
                text-[#8A6F78]

                sm:grid-cols-[1fr_60px_110px]
              "
            >
              <span>
                Item
              </span>

              <span
                className="
                  text-center
                "
              >
                Qty
              </span>

              <span
                className="
                  text-right
                "
              >
                Amount
              </span>
            </div>

            <div
              className="
                divide-y
                divide-[#E75480]/10
              "
            >
              {order.items.map(
                (
                  item,
                  index
                ) => (
                  <div
                    key={`${item.name}-${index}`}
                    className="
                      grid
                      grid-cols-[1fr_50px_90px]
                      gap-3
                      py-3
                      text-sm

                      sm:grid-cols-[1fr_60px_110px]
                    "
                  >
                    <div
                      className="
                        min-w-0
                      "
                    >
                      <p
                        className="
                          font-medium
                          text-[#3A2A2F]
                        "
                      >
                        {
                          item.name
                        }
                      </p>

                      <p
                        className="
                          mt-0.5
                          text-[11px]
                          text-[#8A6F78]
                        "
                      >
                        {formatMoney(
                          item.price
                        )}{" "}
                        each
                      </p>
                    </div>

                    <p
                      className="
                        text-center
                        text-[#8A6F78]
                      "
                    >
                      {
                        item.quantity
                      }
                    </p>

                    <p
                      className="
                        text-right
                        font-medium
                        text-[#3A2A2F]
                      "
                    >
                      {formatMoney(
                        Number(
                          item.price
                        ) *
                          Number(
                            item.quantity
                          )
                      )}
                    </p>
                  </div>
                )
              )}
            </div>

            {/* TOTALS */}

            <div
              className="
                ml-auto
                mt-3
                max-w-[280px]
                border-t
                border-dashed
                border-[#E75480]/20
                pt-3
              "
            >
              <ReceiptRow
                label="Subtotal"
                value={
                  formatMoney(
                    subtotal
                  )
                }
              />

              <ReceiptRow
                label="Shipping"
                value={
                  shippingCost ===
                  0
                    ? "FREE"
                    : formatMoney(
                        shippingCost
                      )
                }
              />

              <div
                className="
                  mt-3
                  flex
                  items-center
                  justify-between
                  border-t
                  border-[#E75480]/10
                  pt-3
                "
              >
                <span
                  className="
                    text-sm
                    font-semibold
                    text-[#3A2A2F]
                  "
                >
                  Total
                </span>

                <span
                  className="
                    font-serif
                    text-xl
                    text-[#E75480]
                  "
                >
                  {formatMoney(
                    total
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* FOOT NOTE */}

          <div
            className="
              border-t
              border-dashed
              border-[#E75480]/20
              bg-[#FFF8FA]
              px-5
              py-4
              text-center

              sm:px-7
            "
          >
            <p
              className="
                text-xs
                leading-5
                text-[#8A6F78]
              "
            >
              Your payment proof has been received.
              We will confirm this order after
              payment verification.
            </p>

            <p
              className="
                mt-1
                text-[10px]
                text-[#8A6F78]
              "
            >
              Payment method:{" "}
              <span
                className="
                  font-medium
                  text-[#3A2A2F]
                "
              >
                {order.paymentMethod ||
                  "QR Payment"}
              </span>
            </p>
          </div>
        </div>

        {/* ACTIONS */}

        <div
          className="
            mt-5
            flex
            flex-col
            gap-3

            sm:flex-row
            sm:justify-center
          "
        >
          <button
            type="button"
            disabled={
              downloading
            }
            onClick={
              downloadBill
            }
            className="
              rounded-full
              bg-[#E75480]
              px-7
              py-3
              text-xs
              font-semibold
              uppercase
              tracking-[1.5px]
              text-white
              transition

              hover:bg-[#D94873]

              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {downloading
              ? "Preparing Bill..."
              : "Download Bill"}
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/products"
              )
            }
            className="
              rounded-full
              border
              border-[#E75480]/25
              bg-white
              px-7
              py-3
              text-xs
              font-semibold
              uppercase
              tracking-[1.5px]
              text-[#E75480]
              transition

              hover:bg-[#FFF0F5]
            "
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   RECEIPT ROW
============================================================ */

function ReceiptRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      className="
        mb-2
        flex
        items-center
        justify-between
        gap-4
        text-sm
      "
    >
      <span
        className="
          text-[#8A6F78]
        "
      >
        {label}
      </span>

      <span
        className="
          font-medium
          text-[#3A2A2F]
        "
      >
        {value}
      </span>
    </div>
  );
}
