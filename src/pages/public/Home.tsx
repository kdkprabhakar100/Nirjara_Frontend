import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ServiceCard from "../../components/ServiceCard";
import BranchCard from "../../components/BranchCard";
import Gallery from "../../components/Gallery";

import { branches } from "../../data/branches";

type Service = {
  _id?: string;
  title: string;
  description: string;
  price: string;
  icon?: string;
  image?: string;
};

const stats = [
  { number: "12+", label: "Years of Excellence" },
  { number: "2", label: "Kathmandu Branches" },
  { number: "5K+", label: "Happy Clients" },
  { number: "200+", label: "Certified Graduates" },
];

export default function Home() {
  const navigate = useNavigate();

  const [services, setServices] = useState<Service[]>([]);

  const fetchServices = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/services`
      );

      const data = await res.json();

      setServices(data.slice(0, 6));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <main className="bg-[#FFF5F8] text-[#3A2A2F] overflow-x-hidden">
      
      {/* HERO */}
{/* HERO */}
<section className="relative flex min-h-[100vh] items-center justify-center overflow-hidden bg-[#FFF5F8] px-5 text-center sm:px-6 md:px-12">
  
  <div className="mx-auto max-w-5xl">
    
    <p className="text-xs uppercase tracking-[5px] text-[#E75480]">
      Kathmandu&apos;s Premier Beauty Destination
    </p>

    <h1 className="mt-6 font-serif text-6xl leading-none md:text-8xl">
      Nirjara <br />

      <span className="italic text-[#E75480]">
        Beauty
      </span>
    </h1>

    <p className="mx-auto mt-8 max-w-2xl font-serif text-2xl italic leading-10 text-[#8A6F78]">
      Salon & Academy — Where Beauty Meets Confidence
    </p>

    <button
      onClick={() => navigate("/booking")}
      className="mt-12 rounded-full bg-[#E75480] px-10 py-4 text-sm font-medium uppercase tracking-[2px] text-white shadow-lg transition hover:bg-[#C93D68]"
    >
      Book a Service
    </button>

  </div>
</section>

      {/* STATS */}
      <section className="border-y border-[#E75480]/10 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="border-r border-[#E75480]/10 px-6 py-10 text-center last:border-r-0"
            >
              <h2 className="font-serif text-4xl text-[#E75480]">
                {stat.number}
              </h2>

              <p className="mt-2 text-xs uppercase tracking-[2px] text-[#8A6F78]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-[#FFF5F8] px-6 py-24 md:px-12">
        <div className="text-center">
          
          <p className="text-xs uppercase tracking-[4px] text-[#E75480]">
            Our Services
          </p>

          <h2 className="mt-4 font-serif text-5xl text-[#3A2A2F]">
            The Art of{" "}
            <span className="italic text-[#E75480]">
              Beauty
            </span>
          </h2>

          <div className="mx-auto mt-6 h-[1px] w-20 bg-[#E75480]/40"></div>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <ServiceCard
              key={service._id || index}
              title={service.title}
              description={service.description}
              price={service.price}
              icon={service.icon || "✦"}
              image={service.image || ""}
            />
          ))}
        </div>
      </section>

      {/* GALLERY */}
      <Gallery />

      {/* BRANCHES */}
      <section className="bg-white px-6 py-24 md:px-12">
        <div className="text-center">
          
          <p className="text-xs uppercase tracking-[4px] text-[#E75480]">
            Our Branches
          </p>

          <h2 className="mt-4 font-serif text-5xl text-[#3A2A2F]">
            Visit{" "}
            <span className="italic text-[#E75480]">
              Nirjara
            </span>
          </h2>

          <div className="mx-auto mt-6 h-[1px] w-20 bg-[#E75480]/40"></div>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-2">
          {branches.map((branch, index) => (
            <BranchCard
              key={index}
              {...branch}
            />
          ))}
        </div>
      </section>
    </main>
  );
}