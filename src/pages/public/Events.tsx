import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface EventType {
  _id: string;
  title: string;
  description: string;
  image: string;
  location: string;
  date: string;
  time: string;
  buttonText: string;
  buttonLink: string;
  featured: boolean;
}

const Events = () => {
  const [events, setEvents] = useState<EventType[]>([]);

  // =============================
  // FETCH EVENTS
  // =============================

  const fetchEvents = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/events`
      );

      setEvents(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // =============================
  // FEATURED EVENT
  // =============================

  const featuredEvent = events.find(
    (event) => event.featured
  );

  return (
    <div className="bg-pink-50 min-h-screen overflow-hidden">
      {/* ============================= */}
      {/* HERO SECTION */}
      {/* ============================= */}

      <div className="relative overflow-hidden py-16 sm:py-20 lg:py-24 bg-gradient-to-r from-pink-100 to-pink-200">
        <div className="max-w-5xl mx-auto text-center px-4 flex flex-col items-center justify-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-pink-700 mb-6 leading-tight">
            Nirjara Events
          </h1>

          <p className="text-gray-700 text-sm sm:text-lg leading-relaxed max-w-3xl mx-auto">
            Discover exclusive beauty
            masterclasses, bridal workshops,
            academy events, and premium salon
            experiences.
          </p>
        </div>
      </div>

      {/* ============================= */}
      {/* FEATURED EVENT */}
      {/* ============================= */}

      {featuredEvent && (
        <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="mb-8">
            <span className="bg-pink-600 text-white px-5 py-2 rounded-full text-sm shadow-md">
              Featured Event
            </span>
          </div>

          <motion.div
            whileHover={{ scale: 1.01 }}
            className="grid lg:grid-cols-2 gap-8 lg:gap-10 bg-white rounded-3xl shadow-xl overflow-hidden"
          >
            {/* IMAGE */}

            <div className="overflow-hidden">
              <img
                src={featuredEvent.image}
                alt={featuredEvent.title}
                className="w-full h-[250px] sm:h-[350px] lg:h-full object-cover transition duration-500 hover:scale-105"
              />
            </div>

            {/* CONTENT */}

            <div className="p-6 md:p-10 flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-pink-700 mb-5 leading-tight">
                {featuredEvent.title}
              </h2>

              <p className="text-gray-600 leading-relaxed mb-6">
                {featuredEvent.description}
              </p>

              <div className="space-y-2 text-gray-700 mb-8">
                <p>
                  📍{" "}
                  {featuredEvent.location}
                </p>

                <p>
                  📅{" "}
                  {new Date(
                    featuredEvent.date
                  ).toLocaleDateString()}
                </p>

                <p>
                  ⏰{" "}
                  {featuredEvent.time}
                </p>
              </div>

              <Link
                to={`/events/${featuredEvent._id}`}
                className="bg-pink-600 hover:bg-pink-700 transition text-white px-8 py-4 rounded-xl w-fit shadow-md"
              >
                View Details
              </Link>
            </div>
          </motion.div>
        </section>
      )}

      {/* ============================= */}
      {/* ALL EVENTS */}
      {/* ============================= */}

      <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10 md:py-14">
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-center text-pink-700 mb-10 md:mb-14 leading-tight">
          Upcoming Events
        </h2>

        {events.length === 0 ? (
          <div className="text-center text-gray-500 text-lg">
            No events available.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {events.map((event) => (
              <motion.div
                key={event._id}
                whileHover={{ y: -8 }}
                className="group bg-white rounded-3xl overflow-hidden shadow-lg flex flex-col h-full"
              >
                {/* IMAGE */}

                <div className="relative overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-56 sm:h-64 lg:h-72 object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute top-4 left-4 bg-pink-600 text-white px-4 py-2 rounded-xl text-sm shadow-lg">
                    {new Date(
                      event.date
                    ).toLocaleDateString()}
                  </div>
                </div>

                {/* CONTENT */}

                <div className="p-5 md:p-6 flex flex-col flex-1">
                  <h3 className="text-2xl font-serif font-bold text-pink-700 mb-3 leading-tight">
                    {event.title}
                  </h3>

                  <p className="text-gray-600 mb-5 line-clamp-3">
                    {event.description}
                  </p>

                  <div className="space-y-2 text-gray-500 mb-6">
                    <p>
                      📍 {event.location}
                    </p>

                    <p>
                      ⏰ {event.time}
                    </p>
                  </div>

                  {/* BUTTON */}

                  <div className="mt-auto">
                    <Link
                      to={`/events/${event._id}`}
                      className="inline-block bg-pink-600 hover:bg-pink-700 transition text-white px-6 py-3 rounded-xl shadow-md"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Events;