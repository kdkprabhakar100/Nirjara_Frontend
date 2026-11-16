import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowLeft,
  CalendarDays,
  Check,
  MessageCircle,
  Sparkles,
} from "lucide-react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router";

import SEO from "../../../components/SEO";

/* =========================================================
   TYPES
========================================================= */

type ServiceCategory = {
  _id: string;
  name: string;
};

type Service = {
  _id: string;

  slug: string;

  title: string;

  description: string;

  startingPrice?: number;

  maxPrice?: number | null;

  price?: string | number;

  image?: string;

  available?: boolean;

  category:
    | ServiceCategory
    | string
    | null;
};

/* =========================================================
   PRICE HELPERS
========================================================= */

function getStartingPrice(
  service: Service
) {
  if (
    typeof service.startingPrice ===
      "number" &&
    Number.isFinite(
      service.startingPrice
    )
  ) {
    return service.startingPrice;
  }

  if (
    service.price ===
      undefined ||
    service.price === null
  ) {
    return 0;
  }

  const cleaned =
    String(service.price)
      .replace(/,/g, "")
      .replace(
        /[^0-9.]/g,
        ""
      );

  const value =
    Number(cleaned);

  return Number.isFinite(value)
    ? value
    : 0;
}

function formatPrice(
  value: number
) {
  return new Intl.NumberFormat(
    "en-NP",
    {
      maximumFractionDigits:
        0,
    }
  ).format(value);
}

/* =========================================================
   CATEGORY
========================================================= */

function getCategoryName(
  service: Service
) {
  if (!service.category) {
    return "Beauty Service";
  }

  if (
    typeof service.category ===
    "object"
  ) {
    return service.category.name;
  }

  return "Beauty Service";
}

/* =========================================================
   COMPONENT
========================================================= */

