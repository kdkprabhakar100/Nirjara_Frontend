type BlogCardProps = {
  title: string;
  category: string;
  description: string;
  date: string;
  readTime: string;
  icon: string;
};

export default function BlogCard({
  title,
  category,
  description,
  date,
  readTime,
  icon,
}: BlogCardProps) {
  return (
    <div className="group overflow-hidden rounded-3xl border border-[#E75480]/10 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#E75480]/30 hover:shadow-xl">
      <div className="flex h-44 items-center justify-center bg-[#FCE7EF] text-5xl text-[#E75480]">
        {icon}
      </div>

      <div className="p-7">
        <p className="text-xs uppercase tracking-[2px] text-[#E75480]">
          {category}
        </p>

        <h3 className="mt-3 font-serif text-2xl text-[#3A2A2F]">{title}</h3>

        <p className="mt-3 text-sm leading-7 text-[#8A6F78]">
          {description}
        </p>

        <p className="mt-6 text-xs text-[#8A6F78]/70">
          {date} · {readTime}
        </p>
      </div>
    </div>
  );
}