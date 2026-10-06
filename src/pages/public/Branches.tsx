import { useEffect, useState } from "react";
import BranchCard from "../../components/BranchCard";
import { useNavigate } from "react-router-dom";
import SEO from "../../components/SEO";

// Managed in the admin panel (Branches).
type Branch = {
  _id: string;
  name: string;
  label?: string;
  address?: string;
  phone?: string;
  openingHours?: string;
  mapUrl?: string;
};

export default function Branches() {
  const navigate = useNavigate();
  const BRANCHES_SEO = {
      title: "Nirjara Beauty Branches | Beauty Salon in Nepal",
      description: "Find Nirjara Beauty branches near you and discover professional salon, beauty and customer care services.",
      keywords: "Nirjara Beauty branches, beauty salon Kathmandu, beauty salon Chitwan, beauty parlour Nepal, Nirjara Beauty locations",
      canonical: "/branches",
      image: "/images/nirjara-og.jpg",
      type: "website"

  };

  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadBranches = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/branches`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Unable to load branches.");
        }

        const data = await response.json();

        setBranches(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        console.error("BRANCHES ERROR:", err);
        setError("We couldn't load our branches right now. Please try again shortly.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadBranches();

    return () => controller.abort();
  }, []);

  return (
    <>
    <SEO
      title={BRANCHES_SEO.title}
      description={BRANCHES_SEO.description}
      keywords={BRANCHES_SEO.keywords}
      canonical={BRANCHES_SEO.canonical}
      image={BRANCHES_SEO.image}
      type= "website"
    />
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

        {loading && (
          <div className="flex items-center justify-center gap-3 py-16">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#E75480]/20 border-t-[#E75480]" />
            <span className="text-sm text-[#8A6F78]">Loading branches...</span>
          </div>
        )}

        {!loading && error && (
          <p className="mx-auto max-w-md rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-center text-sm text-red-600">
            {error}
          </p>
        )}

        {!loading && !error && branches.length === 0 && (
          <p className="text-center text-sm text-[#8A6F78]">
            Our branches will be listed here soon.
          </p>
        )}

        {!loading && branches.length > 0 && (
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
            {branches.map((branch, index) => (
              <BranchCard
                key={branch._id}
                number={String(index + 1).padStart(2, "0")}
                name={branch.name}
                tag={branch.label || undefined}
                address={branch.address ?? ""}
                hours={branch.openingHours ?? ""}
                phone={branch.phone ?? ""}
                mapUrl={branch.mapUrl || undefined}
              />
            ))}
          </div>
        )}

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
    </>
  );
}
