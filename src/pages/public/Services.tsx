import {
  useEffect,
  useMemo,
  useState,
} from "react";

import ServiceCard from "../../components/ServiceCard";
import SEO from "../../components/SEO";

/* =========================================================
   TYPES
========================================================= */

type ServiceCategory = {
  _id: string;
  name: string;
  description?: string;
};

type Service = {
  _id: string;
  title: string;
  description: string;
  price: string;
  image?: string;

  category:
    | {
        _id: string;
        name: string;
      }
    | string
    | null;
};

/* =========================================================
   SEO
========================================================= */

const SERVICES_SEO = {
  title:
    "Beauty Salon Services in Kathmandu | Nirjara Beauty",

  description:
    "Explore professional beauty services at Nirjara Beauty in Kathmandu, including hair, makeup, skincare, nails and other salon treatments.",

  keywords:
    "beauty services Kathmandu, salon services Kathmandu, hair salon Kathmandu, makeup Kathmandu, skincare Kathmandu, nail salon Kathmandu, Nirjara Beauty services",

  canonical: "/services",

  image: "/images/nirjara-og.jpg",

  type: "website",
};

/* =========================================================
   GET RESPONSIVE SERVICES PER PAGE

   Mobile:
   2 columns × 4 rows = 8

   Tablet / Laptop:
   3 columns × 3 rows = 9

   Large desktop:
   4 columns × 2 rows = 8
========================================================= */

const getServicesPerPage = () => {
  if (typeof window === "undefined") {
    return 8;
  }

  if (window.innerWidth >= 1280) {
    return 8;
  }

  if (window.innerWidth >= 768) {
    return 9;
  }

  return 8;
};

/* =========================================================
   COMPONENT
========================================================= */

