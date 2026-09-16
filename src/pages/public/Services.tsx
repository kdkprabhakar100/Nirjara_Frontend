import { useEffect, useState } from "react";
import ServiceCard from "../../components/ServiceCard";

type Service = {
  _id: string;
  icon: string;
  title: string;
  description: string;
  price: string;
  category: string;
  image?: string;
};

const categories = ["All", "Hair", "Skin", "Bridal", "Nails", "Spa", "Academy"];

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");

  const fetchServices = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/services`);
    const data = await res.json();
    setServices(data);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const filteredServices =
    activeCategory === "All"
      ? services
      : services.filter(
          (service) => service.category === activeCategory
        );

  return (
    <main className="min-h-screen bg-[#FFF5F8] px-6 pb-24 pt-36 md:px-12">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[4px] text-[#E75480]">
          Our Services
        </p>

        <h1 className="mt-4 font-serif text-5xl text-[#3A2A2F]">
          Beauty <span className="italic text-[#E75480]">Services</span>
        </h1>

        <div className="mx-auto mt-6 h-[1px] w-20 bg-[#E75480]/40" />
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-5 py-2 text-xs uppercase tracking-[2px] transition ${
              activeCategory === cat
                ? "bg-[#E75480] text-white"
                : "bg-white text-[#E75480]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mx-auto mt-16 grid max-w-6xl gap-8 md:grid-cols-3">
        {filteredServices.map((service) => (
          <ServiceCard key={service._id} {...service} />
        ))}
      </div>
    </main>
  );
}