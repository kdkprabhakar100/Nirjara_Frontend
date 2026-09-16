import { motion } from "framer-motion";

export default function AnimationDemo() {
  return (
    <div className="mb-12 grid gap-6 md:grid-cols-3">
      {[1, 2, 3].map((item, index) => (
        <motion.div
          key={item}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: index * 0.15,
          }}
          viewport={{ once: true }}
          whileHover={{ y: -10, scale: 1.02 }}
          className="rounded-3xl bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-bold text-[#E75480]">
            Animation {item}
          </h2>

          <p className="mt-3 text-sm text-[#8A6F78]">
            Fade up and hover animation demo.
          </p>
        </motion.div>
      ))}
    </div>
  );
}