export default function Services() {
  /* =======================================================
     STATE
  ======================================================= */

  const [services, setServices] =
    useState<Service[]>([]);

  const [categories, setCategories] =
    useState<ServiceCategory[]>([]);

  const [activeCategory, setActiveCategory] =
    useState("all");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* PAGINATION */

  const [currentPage, setCurrentPage] =
    useState(1);

  const [
    servicesPerPage,
    setServicesPerPage,
  ] = useState(getServicesPerPage);

  /* =======================================================
     LOAD SERVICES + CATEGORIES
  ======================================================= */

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        setError("");

        const [
          servicesResponse,
          categoriesResponse,
        ] = await Promise.all([
          fetch(
            `${
              import.meta.env.VITE_API_URL
            }/api/services`
          ),

          fetch(
            `${
              import.meta.env.VITE_API_URL
            }/api/service-categories`
          ),
        ]);

        if (!servicesResponse.ok) {
          throw new Error(
            "Failed to load services."
          );
        }

        if (!categoriesResponse.ok) {
          throw new Error(
            "Failed to load service categories."
          );
        }

        const servicesData =
          await servicesResponse.json();

        const categoriesData =
          await categoriesResponse.json();

        /* ===============================================
           SUPPORT MULTIPLE API RESPONSE FORMATS
        =============================================== */

        const serviceList = Array.isArray(
          servicesData
        )
          ? servicesData
          : Array.isArray(
                servicesData?.services
              )
            ? servicesData.services
            : Array.isArray(
                  servicesData?.data
                )
              ? servicesData.data
              : [];

        const categoryList =
          Array.isArray(categoriesData)
            ? categoriesData
            : Array.isArray(
                  categoriesData?.categories
                )
              ? categoriesData.categories
              : Array.isArray(
                    categoriesData?.data
                  )
                ? categoriesData.data
                : [];

        setServices(serviceList);

        setCategories(categoryList);
      } catch (err) {
        console.error(
          "Services page error:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  /* =======================================================
     RESPONSIVE PAGINATION

     Update amount of services shown when
     crossing breakpoints.
  ======================================================= */

  useEffect(() => {
    const handleResize = () => {
      const newServicesPerPage =
        getServicesPerPage();

      setServicesPerPage(
        (currentValue) => {
          if (
            currentValue ===
            newServicesPerPage
          ) {
            return currentValue;
          }

          return newServicesPerPage;
        }
      );
    };

    handleResize();

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, []);

  /* =======================================================
     GET SERVICE CATEGORY ID
  ======================================================= */

  const getCategoryId = (
    service: Service
  ) => {
    if (!service.category) {
      return "";
    }

    /*
      Populated category:

      category: {
        _id: "...",
        name: "Hair"
      }
    */

    if (
      typeof service.category === "object"
    ) {
      return service.category._id;
    }

    /*
      ObjectId only:

      category: "68abc..."
    */

    return service.category;
  };

  /* =======================================================
     FILTER SERVICES
  ======================================================= */

  const filteredServices = useMemo(() => {
    if (activeCategory === "all") {
      return services;
    }

    return services.filter(
      (service) =>
        getCategoryId(service) ===
        activeCategory
    );
  }, [services, activeCategory]);

  /* =======================================================
     PAGINATION
  ======================================================= */

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredServices.length /
        servicesPerPage
    )
  );

  const paginatedServices =
    useMemo(() => {
      const start =
        (currentPage - 1) *
        servicesPerPage;

      const end =
        start + servicesPerPage;

      return filteredServices.slice(
        start,
        end
      );
    }, [
      filteredServices,
      currentPage,
      servicesPerPage,
    ]);

  /* =======================================================
     RESET PAGE WHEN CATEGORY CHANGES
  ======================================================= */

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  /* =======================================================
     KEEP PAGE VALID AFTER RESIZE / DATA CHANGE
  ======================================================= */

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  /* =======================================================
     CHANGE PAGE
  ======================================================= */

  const changePage = (
    page: number
  ) => {
    if (
      page < 1 ||
      page > totalPages ||
      page === currentPage
    ) {
      return;
    }

    setCurrentPage(page);

    window.setTimeout(() => {
      document
        .getElementById(
          "services-grid"
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  };

  /* =======================================================
     PAGE NUMBERS

     Avoid showing dozens of buttons if
     there are many pages.
  ======================================================= */

  const visiblePages = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from(
        { length: totalPages },
        (_, index) => index + 1
      );
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5];
    }

    if (
      currentPage >=
      totalPages - 2
    ) {
      return [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
    ];
  }, [currentPage, totalPages]);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <main
        className="
          min-h-screen
          bg-[#FFF5F8]
          px-6
          pb-24
          pt-36
          md:px-12
        "
      >
        <div
          className="
            flex
            min-h-[400px]
            items-center
            justify-center
          "
        >
          <div className="text-center">
            <div
              className="
                mx-auto
                h-9
                w-9
                animate-spin
                rounded-full
                border-2
                border-[#E75480]/20
                border-t-[#E75480]
              "
            />

            <p
              className="
                mt-5
                text-sm
                uppercase
                tracking-[3px]
                text-[#E75480]
              "
            >
              Loading services...
            </p>
          </div>
        </div>
      </main>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error) {
    return (
      <main
        className="
          min-h-screen
          bg-[#FFF5F8]
          px-6
          pb-24
          pt-36
          md:px-12
        "
      >
        <div
          className="
            flex
            min-h-[400px]
            items-center
            justify-center
          "
        >
          <div className="text-center">
            <h2
              className="
                font-serif
                text-3xl
                text-[#3A2A2F]
              "
            >
              Unable to load services
            </h2>

            <p
              className="
                mt-3
                text-sm
                text-[#8A6F78]
              "
            >
              {error}
            </p>
          </div>
        </div>
      </main>
    );
  }

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <>
      {/* ===================================================
          SEO
      =================================================== */}

      <SEO
        title={SERVICES_SEO.title}
        description={
          SERVICES_SEO.description
        }
        keywords={
          SERVICES_SEO.keywords
        }
        canonical={
          SERVICES_SEO.canonical
        }
        image={SERVICES_SEO.image}
        type="website"
      />

      <main
        className="
          min-h-screen
          bg-[#FFF5F8]

          px-4
          pb-24
          pt-32

          sm:px-6

          md:px-8

          lg:px-12
          lg:pt-36
        "
      >
        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div
          className="
            mx-auto
            max-w-7xl
            text-center
          "
        >
          <p
            className="
              text-[11px]
              uppercase
              tracking-[4px]
              text-[#E75480]

              sm:text-xs
            "
          >
            Our Services
          </p>

          <h1
            className="
              mt-4
              font-serif
              text-4xl
              text-[#3A2A2F]

              sm:text-5xl

              lg:text-6xl
            "
          >
            Beauty{" "}

            <span
              className="
                italic
                text-[#E75480]
              "
            >
              Services
            </span>
          </h1>

          <div
            className="
              mx-auto
              mt-6
              h-px
              w-20
              bg-[#E75480]/40
            "
          />
        </div>

{/* =================================================
    CATEGORY FILTER
================================================= */}

<div
  className="
    mx-auto
    mt-7
    w-full
    max-w-7xl
    sm:mt-10
  "
>
  <div
    className="
      flex
      w-full
      items-center
      justify-start
      gap-2

      overflow-x-auto
      scroll-smooth

      px-4
      pb-2

      [scrollbar-width:none]
      [&::-webkit-scrollbar]:hidden

      sm:flex-wrap
      sm:justify-center
      sm:gap-3
      sm:overflow-visible
      sm:px-0
      sm:pb-0
    "
  >
    {/* =========================
        ALL
    ========================= */}

    <button
      type="button"
      onClick={() => setActiveCategory("all")}
      className={`
        shrink-0
        whitespace-nowrap

        rounded-full
        border

        px-4
        py-2.5

        text-[8px]
        font-medium
        uppercase
        tracking-[1.5px]

        transition-all
        duration-300

        sm:px-6
        sm:py-3
        sm:text-xs
        sm:tracking-[2px]

        ${
          activeCategory === "all"
            ? `
              border-[#E75480]
              bg-[#E75480]
              text-white
              shadow-sm
            `
            : `
              border-[#E75480]/10
              bg-white
              text-[#E75480]

              hover:border-[#E75480]
              hover:bg-[#FCE7EF]
            `
        }
      `}
    >
      All
    </button>

    {/* =========================
        DYNAMIC CATEGORIES
    ========================= */}

    {categories.map((category) => (
      <button
        type="button"
        key={category._id}
        onClick={() =>
          setActiveCategory(category._id)
        }
        className={`
          shrink-0
          whitespace-nowrap

          rounded-full
          border

          px-4
          py-2.5

          text-[8px]
          font-medium
          uppercase
          tracking-[1.5px]

          transition-all
          duration-300

          sm:px-6
          sm:py-3
          sm:text-xs
          sm:tracking-[2px]

          ${
            activeCategory === category._id
              ? `
                border-[#E75480]
                bg-[#E75480]
                text-white
                shadow-sm
              `
              : `
                border-[#E75480]/10
                bg-white
                text-[#E75480]

                hover:border-[#E75480]
                hover:bg-[#FCE7EF]
              `
          }
        `}
      >
        {category.name}
      </button>
    ))}
  </div>
</div>

        {/* =================================================
            SERVICES
        ================================================= */}

        <section
          id="services-grid"
          className="
            mx-auto
            mt-12
            max-w-7xl
            scroll-mt-28

            lg:mt-16
          "
        >
          {filteredServices.length >
          0 ? (
            <>
              {/* ===========================================
                  RESULT INFO
              =========================================== */}

              <div
                className="
                  mb-5
                  flex
                  items-center
                  justify-between

                  sm:mb-7
                "
              >
                <p
                  className="
                    text-[9px]
                    uppercase
                    tracking-[2px]
                    text-[#A98994]

                    sm:text-[10px]
                    sm:tracking-[3px]
                  "
                >
                  {
                    filteredServices.length
                  }{" "}
                  {filteredServices.length ===
                  1
                    ? "Service"
                    : "Services"}
                </p>

                <p
                  className="
                    text-[9px]
                    uppercase
                    tracking-[2px]
                    text-[#A98994]

                    sm:text-[10px]
                    sm:tracking-[3px]
                  "
                >
                  Page {currentPage} of{" "}
                  {totalPages}
                </p>
              </div>

              {/* ===========================================
                  GRID

                  Mobile:
                  2 × 4 = 8

                  Tablet / laptop:
                  3 × 3 = 9

                  Large:
                  4 × 2 = 8
              =========================================== */}

              <div
                className="
                  grid
                  grid-cols-2
                  gap-3

                  sm:gap-4

                  md:grid-cols-3
                  md:gap-6

                  xl:grid-cols-4
                  xl:gap-7
                "
              >
                {paginatedServices.map(
                  (service) => (
                    <ServiceCard
                      key={service._id}
                      title={
                        service.title
                      }
                      description={
                        service.description
                      }
                      price={
                        service.price
                      }
                      image={
                        service.image
                      }
                    />
                  )
                )}
              </div>

              {/* ===========================================
                  PAGINATION
              =========================================== */}

              {totalPages > 1 && (
                <nav
                  aria-label="Services pagination"
                  className="
                    mt-10
                    flex
                    items-center
                    justify-center
                    gap-2

                    sm:mt-12
                  "
                >
                  {/* PREVIOUS */}

                  <button
                    type="button"
                    aria-label="Previous page"
                    disabled={
                      currentPage === 1
                    }
                    onClick={() =>
                      changePage(
                        currentPage - 1
                      )
                    }
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center

                      rounded-full
                      border
                      border-[#E75480]/20

                      bg-white

                      text-lg
                      text-[#E75480]

                      shadow-sm

                      transition-all
                      duration-300

                      hover:border-[#E75480]
                      hover:bg-[#FFF0F5]

                      disabled:cursor-not-allowed
                      disabled:opacity-30

                      sm:h-11
                      sm:w-11
                    "
                  >
                    ‹
                  </button>

                  {/* PAGE NUMBERS */}

                  {visiblePages.map(
                    (page) => (
                      <button
                        key={page}
                        type="button"
                        aria-label={`Go to page ${page}`}
                        aria-current={
                          currentPage === page
                            ? "page"
                            : undefined
                        }
                        onClick={() =>
                          changePage(page)
                        }
                        className={`
                          flex
                          h-10
                          min-w-10
                          items-center
                          justify-center

                          rounded-full
                          border

                          px-3

                          text-xs
                          font-medium

                          transition-all
                          duration-300

                          sm:h-11
                          sm:min-w-11

                          ${
                            currentPage ===
                            page
                              ? `
                                border-[#E75480]
                                bg-[#E75480]
                                text-white
                                shadow-md
                              `
                              : `
                                border-[#E75480]/15
                                bg-white
                                text-[#E75480]

                                hover:border-[#E75480]
                                hover:bg-[#FFF0F5]
                              `
                          }
                        `}
                      >
                        {page}
                      </button>
                    )
                  )}

                  {/* NEXT */}

                  <button
                    type="button"
                    aria-label="Next page"
                    disabled={
                      currentPage ===
                      totalPages
                    }
                    onClick={() =>
                      changePage(
                        currentPage + 1
                      )
                    }
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center

                      rounded-full
                      border
                      border-[#E75480]/20

                      bg-white

                      text-lg
                      text-[#E75480]

                      shadow-sm

                      transition-all
                      duration-300

                      hover:border-[#E75480]
                      hover:bg-[#FFF0F5]

                      disabled:cursor-not-allowed
                      disabled:opacity-30

                      sm:h-11
                      sm:w-11
                    "
                  >
                    ›
                  </button>
                </nav>
              )}
            </>
          ) : (
            /* =============================================
               EMPTY CATEGORY
            ============================================= */

            <div
              className="
                rounded-3xl
                bg-white
                px-6
                py-20
                text-center
                shadow-sm
              "
            >
              <p
                className="
                  text-xs
                  uppercase
                  tracking-[3px]
                  text-[#E75480]
                "
              >
                Nirjara Beauty
              </p>

              <h2
                className="
                  mt-4
                  font-serif
                  text-3xl
                  text-[#3A2A2F]
                "
              >
                No services found
              </h2>

              <p
                className="
                  mx-auto
                  mt-3
                  max-w-md
                  text-sm
                  leading-7
                  text-[#8A6F78]
                "
              >
                There are currently no
                services available under
                this category.
              </p>

              {activeCategory !==
                "all" && (
                <button
                  type="button"
                  onClick={() =>
                    setActiveCategory(
                      "all"
                    )
                  }
                  className="
                    mt-6
                    rounded-full
                    bg-[#E75480]
                    px-7
                    py-3
                    text-xs
                    uppercase
                    tracking-[2px]
                    text-white
                    transition
                    hover:bg-[#D94873]
                  "
                >
                  View All Services
                </button>
              )}
            </div>
          )}
        </section>
      </main>
    </>
  );
}