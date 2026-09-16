export default function WhatsAppButton() {
  const phoneNumber = "9851097472"; // replace with Nirjara WhatsApp number

  const message = encodeURIComponent(
    "Hello Nirjara Beauty, I want to ask about booking/services."
  );

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-2xl shadow-lg transition hover:scale-110"
    >
      💬
    </a>
  );
}