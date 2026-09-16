import { motion } from "framer-motion";

type ServiceCardProps = {
  icon: string;
  title: string;
  description: string;
  price: string;
  image?: string;
};

export default function ServiceCard({
  icon,
  title,
  description,
  price,
  image,
}: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className="group relative cursor-pointer overflow-hidden rounded-3xl border border-[#E75480]/10 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#E75480]/30 hover:shadow-xl"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={image || "/images/salon.png"}
          alt={title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />

        <div className="absolute inset-0 flex items-center justify-center bg-[#E75480]/70 opacity-0 transition duration-300 group-hover:opacity-100">
          <button className="rounded-full bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[2px] text-[#E75480] shadow-md">
            Book Now
          </button>
        </div>
      </div>

      <div className="p-8">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#FCE7EF] text-3xl text-[#E75480]">
          {icon}
        </div>

        <h3 className="font-serif text-2xl text-[#3A2A2F]">{title}</h3>

        <p className="mt-3 text-sm leading-7 text-[#8A6F78]">{description}</p>

        <p className="mt-5 text-sm font-medium tracking-wide text-[#E75480]">
          {price}
        </p>
      </div>
    </motion.div>
  );
}