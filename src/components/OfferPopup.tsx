
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
  const [popup, setPopup] = useState<Popup | null>(null);
  const [open, setOpen] = useState(false);

  /* =========================================
     FETCH ACTIVE POPUP
     Browser only — SSR safe
  ========================================= */

  useEffect(() => {
    const controller = new AbortController();
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let active = true;

    const fetchPopup = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;

        if (!apiUrl) {
          console.warn("Popup API URL is not configured.");
          return;
        }

        const response = await fetch(
          `${apiUrl.replace(/\/+$/, "")}/api/popup/active`,
          {
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          if (response.status !== 404) {
            console.warn(
              "Unable to fetch active popup:",
              response.status
            );
          }
          return;
        }

        const data: Popup | null = await response.json();

        if (!active || !data || !data.title) {
          return;
        }

        setPopup(data);

        const delay = Number(data.delay);

        const safeDelay =
          Number.isFinite(delay) && delay >= 0
            ? delay
            : 3000;

        timeoutId = setTimeout(() => {
          if (active) {
            setOpen(true);
          }
        }, safeDelay);
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Popup fetch error:", error);
        }
      }
    };

    fetchPopup();

    return () => {
      active = false;
      controller.abort();

      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  /* =========================================
     CLOSE ON ESCAPE
  ========================================= */

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [open]);

  /* =========================================
     RENDER
  ========================================= */

  if (!popup) return null;

  return (
    <AnimatePresence>
      {open && (
        <div
          className="
            fixed inset-0 z-[9999]
            flex items-center justify-center
            bg-black/50 px-4
          "
        >
          {/* OVERLAY CLOSE */}
          <div
            className="absolute inset-0"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          {/* POPUP */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="nirjara-offer-title"
            aria-describedby="nirjara-offer-description"
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
              relative z-10 w-full max-w-4xl
              overflow-hidden rounded-[40px]
              bg-white shadow-2xl
            "
          >
            {/* CLOSE BUTTON */}
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close offer"
              className="
                absolute right-5 top-5 z-20
                flex h-10 w-10
                items-center justify-center
                rounded-full bg-white/90
                text-xl text-[#E75480]
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
                <p
                  className="
                    text-xs uppercase tracking-[5px]
                    text-[#E75480]
                  "
                >
                  Limited Time Offer
                </p>

                <h2
                  id="nirjara-offer-title"
                  className="
                    mt-4 font-serif text-4xl
                    leading-tight text-[#3A2A2F]
                    md:text-5xl
                  "
                >
                  {popup.title}
                </h2>

                <p
                  id="nirjara-offer-description"
                  className="mt-6 leading-8 text-[#8A6F78]"
                >
                  {popup.subtitle}
                </p>

                <a
                  href={popup.buttonLink}
                  className="
                    mt-8 inline-flex w-fit
                    rounded-full bg-[#E75480]
                    px-8 py-4 text-sm
                    uppercase tracking-[3px]
                    text-white transition
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
