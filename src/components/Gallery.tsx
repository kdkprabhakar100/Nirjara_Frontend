import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  wrap,
} from "framer-motion";

type GalleryItem = {
  _id: string;
  title: string;
  category?: string;
  description?: string;
  image: string;
};

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);

  const containerRef = useRef<HTMLDivElement>(null);

  /* =========================================================
     FETCH GALLERY
  ========================================================= */

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/gallery`
        );

        if (!response.ok) {
          throw new Error("Unable to load gallery.");
        }

        const data = await response.json();

        setItems(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Gallery fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  /* =========================================================
     CREATE ENOUGH CARDS FOR INFINITE SLIDER
  ========================================================= */

  const repeatedItems = useMemo(() => {
    if (!items.length) return [];

    let result = [...items];

    while (result.length < 12) {
      result = [...result, ...items];
    }

    return [...result, ...result];
  }, [items]);

  /* =========================================================
     RESPONSIVE CARD WIDTH
  ========================================================= */

  const getCardWidth = () => {
    if (typeof window === "undefined") return 210;

    if (window.innerWidth < 640) return 165;
    if (window.innerWidth < 1024) return 190;

    return 210;
  };

  const getGap = () => {
    if (typeof window === "undefined") return 18;

    if (window.innerWidth < 640) return 12;
    if (window.innerWidth < 1024) return 16;

    return 18;
  };

  /* =========================================================
     INFINITE AUTOMATIC MOVEMENT
  ========================================================= */

  useAnimationFrame((_, delta) => {
    if (
      loading ||
      !items.length ||
      isDragging ||
      isHovered
    ) {
      return;
    }

    const cardWidth = getCardWidth();
    const gap = getGap();

    const singleSetLength =
      (cardWidth + gap) * (repeatedItems.length / 2);

    let newX = x.get();

    /*
      Right -> Left
    */

    newX -= delta * 0.025;

    /*
      Invisible infinite reset
    */

    if (newX <= -singleSetLength) {
      newX += singleSetLength;
    }

    x.set(newX);
  });

  /* =========================================================
     U-SHAPED CURVE

     THIS IS THE IMPORTANT PART.

     Edge cards = HIGHER
     Center cards = LOWER

          CARD                 CARD
            \                 /
             \               /
              CARD       CARD
                  \     /
                   CARD

  ========================================================= */

  const getCurveY = (
    cardIndex: number,
    currentX: number
  ) => {
    if (typeof window === "undefined") return 0;

    const cardWidth = getCardWidth();
    const gap = getGap();

    const step = cardWidth + gap;

    const screenCenter = window.innerWidth / 2;

    /*
      Actual center position of this card
    */

    const cardCenter =
      currentX +
      cardIndex * step +
      cardWidth / 2;

    /*
      Distance from center of screen
    */

    const distance = Math.abs(
      cardCenter - screenCenter
    );

    /*
      Normalize distance.

      0 = center
      1 = outer area
    */

    const normalized = Math.min(
      distance / (window.innerWidth * 0.48),
      1
    );

    /*
      U CURVE

      center = pushed DOWN
      edges  = pushed UP
    */

    const maxDrop =
      window.innerWidth < 640 ? 35 : 65;

    return maxDrop * (1 - normalized);
  };

  /* =========================================================
     CARD SCALE

     Keep center slightly smaller like your reference.
     Outer cards slightly larger.
  ========================================================= */

  const getScale = (
    cardIndex: number,
    currentX: number
  ) => {
    if (typeof window === "undefined") return 1;

    const cardWidth = getCardWidth();
    const gap = getGap();

    const step = cardWidth + gap;

    const center = window.innerWidth / 2;

    const cardCenter =
      currentX +
      cardIndex * step +
      cardWidth / 2;

    const distance = Math.abs(cardCenter - center);

    const normalized = Math.min(
      distance / (window.innerWidth * 0.5),
      1
    );

    /*
      center = .94
      edges = 1
    */

    return 0.94 + normalized * 0.06;
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FFF5F8] pt-28">
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#E75480]/20 border-t-[#E75480]" />
        </div>
      </main>
    );
  }

  /* =========================================================
     EMPTY
  ========================================================= */

  if (!items.length) {
    return (
      <main className="min-h-screen bg-[#FFF5F8] pt-32">
        <div className="py-32 text-center text-[#8A6F78]">
          No gallery images available.
        </div>
      </main>
    );
  }

  return (
    <main
      className="
        min-h-screen
        overflow-hidden
        bg-[#FFF5F8]
        pt-28
        text-[#3A2A2F]

        md:pt-32
      "
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="px-6 text-center">
        <p
          className="
            text-[9px]
            uppercase
            tracking-[5px]
            text-[#E75480]

            md:text-xs
          "
        >
          Our Gallery
        </p>

        <h1
          className="
            mt-3
            font-serif
            text-4xl

            md:text-5xl
            lg:text-6xl
          "
        >
          Beauty{" "}
          <span className="italic text-[#E75480]">
            In Motion
          </span>
        </h1>

        <p
          className="
            mx-auto
            mt-4
            max-w-xl
            text-sm
            leading-7
            text-[#8A6F78]

            md:text-base
          "
        >
          Explore beautiful transformations, artistry
          and unforgettable moments created at Nirjara
          Beauty.
        </p>
      </section>

      {/* =====================================================
          SMALL TITLE
      ===================================================== */}

      <div
        className="
          mt-10
          flex
          items-center
          justify-center
          gap-4

          md:mt-12
        "
      >
        <span className="h-px w-8 bg-[#E75480]/30" />

        <span
          className="
            text-[8px]
            uppercase
            tracking-[5px]
            text-[#E75480]
          "
        >
          Beauty In Motion
        </span>

        <span className="h-px w-8 bg-[#E75480]/30" />
      </div>

      {/* =====================================================
          CAROUSEL
      ===================================================== */}

      <section
        ref={containerRef}
        className="
          relative
          mt-5
          h-[410px]
          w-full
          overflow-hidden

          sm:h-[440px]
          lg:h-[490px]
        "
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* LEFT FADE */}

        <div
          className="
            pointer-events-none
            absolute
            bottom-0
            left-0
            top-0
            z-30
            w-[5%]
            bg-gradient-to-r
            from-[#FFF5F8]
            to-transparent

            md:w-[8%]
          "
        />

        {/* RIGHT FADE */}

        <div
          className="
            pointer-events-none
            absolute
            bottom-0
            right-0
            top-0
            z-30
            w-[5%]
            bg-gradient-to-l
            from-[#FFF5F8]
            to-transparent

            md:w-[8%]
          "
        />

        {/* =================================================
            DRAGGABLE TRACK
        ================================================= */}

        <motion.div
          drag="x"
          dragElastic={0.05}
          dragMomentum
          dragTransition={{
            bounceStiffness: 300,
            bounceDamping: 40,
            power: 0.15,
            timeConstant: 250,
          }}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => {
            setTimeout(() => {
              setIsDragging(false);
            }, 300);
          }}
          style={{
            x,
          }}
          className="
            absolute
            left-0
            top-2
            flex
            w-max
            cursor-grab
            select-none
            gap-3

            active:cursor-grabbing

            sm:gap-4
            lg:gap-[18px]
          "
        >
          {repeatedItems.map((item, index) => (
            <CurvedGalleryCard
              key={`${item._id}-${index}`}
              item={item}
              index={index}
              trackX={x}
              getCurveY={getCurveY}
              getScale={getScale}
            />
          ))}
        </motion.div>
      </section>

      {/* =====================================================
          BOTTOM
      ===================================================== */}

      <div
        className="
          -mt-5
          flex
          flex-col
          items-center
          pb-16

          lg:-mt-8
        "
      >
        {/* fake progress */}

        <div className="flex items-center gap-2">
          <span className="h-1.5 w-8 rounded-full bg-[#E75480]" />

          <span className="h-1.5 w-1.5 rounded-full bg-[#E75480]/25" />

          <span className="h-1.5 w-1.5 rounded-full bg-[#E75480]/25" />
        </div>

        <div className="mt-5 flex items-center gap-4">
          <span className="h-px w-7 bg-[#E75480]/25" />

          <span
            className="
              text-[8px]
              uppercase
              tracking-[5px]
              text-[#C77A95]
            "
          >
            Drag To Explore
          </span>

          <span className="h-px w-7 bg-[#E75480]/25" />
        </div>
      </div>
    </main>
  );
}

/* ===========================================================
   INDIVIDUAL CURVED CARD
=========================================================== */

type CurvedGalleryCardProps = {
  item: GalleryItem;

  index: number;

  trackX: ReturnType<typeof useMotionValue<number>>;

  getCurveY: (
    index: number,
    currentX: number
  ) => number;

  getScale: (
    index: number,
    currentX: number
  ) => number;
};

function CurvedGalleryCard({
  item,
  index,
  trackX,
  getCurveY,
  getScale,
}: CurvedGalleryCardProps) {
  const [curveY, setCurveY] = useState(0);
  const [scale, setScale] = useState(1);

  /*
    Update the curve while the track moves.

    Therefore the curve belongs to the VIEWPORT,
    not to individual cards.

    This is what keeps the structure intact.
  */

  useAnimationFrame(() => {
    const currentX = trackX.get();

    setCurveY(
      getCurveY(index, currentX)
    );

    setScale(
      getScale(index, currentX)
    );
  });

  return (
    <motion.article
      animate={{
        y: curveY,
        scale,
      }}
      transition={{
        y: {
          duration: 0.12,
          ease: "linear",
        },

        scale: {
          duration: 0.12,
          ease: "linear",
        },
      }}
      whileHover={{
        scale: scale + 0.025,
      }}
      className="
        group
        relative

        h-[285px]
        w-[165px]

        shrink-0
        overflow-hidden
        rounded-[25px]

        bg-white

        shadow-[0_15px_40px_rgba(58,42,47,0.10)]

        sm:h-[330px]
        sm:w-[190px]

        lg:h-[370px]
        lg:w-[210px]
      "
    >
      {/* IMAGE */}

      <img
        src={item.image}
        alt={item.title}
        draggable={false}
        className="
          pointer-events-none
          h-full
          w-full
          select-none
          object-cover

          transition-transform
          duration-700
          ease-out

          group-hover:scale-[1.04]
        "
      />

      {/* BOTTOM GRADIENT */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-gradient-to-t
          from-black/75
          via-black/5
          to-transparent
        "
      />

      {/* PINK HOVER */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[#E75480]/0

          transition-colors
          duration-500

          group-hover:bg-[#E75480]/10
        "
      />

      {/* CONTENT */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-0
          right-0
          z-10
          p-4

          lg:p-5
        "
      >
        {item.category && (
          <p
            className="
              mb-2
              text-[7px]
              font-semibold
              uppercase
              tracking-[3px]
              text-[#FFB4CA]
            "
          >
            {item.category}
          </p>
        )}

        <h2
          className="
            font-serif
            text-lg
            leading-tight
            text-white

            sm:text-xl
            lg:text-2xl
          "
        >
          {item.title}
        </h2>

        {item.description && (
          <p
            className="
              mt-2
              max-h-0
              overflow-hidden

              text-[10px]
              leading-5
              text-white/80

              opacity-0

              transition-all
              duration-500

              group-hover:max-h-16
              group-hover:opacity-100

              lg:text-[11px]
            "
          >
            {item.description}
          </p>
        )}
      </div>
    </motion.article>
  );
}