import { useEffect, useState } from "react";

type TeamMember = {
  _id: string;
  name: string;
  designation: string;
  bio?: string;
  image?: string;
  order?: number;
  status?: "Active" | "Hidden";
};

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

export default function About() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [teamError, setTeamError] = useState("");

  // ==========================================
  // LOAD TEAM FROM BACKEND
  // ==========================================
  useEffect(() => {
    const loadTeam = async () => {
      try {
        setLoading(true);
        setTeamError("");

        const response = await fetch(
          `${API_URL}/api/team`
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch team members: ${response.status}`
          );
        }

        const data: TeamMember[] =
          await response.json();

        // Public page only shows Active members
        // and follows the order set in admin.
        const activeMembers = data
          .filter(
            (member) =>
              member.status === "Active"
          )
          .sort(
            (a, b) =>
              (a.order ?? 0) -
              (b.order ?? 0)
          );

        setTeam(activeMembers);
      } catch (error) {
        console.error(
          "TEAM FETCH ERROR:",
          error
        );

        setTeamError(
          "Team information is currently unavailable."
        );
      } finally {
        setLoading(false);
      }
    };

    loadTeam();
  }, []);

  return (
    <div className="overflow-hidden bg-white text-[#3A2A2F]">
      {/* ==========================================
          HERO
      ========================================== */}
      <section className="relative bg-[#FFF5F8] px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-[#E75480]">
            About Nirjara Beauty
          </p>

          <h1 className="mx-auto max-w-4xl font-serif text-5xl leading-tight md:text-6xl lg:text-7xl">
            Beauty, Confidence
            <span className="block italic text-[#E75480]">
              & Care
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-[#8A6F78] md:text-lg">
            Nirjara Beauty is dedicated to creating
            beautiful, confident experiences through
            professional beauty services, personalized
            care and quality beauty education.
          </p>
        </div>
      </section>

      {/* ==========================================
          OUR STORY
      ========================================== */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          {/* IMAGE PLACEHOLDER */}
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden rounded-[35px] bg-[#FCE7EF]">
              <div className="flex h-full items-center justify-center text-center text-[#E75480]">
                <div>
                  <p className="font-serif text-3xl">
                    Nirjara Beauty
                  </p>

                  <p className="mt-2 text-sm">
                    Add salon image here
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-3 rounded-3xl bg-white px-8 py-6 shadow-xl md:right-8">
              <p className="font-serif text-4xl text-[#E75480]">
                2013
              </p>

              <p className="mt-1 text-sm text-[#8A6F78]">
                Our journey began
              </p>
            </div>
          </div>

          {/* CONTENT */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#E75480]">
              Our Story
            </p>

            <h2 className="font-serif text-4xl leading-tight md:text-5xl">
              A Passion for Beauty,
              <span className="block italic text-[#E75480]">
                Built With Care
              </span>
            </h2>

            <p className="mt-7 leading-8 text-[#8A6F78]">
              Nirjara Beauty was created with a vision
              to provide professional beauty services
              in a welcoming and comfortable
              environment.
            </p>

            <p className="mt-5 leading-8 text-[#8A6F78]">
              Over the years, we have continued to grow
              while keeping personalized care at the
              heart of everything we do. From beauty
              services to professional training, our
              focus remains on quality, confidence and
              helping every client feel their best.
            </p>

            <div className="mt-9 border-l-2 border-[#E75480] pl-6">
              <p className="font-serif text-xl italic leading-8">
                "Beauty is not simply about how you
                look. It is about how you feel."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          MISSION / VISION / VALUES
      ========================================== */}
      <section className="bg-[#FFF5F8] px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#E75480]">
              What Defines Us
            </p>

            <h2 className="font-serif text-4xl md:text-5xl">
              The Heart of Nirjara
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* MISSION */}
            <div className="rounded-[30px] bg-white p-9 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#FCE7EF] text-xl text-[#E75480]">
                ♡
              </div>

              <h3 className="font-serif text-2xl">
                Our Mission
              </h3>

              <p className="mt-4 leading-7 text-[#8A6F78]">
                To provide professional, personalized
                beauty services that help every client
                feel confident, cared for and beautiful.
              </p>
            </div>

            {/* VISION */}
            <div className="rounded-[30px] bg-white p-9 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#FCE7EF] text-xl text-[#E75480]">
                ✦
              </div>

              <h3 className="font-serif text-2xl">
                Our Vision
              </h3>

              <p className="mt-4 leading-7 text-[#8A6F78]">
                To continue growing as a trusted beauty
                destination while inspiring future
                beauty professionals through education
                and practical training.
              </p>
            </div>

            {/* VALUES */}
            <div className="rounded-[30px] bg-white p-9 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#FCE7EF] text-xl text-[#E75480]">
                ✧
              </div>

              <h3 className="font-serif text-2xl">
                Our Values
              </h3>

              <p className="mt-4 leading-7 text-[#8A6F78]">
                Professionalism, creativity, respect,
                continuous learning and genuine care
                guide the experience we create for our
                clients and students.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          WHY NIRJARA
      ========================================== */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-14 lg:grid-cols-2">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#E75480]">
                Why Nirjara Beauty
              </p>

              <h2 className="font-serif text-4xl leading-tight md:text-5xl">
                More Than a
                <span className="italic text-[#E75480]">
                  {" "}
                  Beauty Salon
                </span>
              </h2>

              <p className="mt-6 max-w-xl leading-8 text-[#8A6F78]">
                We believe every beauty experience
                should feel personal. Our approach
                combines professional techniques,
                thoughtful consultation and attention
                to the individual needs of every
                client.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {[
                {
                  number: "01",
                  title: "Experienced Team",
                  text: "Professional beauty specialists committed to quality care.",
                },
                {
                  number: "02",
                  title: "Personalized Service",
                  text: "Beauty services tailored to individual needs and preferences.",
                },
                {
                  number: "03",
                  title: "Professional Academy",
                  text: "Practical beauty education designed for aspiring professionals.",
                },
                {
                  number: "04",
                  title: "Quality Experience",
                  text: "A welcoming environment focused on comfort, care and confidence.",
                },
              ].map((item) => (
                <div
                  key={item.number}
                  className="rounded-[25px] border border-[#F4D6E0] p-7"
                >
                  <span className="text-xs font-semibold tracking-widest text-[#E75480]">
                    {item.number}
                  </span>

                  <h3 className="mt-4 font-serif text-xl">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#8A6F78]">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          TEAM — FROM ADMIN / MONGODB
      ========================================== */}
      <section className="bg-[#FFF5F8] px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#E75480]">
              The People Behind Nirjara
            </p>

            <h2 className="font-serif text-4xl md:text-5xl">
              Meet Our Team
            </h2>

            <p className="mt-5 leading-7 text-[#8A6F78]">
              Meet the professionals who bring
              experience, creativity and care to
              Nirjara Beauty.
            </p>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="py-12 text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#FCE7EF] border-t-[#E75480]" />

              <p className="mt-4 text-sm text-[#8A6F78]">
                Loading our team...
              </p>
            </div>
          )}

          {/* ERROR */}
          {!loading && teamError && (
            <div className="py-10 text-center">
              <p className="text-[#8A6F78]">
                {teamError}
              </p>
            </div>
          )}

          {/* TEAM MEMBERS */}
          {!loading &&
            !teamError &&
            team.length > 0 && (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {team.map((member) => (
                  <article
                    key={member._id}
                    className="group overflow-hidden rounded-[28px] bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-lg"
                  >
                    {/* PHOTO */}
                    <div className="aspect-[4/5] overflow-hidden bg-[#FCE7EF]">
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={`${member.name} - ${member.designation}`}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="font-serif text-6xl text-[#E75480]">
                            {member.name
                              .charAt(0)
                              .toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* MEMBER DETAILS */}
                    <div className="p-6 text-center">
                      <h3 className="font-serif text-2xl">
                        {member.name}
                      </h3>

                      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#E75480]">
                        {member.designation}
                      </p>

                      {member.bio && (
                        <p className="mt-4 text-sm leading-6 text-[#8A6F78]">
                          {member.bio}
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}

          {/* NO TEAM MEMBERS */}
          {!loading &&
            !teamError &&
            team.length === 0 && (
              <p className="py-10 text-center text-[#8A6F78]">
                Team information will be available soon.
              </p>
            )}
        </div>
      </section>

      {/* ==========================================
          FINAL CTA
      ========================================== */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl rounded-[40px] bg-[#3A2A2F] px-8 py-16 text-center text-white md:px-16 md:py-20">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-[#F6A9C0]">
            Experience Nirjara
          </p>

          <h2 className="mx-auto max-w-3xl font-serif text-4xl leading-tight md:text-5xl">
            Your Beauty Journey
            <span className="block italic text-[#F6A9C0]">
              Starts Here
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl leading-7 text-white/70">
            Discover professional beauty services,
            personalized care and an experience
            designed around you.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <a
              href="/booking"
              className="rounded-full bg-[#E75480] px-8 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-white transition hover:opacity-90"
            >
              Book Appointment
            </a>

            <a
              href="/services"
              className="rounded-full border border-white/30 px-8 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-white hover:text-[#3A2A2F]"
            >
              Explore Services
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}