import BranchCard from "../../components/BranchCard";
import { branches } from "../../data/branches";
import { useNavigate } from "react-router-dom";

export default function Branches() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-[#FFF5F8] px-6 pb-24 pt-36 text-[#3A2A2F] md:px-12">
      <section className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="text-xs uppercase tracking-[4px] text-[#E75480]">
            Our Branches
          </p>

          <h1 className="mt-4 font-serif text-6xl font-light">
            Visit Our{" "}
            <span className="italic text-[#E75480]">Locations</span>
          </h1>

          <div className="mx-auto mt-8 h-[1px] w-20 bg-[#E75480]/50" />
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          {branches.map((branch) => (
            <BranchCard key={branch.name} {...branch} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <button
            onClick={() => navigate("/booking")}
            className="rounded-full bg-[#E75480] px-10 py-4 text-xs font-medium uppercase tracking-[2px] text-white shadow-lg transition hover:bg-[#C93D68]"
          >
            Book at a Branch
          </button>
        </div>
      </section>
    </main>
  );
}