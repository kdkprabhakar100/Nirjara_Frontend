import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Item = {
  _id: string;
  title: string;
  image: string;
};

export default function Gallery() {
  const [items, setItems] = useState<Item[]>([]);
  const [index, setIndex] = useState(0);

const fetchGallery = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/gallery`);
    const data = await res.json();
    setItems(data);
  } catch (error) {
    console.error("Gallery fetch error:", error);
  }
};

  useEffect(() => {
    fetchGallery();
  }, []);

  if (items.length === 0) {
    return (
      <section className="bg-[#FFF5F8] py-20 text-center text-[#8A6F78]">
        No gallery images yet
      </section>
    );
  }

  const next = () => {
    setIndex((prev) => (prev + 1) % items.length);
  };

  const prev = () => {
    setIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const current = items[index];

  return (
    <section className="bg-[#FFF5F8] px-6 py-24 md:px-12">
      <div className="mb-16 text-center">
        <p className="text-xs uppercase tracking-[4px] text-[#E75480]">
          Our Gallery
        </p>

        <h2 className="mt-4 font-serif text-5xl text-[#3A2A2F]">
          Beauty <span className="italic text-[#E75480]">Moments</span>
        </h2>
      </div>

      <div className="mx-auto max-w-5xl">
        <motion.div
          key={current._id}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="overflow-hidden rounded-[2rem] bg-white shadow-xl"
        >
          <div className="relative h-[500px]">
            <img
              src={current.image}
              alt={current.title}
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

            <div className="absolute bottom-8 left-8 text-white">
              <h3 className="font-serif text-4xl">{current.title}</h3>
            </div>

            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white px-4 py-2 text-[#E75480]"
            >
              ‹
            </button>

            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white px-4 py-2 text-[#E75480]"
            >
              ›
            </button>
          </div>
        </motion.div>

        {/* dots */}
        <div className="mt-6 flex justify-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full ${
                i === index
                  ? "w-8 bg-[#E75480]"
                  : "w-2 bg-[#E75480]/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}