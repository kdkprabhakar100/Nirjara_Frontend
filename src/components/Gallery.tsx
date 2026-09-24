import {
  motion,
  useAnimationFrame,
  useMotionValue,
  type MotionValue,
} from "framer-motion";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/* =========================================================
   TYPES
========================================================= */

type GalleryItem = {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  image: string;
  status?: string;
};

/* =========================================================
   CAROUSEL SETTINGS
========================================================= */

const CARD_WIDTH = 190;
const CARD_GAP = 16;
const ITEM_WIDTH = CARD_WIDTH + CARD_GAP;

/*
  Automatic slider speed.
  Increase = faster
  Decrease = slower

  Good range: 25–45
*/
const AUTO_SPEED = 128;

/*
  We repeat the gallery multiple times so that the slider
  can loop without visibly jumping.
*/
const REPEAT_COUNT = 7;

/* =========================================================
   CURVED GALLERY CARD
========================================================= */

type CurvedGalleryCardProps = {
  item: GalleryItem;
  index: number;
  sliderX: MotionValue<number>;
};

function CurvedGalleryCard({
  item,
  index,
  sliderX,
}: CurvedGalleryCardProps) {
  /*
    Height is a MotionValue instead of React state.

    This is important because changing React state every
    animation frame would cause unnecessary re-renders.
  */
  const height = useMotionValue(260);

  const opacity = useMotionValue(1);

  const scale = useMotionValue(1);

  useAnimationFrame(() => {
    const viewportWidth = window.innerWidth;

    /* ---------------------------------------------
       Find this card's position mathematically.

       IMPORTANT:
       We do NOT use getBoundingClientRect().
       That avoids repeated layout calculations.
    --------------------------------------------- */

    const cardLeft =
      sliderX.get() + index * ITEM_WIDTH;

    const cardCenter =
      cardLeft + CARD_WIDTH / 2;

    const screenCenter =
      viewportWidth / 2;

    const distanceFromCenter = Math.abs(
      cardCenter - screenCenter
    );

    /*
      Convert distance to 0 → 1.

      0 = exact center of screen
      1 = edge of screen
    */
    const normalizedDistance = Math.min(
      distanceFromCenter /
        (viewportWidth / 2),
      1
    );

    /*
      This controls the curve.

      Higher exponent:
      flatter center + stronger edges

      Lower exponent:
      softer curve
    */
    const curve = Math.pow(
      normalizedDistance,
      1.55
    );

    /* ---------------------------------------------
       RESPONSIVE HEIGHTS
    --------------------------------------------- */

    let centerHeight = 235;
    let edgeHeight = 430;

    if (viewportWidth < 640) {
      centerHeight = 190;
      edgeHeight = 310;
    } else if (viewportWidth < 1024) {
      centerHeight = 215;
      edgeHeight = 360;
    }

    /*
      Center = shortest
      Edges = tallest
    */
    const calculatedHeight =
      centerHeight +
      (edgeHeight - centerHeight) *
        curve;

    /*
      Set directly.

      NO CSS/Framer height transition here.
      The curve follows the carousel position itself.
    */
    height.set(calculatedHeight);

    /* ---------------------------------------------
       VERY SUBTLE SCALE

       This gives the edge cards slightly more presence
       without changing the main curve structure.
    --------------------------------------------- */

    const calculatedScale =
      0.985 +
      curve * 0.015;

    scale.set(calculatedScale);

    /* ---------------------------------------------
       EDGE FADE
    --------------------------------------------- */

    if (normalizedDistance > 0.88) {
      const fadeAmount =
        (normalizedDistance - 0.88) /
        0.12;

      opacity.set(
        Math.max(
          0.68,
          1 - fadeAmount * 0.32
        )
      );
    } else {
      opacity.set(1);
    }
  });

  return (
    <motion.article
      style={{
        width: CARD_WIDTH,
        height,
        opacity,
        scale,
        willChange:
          "transform, height, opacity",
      }}
      className="
        group
        relative
        shrink-0
        overflow-hidden
        rounded-[24px]
        bg-[#F5E9ED]
        shadow-[0_12px_40px_rgba(58,42,47,0.07)]
      "
    >
      {/* IMAGE */}

      <img
        src={item.image}
        alt={item.title || "Nirjara Beauty"}
        draggable={false}
        loading="lazy"
        className="
          pointer-events-none
          h-full
          w-full
          select-none
          object-cover
          object-center
        "
      />

      {/* SUBTLE IMAGE OVERLAY */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-black/[0.02]
          transition-colors
          duration-500
          group-hover:bg-transparent
        "
      />

      {/* BOTTOM GRADIENT */}

      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          bottom-0
          h-[38%]
          bg-gradient-to-t
          from-black/45
          via-black/10
          to-transparent
        "
      />

      {/* TEXT */}

      {(item.title || item.category) && (
        <div
          className="
            pointer-events-none
            absolute
            bottom-4
            left-4
            right-4
            z-10
          "
        >
          {item.category && (
            <p
              className="
                mb-1
                text-[7px]
                font-medium
                uppercase
                tracking-[2.5px]
                text-white/70
              "
            >
              {item.category}
            </p>
          )}

          {item.title && (
            <h3
              className="
                font-serif
                text-[16px]
                leading-tight
                text-white
                drop-shadow-sm
              "
            >
              {item.title}
            </h3>
          )}
        </div>
      )}
    </motion.article>
  );
}

/* =========================================================
   GALLERY PAGE
========================================================= */

export default function Gallery() {
  const [gallery, setGallery] =
    useState<GalleryItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  /*
    Pause when user hovers.
  */
  const [hovering, setHovering] =
    useState(false);

  /*
    Pause automatic animation while user drags.
  */
  const [dragging, setDragging] =
    useState(false);

  /*
    Main carousel position.
  */
  const x = useMotionValue(0);

  /*
    Width of ONE complete gallery set.
  */
  const singleSetWidthRef =
    useRef(0);

  /* =======================================================
     FETCH GALLERY FROM BACKEND
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    const fetchGallery = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/api/gallery`
        );

        if (!response.ok) {
          throw new Error(
            `Gallery request failed: ${response.status}`
          );
        }

        const data =
          await response.json();

        if (!mounted) return;

        /*
          Supports:
          [...]
          
          OR
          
          { data: [...] }
          
          OR
          
          { items: [...] }
        */

        const items: GalleryItem[] =
          Array.isArray(data)
            ? data
            : Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data?.items)
            ? data.items
            : [];

        setGallery(items);
      } catch (error) {
        console.error(
          "Gallery fetch error:",
          error
        );

        if (mounted) {
          setGallery([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchGallery();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     CREATE REPEATED ITEMS FOR INFINITE LOOP
  ======================================================= */

  const displayItems =
    useMemo(() => {
      if (!gallery.length) {
        return [];
      }

      return Array.from(
        { length: REPEAT_COUNT },
        () => gallery
      ).flat();
    }, [gallery]);

  /* =======================================================
     INITIAL CAROUSEL POSITION
  ======================================================= */

  useEffect(() => {
    if (!gallery.length) return;

    const singleSetWidth =
      gallery.length * ITEM_WIDTH;

    singleSetWidthRef.current =
      singleSetWidth;

    /*
      Start inside the middle repeated copies.

      That gives us plenty of content on both sides.
    */
    x.set(-singleSetWidth * 3);
  }, [gallery, x]);

  /* =======================================================
     INFINITE LOOP NORMALIZATION
  ======================================================= */

  const normalizeSlider =
    useCallback(() => {
      const setWidth =
        singleSetWidthRef.current;

      if (!setWidth) return;

      let currentX = x.get();

      /*
        Because each gallery set is identical,
        moving exactly one set forward/backward
        is visually invisible.
      */

      while (
        currentX <=
        -setWidth * 4
      ) {
        currentX += setWidth;
      }

      while (
        currentX >=
        -setWidth * 2
      ) {
        currentX -= setWidth;
      }

      x.set(currentX);
    }, [x]);

  /* =======================================================
     AUTOMATIC SMOOTH ANIMATION
  ======================================================= */

  useAnimationFrame(
    (_time, delta) => {
      if (!gallery.length) {
        return;
      }

      /*
        Stop automatic movement while interacting.
      */
      if (hovering || dragging) {
        return;
      }

      /*
        Sometimes when changing browser tabs,
        requestAnimationFrame returns a huge delta.

        Clamp it so carousel doesn't suddenly jump.
      */
      const safeDelta =
        Math.min(delta, 32);

      /*
        Convert pixels/second into pixels/frame.
      */
      const movement =
        AUTO_SPEED *
        (safeDelta / 1000);

      /*
        Move right -> left.
      */
      x.set(
        x.get() - movement
      );

      normalizeSlider();
    }
  );

  /* =======================================================
     LOADING SCREEN
  ======================================================= */

  if (loading) {
    return (
      <main
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-[#FFF5F8]
        "
      >
        <div className="text-center">
          <div
            className="
              mx-auto
              h-8
              w-8
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
              text-[8px]
              uppercase
              tracking-[4px]
              text-[#E75480]
            "
          >
            Loading Gallery
          </p>
        </div>
      </main>
    );
  }

  /* =======================================================
     EMPTY STATE
  ======================================================= */

  if (!gallery.length) {
    return (
      <main
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-[#FFF5F8]
          px-6
        "
      >
        <div className="text-center">
          <p
            className="
              text-[9px]
              uppercase
              tracking-[4px]
              text-[#E75480]
            "
          >
            Our Gallery
          </p>

          <h1
            className="
              mt-4
              font-serif
              text-4xl
              text-[#3A2A2F]
            "
          >
            Beauty{" "}
            <span
              className="
                italic
                text-[#E75480]
              "
            >
              In Motion
            </span>
          </h1>

          <p
            className="
              mt-4
              text-sm
              text-[#8A6F78]
            "
          >
            Gallery images will appear here soon.
          </p>
        </div>
      </main>
    );
  }

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <main
      className="
        min-h-screen
        overflow-hidden
        bg-[#FFF5F8]
        pb-16
        pt-28
        sm:pt-32
        lg:pt-36
      "
    >
      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <section
        className="
          relative
          z-10
          px-6
          text-center
        "
      >
        <p
          className="
            text-[9px]
            font-medium
            uppercase
            tracking-[5px]
            text-[#E75480]
          "
        >
          Our Gallery
        </p>

        <h1
          className="
            mt-4
            font-serif
            text-[38px]
            leading-[1.05]
            text-[#3A2A2F]
            sm:text-[46px]
            lg:text-[52px]
          "
        >
          Beauty{" "}
          <span
            className="
              italic
              text-[#E75480]
            "
          >
            In Motion
          </span>
        </h1>

        <p
          className="
            mx-auto
            mt-5
            max-w-[560px]
            text-[13px]
            leading-7
            text-[#8A6F78]
            sm:text-sm
          "
        >
          Explore beautiful transformations,
          artistry and unforgettable moments
          created at Nirjara Beauty.
        </p>
      </section>

      {/* =================================================
          SMALL SECTION LABEL
      ================================================= */}

      <div
        className="
          mt-10
          flex
          items-center
          justify-center
          gap-4
          sm:mt-12
        "
      >
        <span
          className="
            h-px
            w-9
            bg-[#E75480]/25
          "
        />

        <span
          className="
            whitespace-nowrap
            text-[7px]
            font-medium
            uppercase
            tracking-[5px]
            text-[#E75480]
          "
        >
          Beauty In Motion
        </span>

        <span
          className="
            h-px
            w-9
            bg-[#E75480]/25
          "
        />
      </div>

      {/* =================================================
          CURVED GALLERY
      ================================================= */}

      <section
        className="
          relative
          mt-4
          h-[340px]
          w-full
          overflow-hidden
          sm:mt-5
          sm:h-[390px]
          lg:h-[455px]
        "
        onMouseEnter={() => {
          setHovering(true);
        }}
        onMouseLeave={() => {
          setHovering(false);
        }}
      >
        {/* ===============================================
            LEFT SOFT FADE / BLUR
        =============================================== */}

        <div
          className="
            pointer-events-none
            absolute
            inset-y-0
            left-0
            z-30
            w-[7%]
            bg-gradient-to-r
            from-[#FFF5F8]
            via-[#FFF5F8]/60
            to-transparent
            backdrop-blur-[1px]
          "
        />

        {/* ===============================================
            RIGHT SOFT FADE / BLUR
        =============================================== */}

        <div
          className="
            pointer-events-none
            absolute
            inset-y-0
            right-0
            z-30
            w-[7%]
            bg-gradient-to-l
            from-[#FFF5F8]
            via-[#FFF5F8]/60
            to-transparent
            backdrop-blur-[1px]
          "
        />

        {/* ===============================================
            MOVING TRACK

            items-center is IMPORTANT.

            Because cards have different heights,
            this keeps all of them vertically centered.

            Result:

            LEFT EDGE       CENTER       RIGHT EDGE
               tall          short           tall

                 \______________/
        =============================================== */}

        <motion.div
          drag="x"
          dragElastic={0.01}
          dragMomentum={false}

          onDragStart={() => {
            setDragging(true);
          }}

          onDragEnd={() => {
            normalizeSlider();

            window.setTimeout(() => {
              setDragging(false);
            }, 80);
          }}

          style={{
            x,
            gap: CARD_GAP,
            touchAction: "pan-y",
            willChange: "transform",
          }}

          className="
            absolute
            inset-y-0
            left-0
            flex
            w-max
            cursor-grab
            items-center
            select-none
            active:cursor-grabbing
          "
        >
          {displayItems.map(
            (item, index) => (
              <CurvedGalleryCard
                key={`${item._id}-${index}`}
                item={item}
                index={index}
                sliderX={x}
              />
            )
          )}
        </motion.div>
      </section>

      {/* =================================================
          CONTROLS / INDICATOR
      ================================================= */}

      <div
        className="
          mt-2
          flex
          flex-col
          items-center
          justify-center
          gap-3
        "
      >
        {/* INDICATOR */}

        <div
          className="
            flex
            items-center
            justify-center
            gap-[6px]
          "
        >
          <span
            className="
              h-[5px]
              w-[5px]
              rounded-full
              bg-[#E75480]/20
            "
          />

          <span
            className="
              h-[5px]
              w-[5px]
              rounded-full
              bg-[#E75480]/30
            "
          />

          <span
            className="
              h-[5px]
              w-8
              rounded-full
              bg-[#E75480]
            "
          />

          <span
            className="
              h-[5px]
              w-[5px]
              rounded-full
              bg-[#E75480]/30
            "
          />

          <span
            className="
              h-[5px]
              w-[5px]
              rounded-full
              bg-[#E75480]/20
            "
          />
        </div>

        <p
          className="
            text-[7px]
            font-medium
            uppercase
            tracking-[4px]
            text-[#B78B98]
          "
        >
          Drag to explore
        </p>
      </div>
    </main>
  );
}