import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

type Career = {
  _id: string;
  title: string;
  location: string;
  type: string;
  salary?: string;
  description: string;
  requirements?: string;
};

export default function Careers() {
  const [careers, setCareers] = useState<Career[]>([]);

  const fetchCareers = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/careers`
      );

      setCareers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCareers();
  }, []);

  return (
    <main className="min-h-screen bg-[#FFF5F8] text-[#3A2A2F]">
      <section className="bg-gradient-to-r from-pink-100 to-pink-200 px-6 py-20 text-center">
        <h1 className="font-serif text-4xl font-bold text-[#E75480] md:text-6xl">
          Careers at Nirjara
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#6B5B61] md:text-base">
          Join our beauty family and grow your career in a creative,
          professional, and elegant salon environment.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="text-center font-serif text-3xl font-bold text-[#E75480] md:text-4xl">
          Current Openings
        </h2>

        {careers.length === 0 ? (
          <p className="mt-10 text-center text-[#8A6F78]">
            No job openings available right now.
          </p>
        ) : (
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {careers.map((career) => (
              <div
                key={career._id}
                className="rounded-[30px] bg-white p-8 shadow-lg"
              >
                <h3 className="font-serif text-2xl font-bold text-[#E75480]">
                  {career.title}
                </h3>

                <div className="mt-4 flex flex-wrap gap-3 text-sm text-[#8A6F78]">
                  <span className="rounded-full bg-pink-50 px-4 py-2">
                    📍 {career.location}
                  </span>

                  <span className="rounded-full bg-pink-50 px-4 py-2">
                    🕒 {career.type}
                  </span>

                  {career.salary && (
                    <span className="rounded-full bg-pink-50 px-4 py-2">
                      💰 {career.salary}
                    </span>
                  )}
                </div>

                <p className="mt-5 text-sm leading-7 text-[#6B5B61]">
                  {career.description}
                </p>

                {career.requirements && (
                  <p className="mt-4 text-sm leading-7 text-[#6B5B61]">
                    <strong>Requirements:</strong> {career.requirements}
                  </p>
                )}

                <Link
                  to="/contact"
                  className="mt-8 inline-block rounded-full bg-[#E75480] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#d94372]"
                >
                  Apply Now
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}