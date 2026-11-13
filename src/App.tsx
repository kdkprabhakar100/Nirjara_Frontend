
import "./App.css";

import type { ReactNode } from "react";

import { Routes, Route } from "react-router";

/* ============================================================
   SSR INITIAL DATA TYPES
============================================================ */

import type { HomeInitialData } from "./pages/public/Home";
import type { ServicesInitialData } from "./pages/public/Services";
import type { BranchesInitialData } from "./pages/public/Branches";
import type { AcademyInitialData } from "./pages/public/Academy";
import type { BlogInitialData } from "./pages/public/Blog";
import type { BlogDetailsInitialData } from "./pages/public/BlogDetails";
import type { ContactInitialData } from "./pages/public/Contact";
import type { BookingInitialData } from "./pages/public/Booking";
import type { EventsInitialData } from "./pages/public/Events";
import type { EventDetailsInitialData } from "./pages/public/EventDetails";
import type { CareersInitialData } from "./pages/public/Careers";
import type { AboutInitialData } from "./pages/public/About";

/* ============================================================
   SHARED PUBLIC COMPONENTS
============================================================ */

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import OfferPopup from "./components/OfferPopup";
import Gallery from "./components/Gallery";

/* ============================================================
   PUBLIC PAGES
============================================================ */

import Home from "./pages/public/Home";
import Services from "./pages/public/Services";
import Branches from "./pages/public/Branches";
import Academy from "./pages/public/Academy";
import Blog from "./pages/public/Blog";
import BlogDetails from "./pages/public/BlogDetails";
import Contact from "./pages/public/Contact";
import Booking from "./pages/public/Booking";
import Events from "./pages/public/Events";
import EventDetails from "./pages/public/EventDetails";
import Careers from "./pages/public/Careers";
import About from "./pages/public/About";
import SocialMedia from "./pages/public/SocialMedia";

/* ============================================================
   PRODUCT PAGES
============================================================ */

import Products from "./pages/product/Products";
import ProductDetails from "./pages/product/ProductDetails";
import Cart from "./pages/product/Cart";
import Checkout from "./pages/product/Checkout";

/* ============================================================
   OTHER PAGES
============================================================ */

import OrderSuccess from "./components/OrderSuccess";
import LegalPage from "./pages/legal/LegalPage";

/* ============================================================
   PUBLIC LAYOUT
============================================================ */

function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Navbar />

      <OfferPopup />

      <main id="main-content">{children}</main>

      <Footer />

      <WhatsAppButton />
    </>
  );
}

/* ============================================================
   APPLICATION INITIAL DATA

   Each page receives data loaded by the SSR server.

   All properties are optional so that client-side
   navigation continues working without SSR data.
============================================================ */

export type AppInitialData = {
  home?: HomeInitialData;
  services?: ServicesInitialData;

  branches?: BranchesInitialData;

  academy?: AcademyInitialData;

  blog?: BlogInitialData;
  blogDetails?: BlogDetailsInitialData;

  contact?: ContactInitialData;
  booking?: BookingInitialData;

  events?: EventsInitialData;
  eventDetails?: EventDetailsInitialData;

  careers?: CareersInitialData;

  about?: AboutInitialData;
};

/* ============================================================
   APP PROPS
============================================================ */

type AppProps = {
  initialData?: AppInitialData;
};

/* ============================================================
   APP
============================================================ */

