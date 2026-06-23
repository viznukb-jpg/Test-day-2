import Link from "next/link";

export function HomeSection() {
  return (
    <main className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden rounded-4xl bg-linear-to-br from-[#f0f4ff] to-[#e0e7ff] p-16 shadow-[0_8px_32px_rgba(0,0,0,0.1)] backdrop-blur-md">
      <div className="top-[-10% `h-75 animate-float absolute right-[-10%] -z-10 w-75 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8),transparent)] blur-[100px]" />

      <section className="z-10 text-center">
        <h1 className="animate-fadeInUp mb-8 bg-linear-to-br from-indigo-600 to-pink-500 bg-clip-text text-[8rem] font-black text-transparent drop-shadow-[0_6px_12px_rgba(0,0,0,0.3)]">
          Welcome to the Booking App
        </h1>
        <p className="mx-auto mb-12 max-w-200 animate-[fadeInUp_1.2s_ease-out] text-[3rem] leading-relaxed text-gray-600">
          Manage your rooms effortlessly with a modern, premium interface.
        </p>
        <Link
          href="/login"
          className="inline-block animate-[fadeInUp_1.4s_ease-out] cursor-pointer rounded-xl bg-linear-to-br from-pink-500 to-indigo-600 px-12 py-6 text-[2rem] text-white shadow-[0_4px_12px_rgba(0,0,0,0.2)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(0,0,0,0.3)]"
        >
          Explore Rooms
        </Link>
      </section>
    </main>
  );
}
