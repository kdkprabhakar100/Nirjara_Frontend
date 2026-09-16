import { useEffect, useState } from "react";
type Blog = {
  _id: string;
  title: string;
  category: string;
  description: string;
  content: string;
  image?: string;
  readTime: string;
};

export default function Blog() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/blogs`)
      .then((res) => res.json())
      .then((data) => setBlogs(data));
  }, []);

  return (
    <main className="min-h-screen bg-[#FFF5F8] px-6 pb-24 pt-36 text-[#3A2A2F] md:px-12">
      <section className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="text-xs uppercase tracking-[4px] text-[#E75480]">
            Our Blog
          </p>

          <h1 className="mt-4 font-serif text-6xl font-light">
            Beauty <span className="italic text-[#E75480]">Insights</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl leading-8 text-[#8A6F78]">
            Explore expert tips, trends, and guides from Nirjara Beauty.
          </p>

          <div className="mx-auto mt-8 h-[1px] w-20 bg-[#E75480]/50" />
        </div>

        {selectedBlog && (
          <div className="mb-12 rounded-3xl bg-white p-8 shadow-sm">
            {selectedBlog.image && (
              <img
                src={selectedBlog.image}
                alt={selectedBlog.title}
                className="mb-6 h-72 w-full rounded-2xl object-cover"
              />
            )}

            <p className="text-xs uppercase tracking-[2px] text-[#E75480]">
              {selectedBlog.category}
            </p>

            <h2 className="mt-3 font-serif text-4xl text-[#3A2A2F]">
              {selectedBlog.title}
            </h2>

            <p className="mt-2 text-xs text-[#8A6F78]">
              {selectedBlog.readTime}
            </p>

            <p className="mt-6 whitespace-pre-line leading-8 text-[#8A6F78]">
              {selectedBlog.content}
            </p>

            <button
              onClick={() => setSelectedBlog(null)}
              className="mt-6 rounded-full border border-[#E75480] px-5 py-2 text-xs text-[#E75480]"
            >
              Close
            </button>
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-3">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="overflow-hidden rounded-3xl bg-white shadow-sm"
            >
              {blog.image && (
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="h-48 w-full object-cover"
                />
              )}

              <div className="p-6">
                <p className="text-xs uppercase tracking-[2px] text-[#E75480]">
                  {blog.category}
                </p>

                <h2 className="mt-2 font-serif text-2xl text-[#3A2A2F]">
                  {blog.title}
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#8A6F78]">
                  {blog.description}
                </p>

                <p className="mt-3 text-xs text-[#8A6F78]">
                  {blog.readTime}
                </p>

                <button
                  onClick={() => {
                    setSelectedBlog(blog);
                    window.scrollTo(0, 0);
                  }}
                  className="mt-5 rounded-full bg-[#E75480] px-5 py-2 text-xs text-white"
                >
                  Read More
                </button>
              </div>
            </div>
          ))}

          {blogs.length === 0 && (
            <p className="col-span-3 text-center text-[#8A6F78]">
              No blogs available.
            </p>
          )}
        </div>

      </section>

    </main>
  );
}