export default function ServiceDetail() {
  const { slug } =
    useParams<{
      slug: string;
    }>();

  const navigate =
    useNavigate();

  const [
    service,
    setService,
  ] =
    useState<Service | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState("");

  /* =======================================================
     FETCH
  ======================================================= */

  useEffect(() => {
    if (!slug) {
      setError(
        "Service not found."
      );

      setLoading(false);

      return;
    }

    const controller =
      new AbortController();

    const loadService =
      async () => {
        try {
          setLoading(true);
          setError("");

          const apiUrl =
            import.meta.env
              .VITE_API_URL ||
            "";

          const response =
            await fetch(
              `${apiUrl}/api/services/slug/${encodeURIComponent(
                slug
              )}`,
              {
                signal:
                  controller.signal,
              }
            );

          if (
            response.status ===
            404
          ) {
            throw new Error(
              "Service not found."
            );
          }

          if (!response.ok) {
            throw new Error(
              "Unable to load service."
            );
          }

          const data =
            await response.json();

          const foundService =
            data?.data ??
            data?.service ??
            data;

          if (
            !foundService ||
            !foundService._id
          ) {
            throw new Error(
              "Service not found."
            );
          }

          setService(
            foundService
          );
        } catch (err) {
          if (
            controller.signal
              .aborted
          ) {
            return;
          }

          console.error(
            "Service detail error:",
            err
          );

          setError(
            err instanceof Error
              ? err.message
              : "Unable to load service."
          );
        } finally {
          if (
            !controller.signal
              .aborted
          ) {
            setLoading(false);
          }
        }
      };

    void loadService();

    return () =>
      controller.abort();
  }, [slug]);

  /* =======================================================
     COMPUTED
  ======================================================= */

  const startingPrice =
    useMemo(
      () =>
        service
          ? getStartingPrice(
              service
            )
          : 0,
      [service]
    );

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <main
        className="
          min-h-screen
          bg-[#FFF5F8]
          px-4
          pt-24
        "
      >
        <div
          className="
            flex
            min-h-[280px]
            items-center
            justify-center
          "
        >
          <div
            className="
              h-8
              w-8
              animate-spin
              rounded-full
              border-2
              border-[#E75480]/20
              border-t-[#E75480]
            "
          />
        </div>
      </main>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (
    error ||
    !service
  ) {
    return (
      <main
        className="
          min-h-screen
          bg-[#FFF5F8]
          px-4
          pb-12
          pt-28
        "
      >
        <div
          className="
            mx-auto
            max-w-lg
            rounded-[22px]
            border
            border-[#E75480]/10
            bg-white
            p-7
            text-center
            shadow-[0_14px_35px_rgba(58,42,47,0.05)]
          "
        >
          <p
            className="
              text-[8px]
              font-semibold
              uppercase
              tracking-[3px]
              text-[#E75480]
            "
          >
            Nirjara Beauty
          </p>

          <h1
            className="
              mt-3
              font-serif
              text-3xl
              text-[#3A2A2F]
            "
          >
            Service not found
          </h1>

          <p
            className="
              mt-3
              text-sm
              leading-6
              text-[#8A6F78]
            "
          >
            The service you are looking for may no longer be available.
          </p>

          <Link
            to="/services"
            className="
              mt-6
              inline-flex
              rounded-full
              bg-[#E75480]
              px-6
              py-3
              text-[8px]
              font-semibold
              uppercase
              tracking-[2px]
              text-white
            "
          >
            View Services
          </Link>
        </div>
      </main>
    );
  }

  /* =======================================================
     DATA
  ======================================================= */

  const categoryName =
    getCategoryName(
      service
    );

  const seoDescription =
    service.description
      .replace(
        /\s+/g,
        " "
      )
      .trim()
      .slice(0, 155);

  const bookingUrl =
    `/booking?service=${encodeURIComponent(
      service._id
    )}`;

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <>
      <SEO
        title={`${service.title} | Nirjara Beauty`}
        description={
          seoDescription
        }
        keywords={`${service.title}, ${categoryName}, Nirjara Beauty, beauty salon Kathmandu`}
        canonical={`/services/${service.slug}`}
        image={
          service.image ||
          "/images/nirjara-og.jpg"
        }
        type="website"
      />

      <main
        className="
          min-h-screen
          bg-[#FFF5F8]
          px-3
          pb-6
          pt-[76px]

          sm:px-5
          sm:pt-[84px]

          lg:px-8
          lg:pt-[88px]
        "
      >
        <div
          className="
            mx-auto
            max-w-[1140px]
          "
        >
{/* =========================================================
    BREADCRUMB
========================================================= */}

<div
  className="
    mb-3
    flex
    min-w-0
    items-center
    gap-2

    px-1

    text-[7px]
    font-medium
    uppercase
    tracking-[0.16em]

    text-[#A88993]

    sm:mb-4
    sm:text-[8px]
  "
>
  <Link
    to="/services"
    className="
      shrink-0
      transition-colors
      duration-200

      hover:text-[#E75480]
    "
  >
    Services
  </Link>

  <span
    className="
      text-[#D8BDC6]
    "
  >
    /
  </span>

  <span
    className="
      max-w-[220px]
      truncate

      text-[#C77A95]

      sm:max-w-[320px]

      lg:max-w-[450px]
    "
    title={service.title}
  >
    {service.title}
  </span>
</div>

          {/* =============================================
              MAIN CARD
          ============================================= */}

          <section
            className="
              overflow-hidden
              rounded-[20px]
              border
              border-[#E75480]/10
              bg-white
              shadow-[0_14px_38px_rgba(58,42,47,0.055)]

              sm:rounded-[24px]
            "
          >
            {/* ===========================================
                HERO
            =========================================== */}

            <div
              className="
                grid

                lg:grid-cols-[0.94fr_1.06fr]
              "
            >
              {/* IMAGE */}

              <div
                className="
                  relative
                  h-[205px]
                  overflow-hidden
                  bg-[#FCE7EF]

                  min-[480px]:h-[230px]

                  sm:h-[280px]

                  lg:h-[385px]
                "
              >
                {service.image ? (
                  <img
                    src={
                      service.image
                    }
                    alt={
                      service.title
                    }
                    className="
                      h-full
                      w-full
                      object-cover
                    "
                  />
                ) : (
                  <div
                    className="
                      flex
                      h-full
                      items-center
                      justify-center
                    "
                  >
                    <span
                      className="
                        font-serif
                        text-6xl
                        text-[#E75480]/20
                      "
                    >
                      N
                    </span>
                  </div>
                )}

                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-[#3A2A2F]/10
                    via-transparent
                    to-transparent
                  "
                />
              </div>

              {/* CONTENT */}

              <div
                className="
                  flex
                  flex-col
                  justify-center
                  p-4

                  min-[480px]:p-5

                  sm:p-6

                  lg:p-8
                "
              >
                {/* CATEGORY */}

                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >
                  <span
                    className="
                      h-px
                      w-5
                      bg-[#E75480]
                    "
                  />

                  <p
                    className="
                      text-[6px]
                      font-semibold
                      uppercase
                      tracking-[2.4px]
                      text-[#E75480]

                      sm:text-[7px]
                    "
                  >
                    {categoryName}
                  </p>
                </div>

                {/* TITLE */}

                <h1
                  className="
                    mt-2.5
                    max-w-[13ch]
                    font-serif
                    text-[28px]
                    leading-[1]
                    text-[#3A2A2F]

                    min-[480px]:text-[30px]

                    sm:text-[34px]

                    lg:text-[38px]
                  "
                >
                  {
                    service.title
                  }
                </h1>

                {/* DESCRIPTION */}

                <p
                  className="
                    mt-3
                    max-w-xl
                    text-[11px]
                    leading-[1.75]
                    text-[#8A6F78]

                    sm:text-[13px]
                    sm:leading-6
                  "
                >
                  {
                    service.description
                  }
                </p>

                {/* =======================================
                    PRICE + STATUS
                ======================================= */}

                <div
                  className="
                    mt-3.5
                    grid
                    grid-cols-2
                    gap-2

                    sm:mt-4
                    sm:gap-2.5
                  "
                >
                  {/* PRICE */}

                  {startingPrice >
                    0 && (
                    <div
                      className="
                        min-w-0
                        rounded-[14px]
                        border
                        border-[#E75480]/10
                        bg-[#FFF8FA]
                        px-3
                        py-3

                        sm:rounded-[16px]
                        sm:p-3.5
                      "
                    >
                      <p
                        className="
                          whitespace-nowrap
                          text-[5px]
                          font-semibold
                          uppercase
                          tracking-[1.4px]
                          text-[#A98994]

                          sm:text-[6px]
                          sm:tracking-[1.9px]
                        "
                      >
                        Starting From
                      </p>

                      <p
                        className="
                          mt-1
                          whitespace-nowrap
                          font-serif
                          text-[20px]
                          leading-none
                          text-[#E75480]

                          sm:text-[24px]
                        "
                      >
                        Rs.{" "}
                        {formatPrice(
                          startingPrice
                        )}
                      </p>

                      {typeof service.maxPrice ===
                        "number" &&
                        service.maxPrice >
                          startingPrice && (
                          <p
                            className="
                              mt-1
                              truncate
                              text-[8px]
                              text-[#A98994]
                            "
                          >
                            Up to Rs.{" "}
                            {formatPrice(
                              service.maxPrice
                            )}
                          </p>
                        )}
                    </div>
                  )}

                  {/* AVAILABILITY */}

                  <div
                    className="
                      flex
                      min-w-0
                      items-center
                      gap-2
                      rounded-[14px]
                      border
                      border-[#E75480]/10
                      bg-[#FFF8FA]
                      px-3
                      py-3

                      sm:gap-3
                      sm:rounded-[16px]
                      sm:p-3.5
                    "
                  >
                    <div
                      className="
                        flex
                        h-7
                        w-7
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-white
                        text-[#E75480]
                        shadow-[0_2px_8px_rgba(58,42,47,0.04)]

                        sm:h-8
                        sm:w-8
                      "
                    >
                      <Check
                        size={12}
                      />
                    </div>

                    <div
                      className="
                        min-w-0
                      "
                    >
                      <p
                        className="
                          text-[5px]
                          font-semibold
                          uppercase
                          tracking-[1.3px]
                          text-[#A98994]

                          sm:text-[6px]
                          sm:tracking-[1.9px]
                        "
                      >
                        Availability
                      </p>

                      <p
                        className="
                          mt-0.5
                          text-[9px]
                          font-medium
                          leading-4
                          text-[#3A2A2F]

                          sm:text-[11px]
                        "
                      >
                        {service.available !==
                        false
                          ? "Available"
                          : "Unavailable"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* =======================================
                    ACTIONS
                ======================================= */}

                <div
                  className="
                    mt-3
                    grid
                    grid-cols-2
                    gap-2

                    sm:mt-4
                    sm:gap-2.5
                  "
                >
                  {service.available !==
                  false ? (
                    <Link
                      to={bookingUrl}
                      className="
                        inline-flex
                        min-w-0
                        items-center
                        justify-center
                        gap-1.5
                        rounded-full
                        bg-[#E75480]
                        px-3
                        py-2.5
                        text-center
                        text-[6px]
                        font-semibold
                        uppercase
                        tracking-[1.2px]
                        text-white
                        transition

                        hover:bg-[#D94370]

                        active:scale-[0.98]

                        sm:gap-2
                        sm:px-5
                        sm:py-3
                        sm:text-[8px]
                        sm:tracking-[1.6px]
                      "
                    >
                      <CalendarDays
                        size={11}
                        className="shrink-0"
                      />

                      <span
                        className="
                          truncate
                        "
                      >
                        Book Appointment
                      </span>
                    </Link>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="
                        cursor-not-allowed
                        rounded-full
                        bg-[#F4F1F2]
                        px-3
                        py-2.5
                        text-[6px]
                        font-semibold
                        uppercase
                        tracking-[1.2px]
                        text-[#A98D96]

                        sm:px-5
                        sm:py-3
                        sm:text-[8px]
                      "
                    >
                      Unavailable
                    </button>
                  )}

                  <Link
                    to="/contact"
                    className="
                      inline-flex
                      min-w-0
                      items-center
                      justify-center
                      gap-1.5
                      rounded-full
                      border
                      border-[#E75480]/20
                      bg-white
                      px-3
                      py-2.5
                      text-center
                      text-[6px]
                      font-semibold
                      uppercase
                      tracking-[1.2px]
                      text-[#E75480]
                      transition

                      hover:border-[#E75480]
                      hover:bg-[#FFF5F8]

                      sm:gap-2
                      sm:px-5
                      sm:py-3
                      sm:text-[8px]
                      sm:tracking-[1.6px]
                    "
                  >
                    <MessageCircle
                      size={11}
                      className="shrink-0"
                    />

                    <span
                      className="
                        truncate
                      "
                    >
                      Ask About Service
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            {/* ===========================================
                ABOUT + QUICK DETAILS
            =========================================== */}

            <div
              className="
                border-t
                border-[#E75480]/10
                bg-[#FFFBFC]
                px-4
                py-3.5

                sm:px-6
                sm:py-4

                lg:px-8
              "
            >
              <div
                className="
                  grid
                  gap-4

                  lg:grid-cols-[1fr_auto]
                  lg:items-center
                  lg:gap-8
                "
              >
                {/* ABOUT */}

                <div
                  className="
                    max-w-[640px]
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >
                    <Sparkles
                      size={11}
                      className="
                        text-[#E75480]
                      "
                    />

                    <p
                      className="
                        text-[5px]
                        font-semibold
                        uppercase
                        tracking-[2px]
                        text-[#E75480]

                        sm:text-[6px]
                      "
                    >
                      About The Service
                    </p>
                  </div>

                  <h2
                    className="
                      mt-1.5
                      font-serif
                      text-[19px]
                      leading-tight
                      text-[#3A2A2F]

                      sm:text-[23px]
                    "
                  >
                    Your Nirjara{" "}

                    <span
                      className="
                        italic
                        text-[#E75480]
                      "
                    >
                      experience.
                    </span>
                  </h2>

                  <p
                    className="
                      mt-1.5
                      text-[10px]
                      leading-5
                      text-[#8A6F78]

                      sm:text-[11px]
                      sm:leading-6
                    "
                  >
                    {
                      service.description
                    }
                  </p>
                </div>

                {/* QUICK DETAILS */}

                <div
                  className="
                    grid
                    grid-cols-3
                    overflow-hidden
                    rounded-[16px]
                    border
                    border-[#E75480]/12
                    bg-white
                    shadow-[0_4px_14px_rgba(58,42,47,0.035)]

                    lg:min-w-[360px]
                  "
                >
                  <QuickDetail
                    label="Category"
                    value={
                      categoryName
                    }
                  />

                  <QuickDetail
                    label="Starting Price"
                    value={
                      startingPrice >
                      0
                        ? `Rs. ${formatPrice(
                            startingPrice
                          )}`
                        : "—"
                    }
                  />

                  <QuickDetail
                    label="Status"
                    value={
                      service.available !==
                      false
                        ? "Available"
                        : "Unavailable"
                    }
                    last
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

/* =========================================================
   QUICK DETAIL
========================================================= */

function QuickDetail({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      className={`
        min-w-0
        px-3
        py-3.5

        sm:px-4
        sm:py-4

        ${
          !last
            ? "border-r border-[#E75480]/10"
            : ""
        }
      `}
    >
      <p
        className="
          text-[6px]
          font-semibold
          uppercase
          tracking-[1.5px]
          text-[#A98994]

          sm:text-[7px]

          lg:text-[8px]
        "
      >
        {label}
      </p>

      <p
        className="
          mt-1.5
          truncate
          text-[10px]
          font-semibold
          text-[#3A2A2F]

          sm:text-[11px]

          lg:text-[12px]
        "
        title={value}
      >
        {value}
      </p>
    </div>
  );
}