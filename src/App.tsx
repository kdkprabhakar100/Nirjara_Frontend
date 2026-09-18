import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

// ==============================
// SHARED PUBLIC COMPONENTS
// ==============================
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import OfferPopup from "./components/OfferPopup";
import Gallery from "./components/Gallery";

// ==============================
// PUBLIC PAGES
// ==============================
import Home from "./pages/public/Home";
import Services from "./pages/public/Services";
import Branches from "./pages/public/Branches";
import Academy from "./pages/public/Academy";
import Blog from "./pages/public/Blog";
import Contact from "./pages/public/Contact";
import Booking from "./pages/public/Booking";
import Events from "./pages/public/Events";
import EventDetails from "./pages/public/EventDetails";
import Careers from "./pages/public/Careers";
import About from "./pages/public/About";
// ==============================
// PRODUCT PAGES
// ==============================
import Products from "./pages/product/Products";
import ProductDetails from "./pages/product/ProductDetails";
import Cart from "./pages/product/Cart";
import Checkout from "./pages/product/Checkout";

// ==============================
// PUBLIC LAYOUT
// ==============================
function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />

      <OfferPopup />

      <main>
        {children}
      </main>

      <Footer />

      <WhatsAppButton />
    </>
  );
}

// ==============================
// APP
// ==============================
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* HOME */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          }
        />

        {/* SERVICES */}
        <Route
          path="/services"
          element={
            <PublicLayout>
              <Services />
            </PublicLayout>
          }
        />

        {/* GALLERY */}
        <Route
          path="/gallery"
          element={
            <PublicLayout>
              <Gallery />
            </PublicLayout>
          }
        />

        {/* BRANCHES */}
        <Route
          path="/branches"
          element={
            <PublicLayout>
              <Branches />
            </PublicLayout>
          }
        />

        {/* ACADEMY */}
        <Route
          path="/academy"
          element={
            <PublicLayout>
              <Academy />
            </PublicLayout>
          }
        />

        {/* BLOG */}
        <Route
          path="/blog"
          element={
            <PublicLayout>
              <Blog />
            </PublicLayout>
          }
        />

        {/* CONTACT */}
        <Route
          path="/contact"
          element={
            <PublicLayout>
              <Contact />
            </PublicLayout>
          }
        />

        {/* BOOKING */}
        <Route
          path="/booking"
          element={
            <PublicLayout>
              <Booking />
            </PublicLayout>
          }
        />

        {/* PRODUCTS */}
        <Route
          path="/products"
          element={
            <PublicLayout>
              <Products />
            </PublicLayout>
          }
        />

        {/* PRODUCT DETAILS */}
        <Route
          path="/products/:id"
          element={
            <PublicLayout>
              <ProductDetails />
            </PublicLayout>
          }
        />

        {/* CART */}
        <Route
          path="/cart"
          element={
            <PublicLayout>
              <Cart />
            </PublicLayout>
          }
        />

        {/* CHECKOUT */}
        <Route
          path="/checkout"
          element={
            <PublicLayout>
              <Checkout />
            </PublicLayout>
          }
        />

        {/* EVENTS */}
        <Route
          path="/events"
          element={
            <PublicLayout>
              <Events />
            </PublicLayout>
          }
        />

        {/* EVENT DETAILS */}
        <Route
          path="/events/:id"
          element={
            <PublicLayout>
              <EventDetails />
            </PublicLayout>
          }
        />

        {/* CAREERS */}
        <Route
          path="/careers"
          element={
            <PublicLayout>
              <Careers />
            </PublicLayout>
          }
        />

        {/* ABOUT */}
        <Route
          path="/about"
          element={
            <PublicLayout>
              <About />
            </PublicLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}