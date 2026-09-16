import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";

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

const EventDetails = () => {
  const { id } = useParams();

  const [event, setEvent] = useState<EventType | null>(
    null
  );

  const [relatedEvents, setRelatedEvents] = useState<
    EventType[]
  >([]);

  // =============================
  // FETCH SINGLE EVENT
  // =============================
  const fetchEvent = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/events/${id}`
      );

      setEvent(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // =============================
  // FETCH RELATED EVENTS
  // =============================
  const fetchRelatedEvents = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/events`
      );

      const filtered = res.data.filter(
        (item: EventType) => item._id !== id
      );

      setRelatedEvents(filtered.slice(0, 3));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEvent();
    fetchRelatedEvents();
  }, [id]);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center text-pink-600 text-2xl">
        Loading Event...
      </div>
    );
  }

  return (
    <div className="bg-pink-50 min-h-screen">
      {/* ============================= */}
      {/* HERO IMAGE */}
      {/* ============================= */}

      <div className="relative h-[500px] overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-[250px] sm:h-[350px] md:h-[500px] object-cover"        />

        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center px-4"
          >
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-4">
              {event.title}
            </h1>

            <p className="text-white text-lg">
              Premium Nirjara Beauty Event
            </p>
          </motion.div>
        </div>
      </div>

      {/* ============================= */}
      {/* EVENT CONTENT */}
      {/* ============================= */}

      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          {/* DETAILS */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="bg-pink-100 rounded-2xl p-6 text-center">
              <h3 className="text-pink-700 font-bold mb-2">
                Date
              </h3>

              <p className="text-gray-700">
                {new Date(
                  event.date
                ).toLocaleDateString()}
              </p>
            </div>

            <div className="bg-pink-100 rounded-2xl p-6 text-center">
              <h3 className="text-pink-700 font-bold mb-2">
                Time
              </h3>

              <p className="text-gray-700">
                {event.time}
              </p>
            </div>

            <div className="bg-pink-100 rounded-2xl p-6 text-center">
              <h3 className="text-pink-700 font-bold mb-2">
                Location
              </h3>

              <p className="text-gray-700">
                {event.location}
              </p>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="mb-10">
            <h2 className="text-3xl font-serif font-bold text-pink-700 mb-6">
              About This Event
            </h2>

            <p className="text-gray-700 leading-relaxed text-lg">
              {event.description}
            </p>
          </div>

          {/* CTA */}
          <Link
            to={event.buttonLink}
            className="inline-block bg-pink-600 hover:bg-pink-700 transition text-white px-8 py-4 rounded-xl text-lg"
          >
            {event.buttonText}
          </Link>
        </div>
      </section>

      {/* ============================= */}
      {/* RELATED EVENTS */}
      {/* ============================= */}

      <section className="max-w-7xl mx-auto px-4 pb-20">
        <h2 className="text-4xl font-serif font-bold text-center text-pink-700 mb-14">
          Related Events
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {relatedEvents.map((item) => (
            <motion.div
              key={item._id}
              whileHover={{ y: -8 }}
              className="bg-white rounded-3xl overflow-hidden shadow-lg"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-64 object-cover"
              />

              <div className="p-6">
                <h3 className="text-2xl font-serif font-bold text-pink-700 mb-3">
                  {item.title}
                </h3>

                <p className="text-gray-600 mb-5 line-clamp-3">
                  {item.description}
                </p>

                <Link
                  to={`/events/${item._id}`}
                  className="inline-block bg-pink-600 hover:bg-pink-700 transition text-white px-6 py-3 rounded-xl"
                >
                  View Details
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default EventDetails;