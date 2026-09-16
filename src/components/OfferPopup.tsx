import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Popup = {
  title: string;

  subtitle: string;

  image: string;

  buttonText: string;

  buttonLink: string;

  delay: number;
};

export default function OfferPopup() {
  const [popup, setPopup] =
    useState<Popup | null>(null);

  const [open, setOpen] = useState(false);

  // FETCH ACTIVE POPUP
  const fetchPopup = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/popup/active`
      );

      const data = await res.json();

      if (!data) return;

      setPopup(data);

      // SHOW AFTER DELAY
      setTimeout(() => {
        setOpen(true);
      }, data.delay || 3000);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPopup();
  }, []);

  if (!popup) return null;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">

          {/* OVERLAY CLOSE */}
          <div
            className="absolute inset-0"
            onClick={() => setOpen(false)}
          />

          {/* POPUP */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
              y: 40,
            }}

            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}

            exit={{
              opacity: 0,
              scale: 0.9,
            }}

            transition={{
              duration: 0.35,
            }}

            className="
              relative
              z-10
              w-full
              max-w-4xl
              overflow-hidden
              rounded-[40px]
              bg-white
              shadow-2xl
            "
          >

            {/* CLOSE BUTTON */}
            <button
              onClick={() => setOpen(false)}
              className="
                absolute
                right-5
                top-5
                z-20
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-white/90
                text-xl
                text-[#E75480]
                shadow-md
              "
            >
              ×
            </button>

            <div className="grid md:grid-cols-2">

              {/* IMAGE */}
              <div className="h-[300px] md:h-full">
                <img
                  src={popup.image}
                  alt={popup.title}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* CONTENT */}
              <div className="flex flex-col justify-center p-8 md:p-12">

                <p className="text-xs uppercase tracking-[5px] text-[#E75480]">
                  Limited Time Offer
                </p>

                <h2 className="mt-4 font-serif text-4xl leading-tight text-[#3A2A2F] md:text-5xl">
                  {popup.title}
                </h2>

                <p className="mt-6 leading-8 text-[#8A6F78]">
                  {popup.subtitle}
                </p>

                <a
                  href={popup.buttonLink}
                  className="
                    mt-8
                    inline-flex
                    w-fit
                    rounded-full
                    bg-[#E75480]
                    px-8
                    py-4
                    text-sm
                    uppercase
                    tracking-[3px]
                    text-white
                    transition
                    hover:bg-[#d63c6d]
                  "
                >
                  {popup.buttonText}
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}