export default function App({
  initialData,
}: AppProps) {
  return (
    <Routes>
      {/* ======================================================
          HOME
      ====================================================== */}

      <Route
        path="/"
        element={
          <PublicLayout>
            <Home initialData={initialData?.home} />
          </PublicLayout>
        }
      />

      {/* ======================================================
          SERVICES
      ====================================================== */}

      <Route
        path="/services"
        element={
          <PublicLayout>
            <Services initialData={initialData?.services} />
          </PublicLayout>
        }
      />

      {/* ======================================================
          GALLERY
      ====================================================== */}

      <Route
        path="/gallery"
        element={
          <PublicLayout>
            <Gallery />
          </PublicLayout>
        }
      />

      {/* ======================================================
          BRANCHES
      ====================================================== */}

      <Route
        path="/branches"
        element={
          <PublicLayout>
            <Branches initialData={initialData?.branches} />
          </PublicLayout>
        }
      />

      {/* ======================================================
          ACADEMY
      ====================================================== */}

      <Route
        path="/academy"
        element={
          <PublicLayout>
            <Academy initialData={initialData?.academy} />
          </PublicLayout>
        }
      />

      {/* ======================================================
          BLOG
      ====================================================== */}

      <Route
        path="/blog"
        element={
          <PublicLayout>
            <Blog initialData={initialData?.blog} />
          </PublicLayout>
        }
      />

      {/* ======================================================
          BLOG DETAILS
      ====================================================== */}

      <Route
        path="/blog/:slug"
        element={
          <PublicLayout>
            <BlogDetails initialData={initialData?.blogDetails} />
          </PublicLayout>
        }
      />

      {/* ======================================================
          CONTACT
      ====================================================== */}

      <Route
        path="/contact"
        element={
          <PublicLayout>
            <Contact initialData={initialData?.contact} />
          </PublicLayout>
        }
      />

      {/* ======================================================
          BOOKING
      ====================================================== */}

      <Route
        path="/booking"
        element={
          <PublicLayout>
            <Booking initialData={initialData?.booking} />
          </PublicLayout>
        }
      />

      {/* ======================================================
          PRODUCTS
      ====================================================== */}

      <Route
        path="/products"
        element={
          <PublicLayout>
            <Products />
          </PublicLayout>
        }
      />

      {/* ======================================================
          PRODUCT DETAILS
      ====================================================== */}

      <Route
        path="/products/:id"
        element={
          <PublicLayout>
            <ProductDetails />
          </PublicLayout>
        }
      />

      {/* ======================================================
          CART
      ====================================================== */}

      <Route
        path="/cart"
        element={
          <PublicLayout>
            <Cart />
          </PublicLayout>
        }
      />

      {/* ======================================================
          CHECKOUT
      ====================================================== */}

      <Route
        path="/checkout"
        element={
          <PublicLayout>
            <Checkout />
          </PublicLayout>
        }
      />

      {/* ======================================================
          EVENTS
      ====================================================== */}

      <Route
        path="/events"
        element={
          <PublicLayout>
            <Events initialData={initialData?.events} />
          </PublicLayout>
        }
      />

      {/* ======================================================
          EVENT DETAILS
      ====================================================== */}

      <Route
        path="/events/:id"
        element={
          <PublicLayout>
            <EventDetails initialData={initialData?.eventDetails} />
          </PublicLayout>
        }
      />

      {/* ======================================================
          CAREERS
      ====================================================== */}

      <Route
        path="/careers"
        element={
          <PublicLayout>
            <Careers initialData={initialData?.careers} />
          </PublicLayout>
        }
      />

      {/* ======================================================
          ABOUT
      ====================================================== */}

      <Route
        path="/about"
        element={
          <PublicLayout>
            <About initialData={initialData?.about} />
          </PublicLayout>
        }
      />

      {/* ======================================================
          LEGAL PAGES
      ====================================================== */}

      <Route
        path="/privacy-policy"
        element={
          <PublicLayout>
            <LegalPage slug="privacy-policy" />
          </PublicLayout>
        }
      />

      <Route
        path="/terms"
        element={
          <PublicLayout>
            <LegalPage slug="terms" />
          </PublicLayout>
        }
      />

      {/* ======================================================
          ORDER SUCCESS
      ====================================================== */}

      <Route
        path="/order-success"
        element={
          <PublicLayout>
            <OrderSuccess />
          </PublicLayout>
        }
      />

      {/* ======================================================
          SOCIAL MEDIA
      ====================================================== */}

      <Route
        path="/social-media"
        element={
          <PublicLayout>
            <SocialMedia />
          </PublicLayout>
        }
      />
    </Routes>
  );
}
