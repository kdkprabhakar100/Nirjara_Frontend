type CourseCardProps = {
  title: string;
  description: string;
  duration: string;
  fee: string;
  certificate: string;
};

export default function CourseCard({
  title,
  description,
  duration,
  fee,
  certificate,
}: CourseCardProps) {
  return (
    <div className="rounded-3xl border border-[#E75480]/10 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#E75480]/30 hover:shadow-xl">
      <h3 className="font-serif text-3xl text-[#3A2A2F]">{title}</h3>

      <p className="mt-4 text-sm leading-7 text-[#8A6F78]">{description}</p>

      <div className="mt-6 rounded-full bg-[#FCE7EF] px-5 py-3 text-xs uppercase tracking-[2px] text-[#E75480]">
        {duration} | {fee} | {certificate}
      </div>
    </div>
  );
}