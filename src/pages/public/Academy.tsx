import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Course = {
  _id: string;
  title: string;
  description: string;
  duration: string;
  fee: string;
  certificate: string;
  image?: string;
};

export default function Academy() {
  const [courses, setCourses] = useState<Course[]>([]);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/courses`);
    const data = await res.json();
    setCourses(data);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <main className="min-h-screen bg-[#FFF5F8] px-6 pb-24 pt-36 text-[#3A2A2F] md:px-12">
      <section className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="text-xs uppercase tracking-[4px] text-[#E75480]">
            Our Academy
          </p>

          <h1 className="mt-4 font-serif text-6xl font-light">
            Beauty <span className="italic text-[#E75480]">Courses</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl leading-8 text-[#8A6F78]">
            Learn from industry experts and build your career in beauty with
            professional certification.
          </p>

          <div className="mx-auto mt-8 h-[1px] w-20 bg-[#E75480]/50" />
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {courses.map((course) => (
            <div
              key={course._id}
              className="rounded-3xl bg-white p-6 shadow-sm"
            >
              {course.image && (
                <img
                  src={course.image}
                  alt={course.title}
                  className="mb-5 h-44 w-full rounded-2xl object-cover"
                />
              )}

              <h2 className="font-serif text-2xl text-[#E75480]">
                {course.title}
              </h2>

              <p className="mt-3 text-sm text-[#8A6F78]">
                {course.description}
              </p>

              <div className="mt-4 space-y-1 text-sm text-[#8A6F78]">
                <p>
                  <strong>Duration:</strong> {course.duration}
                </p>
                <p>
                  <strong>Fee:</strong> {course.fee}
                </p>
                <p>
                  <strong>Certificate:</strong> {course.certificate}
                </p>
              </div>

              <button
                onClick={() => {
                  localStorage.setItem("bookingType", "course");
                  localStorage.setItem("selectedCourse", course.title);
                  navigate("/booking");
                }}
                className="mt-6 w-full rounded-full bg-[#E75480] px-6 py-3 text-xs uppercase tracking-[2px] text-white"
              >
                Enroll Now
              </button>
            </div>
          ))}

          {courses.length === 0 && (
            <p className="col-span-3 text-center text-[#8A6F78]">
              No courses available yet.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}