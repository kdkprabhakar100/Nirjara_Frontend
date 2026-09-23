import { useEffect, useState } from "react";
import ServiceCard from "../../components/ServiceCard";

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

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);

  const [activeCategory, setActiveCategory] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD SERVICES + CATEGORIES
  // ==========================================

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [servicesResponse, categoriesResponse] =
          await Promise.all([
            fetch(
              `${import.meta.env.VITE_API_URL}/api/services`
            ),

            fetch(
              `${
                import.meta.env.VITE_API_URL
              }/api/service-categories`
            ),
          ]);

        if (!servicesResponse.ok) {
          throw new Error("Failed to load services.");
        }

        if (!categoriesResponse.ok) {
          throw new Error(
            "Failed to load service categories."
          );
        }

        const servicesData = await servicesResponse.json();
        const categoriesData =
          await categoriesResponse.json();

        // Support both:
        // [ ... ]
        //
        // and:
        // { services: [...] }
        // { categories: [...] }

        const serviceList = Array.isArray(servicesData)
          ? servicesData
          : servicesData.services || [];

        const categoryList = Array.isArray(categoriesData)
          ? categoriesData
          : categoriesData.categories || [];

        setServices(serviceList);
        setCategories(categoryList);
      } catch (err) {
        console.error("Services page error:", err);

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

  // ==========================================
  // GET SERVICE CATEGORY ID
  // ==========================================

  const getCategoryId = (service: Service) => {
    if (!service.category) {
      return "";
    }

    // If backend populated category:
    //
    // category: {
    //   _id: "...",
    //   name: "Hair"
    // }

    if (typeof service.category === "object") {
      return service.category._id;
    }

    // If backend returned only ObjectId:
    //
    // category: "68abc..."
    return service.category;
  };

  // ==========================================
  // FILTER SERVICES
  // ==========================================

  const filteredServices =
    activeCategory === "all"
      ? services
      : services.filter(
          (service) =>
            getCategoryId(service) === activeCategory
        );

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FFF5F8] px-6 pb-24 pt-36 md:px-12">
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-sm uppercase tracking-[3px] text-[#E75480]">
            Loading services...
          </p>
        </div>
      </main>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <main className="min-h-screen bg-[#FFF5F8] px-6 pb-24 pt-36 md:px-12">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <h2 className="font-serif text-3xl text-[#3A2A2F]">
              Unable to load services
            </h2>

            <p className="mt-3 text-sm text-[#8A6F78]">
              {error}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFF5F8] px-4 pb-24 pt-32 sm:px-6 md:px-8 lg:px-12 lg:pt-36">
      {/* ===================================== */}
      {/* PAGE HEADER                           */}
      {/* ===================================== */}

      <div className="mx-auto max-w-7xl text-center">
        <p className="text-[11px] uppercase tracking-[4px] text-[#E75480] sm:text-xs">
          Our Services
        </p>

        <h1 className="mt-4 font-serif text-4xl text-[#3A2A2F] sm:text-5xl lg:text-6xl">
          Beauty{" "}
          <span className="italic text-[#E75480]">
            Services
          </span>
        </h1>

        <div className="mx-auto mt-6 h-px w-20 bg-[#E75480]/40" />
      </div>

      {/* ===================================== */}
      {/* DYNAMIC CATEGORY FILTER               */}
      {/* ===================================== */}

      <div className="mx-auto mt-10 max-w-7xl">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {/* ALL */}

          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={`
              rounded-full
              border
              px-5
              py-2.5
              text-[10px]
              font-medium
              uppercase
              tracking-[2px]
              transition-all
              duration-300
              sm:px-6
              sm:text-xs
              ${
                activeCategory === "all"
                  ? "border-[#E75480] bg-[#E75480] text-white shadow-sm"
                  : "border-[#E75480]/10 bg-white text-[#E75480] hover:border-[#E75480] hover:bg-[#FCE7EF]"
              }
            `}
          >
            All
          </button>

          {/* DYNAMIC CATEGORIES */}

          {categories.map((category) => (
            <button
              type="button"
              key={category._id}
              onClick={() =>
                setActiveCategory(category._id)
              }
              className={`
                rounded-full
                border
                px-5
                py-2.5
                text-[10px]
                font-medium
                uppercase
                tracking-[2px]
                transition-all
                duration-300
                sm:px-6
                sm:text-xs
                ${
                  activeCategory === category._id
                    ? "border-[#E75480] bg-[#E75480] text-white shadow-sm"
                    : "border-[#E75480]/10 bg-white text-[#E75480] hover:border-[#E75480] hover:bg-[#FCE7EF]"
                }
              `}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* ===================================== */}
      {/* SERVICES                              */}
      {/* ===================================== */}

      <section className="mx-auto mt-12 max-w-7xl lg:mt-16">
        {filteredServices.length > 0 ? (
          <div
            className="
              grid
              grid-cols-1
              gap-6
              sm:grid-cols-2
              lg:grid-cols-3
              lg:gap-8
            "
          >
            {filteredServices.map((service) => (
              <ServiceCard
                key={service._id}
                title={service.title}
                description={service.description}
                price={service.price}
                image={service.image}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl bg-white px-6 py-20 text-center shadow-sm">
            <p className="text-xs uppercase tracking-[3px] text-[#E75480]">
              Nirjara Beauty
            </p>

            <h2 className="mt-4 font-serif text-3xl text-[#3A2A2F]">
              No services found
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#8A6F78]">
              There are currently no services available
              under this category.
            </p>

            {activeCategory !== "all" && (
              <button
                type="button"
                onClick={() =>
                  setActiveCategory("all")
                }
                className="mt-6 rounded-full bg-[#E75480] px-7 py-3 text-xs uppercase tracking-[2px] text-white transition hover:bg-[#d94873]"
              >
                View All Services
              </button>
            )}
          </div>
        )}
      </section>
    </main>
  );
}