import { useEffect, useState } from "react";

type Service = {
  _id: string;
  title: string;
};

type Course = {
  _id: string;
  title: string;
};

const branches = [{ name: "Teku Branch" }, { name: "Chabahil Branch" }];

export default function Booking() {
  const [services, setServices] = useState<Service[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  const [type, setType] = useState("service");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [branch, setBranch] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/services`)
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch((err) => console.error("Services fetch error:", err));

    fetch(`${import.meta.env.VITE_API_URL}/api/courses`)
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((err) => console.error("Courses fetch error:", err));

    const savedType = localStorage.getItem("bookingType");
    const savedCourse = localStorage.getItem("selectedCourse");

    if (savedType === "course") setType("course");
    if (savedCourse) setSelectedItem(savedCourse);

    localStorage.removeItem("bookingType");
    localStorage.removeItem("selectedCourse");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          email,
          type,
          service: type === "service" ? selectedItem : "",
          course: type === "course" ? selectedItem : "",
          branch,
          date,
          time,
        }),
      });

      if (!res.ok) {
        alert("Booking failed. Please try again.");
        return;
      }

      alert(
        type === "service"
          ? "Service booking submitted successfully!"
          : "Course enrollment submitted successfully!"
      );

      setName("");
      setPhone("");
      setEmail("");
      setSelectedItem("");
      setBranch("");
      setDate("");
      setTime("");
      setType("service");
    } catch (error) {
      console.error("Booking submit error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const items = type === "service" ? services : courses;

  return (
    <main className="min-h-screen bg-[#FFF5F8] px-6 pb-24 pt-36 text-[#3A2A2F] md:px-12">
      <section className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="text-xs uppercase tracking-[4px] text-[#E75480]">
            Book Now
          </p>

          <h1 className="mt-4 font-serif text-6xl font-light">
            Book or <span className="italic text-[#E75480]">Enroll</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl leading-8 text-[#8A6F78]">
            Book a salon service or enroll in a professional academy course.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-2xl rounded-3xl bg-white p-8 shadow-sm"
        >
          <div className="grid gap-5">
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setSelectedItem("");
              }}
              className="rounded-xl border border-[#E75480]/20 bg-[#FFF5F8] px-4 py-3 outline-none"
            >
              <option value="service">Service Booking</option>
              <option value="course">Course Enrollment</option>
            </select>

            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="rounded-xl border border-[#E75480]/20 bg-[#FFF5F8] px-4 py-3 outline-none"
            />

            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="rounded-xl border border-[#E75480]/20 bg-[#FFF5F8] px-4 py-3 outline-none"
            />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-xl border border-[#E75480]/20 bg-[#FFF5F8] px-4 py-3 outline-none"
            />

            <select
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
              required
              className="rounded-xl border border-[#E75480]/20 bg-[#FFF5F8] px-4 py-3 outline-none"
            >
              <option value="">
                {type === "service"
                  ? "Select Salon Service"
                  : "Select Academy Course"}
              </option>

              {items.map((item) => (
                <option key={item._id} value={item.title}>
                  {item.title}
                </option>
              ))}
            </select>

            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              required
              className="rounded-xl border border-[#E75480]/20 bg-[#FFF5F8] px-4 py-3 outline-none"
            >
              <option value="">Select Branch</option>
              {branches.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>

            <div className="grid gap-5 md:grid-cols-2">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="rounded-xl border border-[#E75480]/20 bg-[#FFF5F8] px-4 py-3 outline-none"
              />

              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="rounded-xl border border-[#E75480]/20 bg-[#FFF5F8] px-4 py-3 outline-none"
              />
            </div>

            <button
              disabled={loading}
              className="rounded-full bg-[#E75480] px-8 py-4 text-xs font-medium uppercase tracking-[2px] text-white disabled:opacity-60"
            >
              {loading
                ? "Submitting..."
                : type === "service"
                ? "Confirm Booking"
                : "Confirm Enrollment"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}