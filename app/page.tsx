import Link from "next/link";

export default function Home() {
  return (
    <main className="home-container">
      <section className="home-intro">
        <h1 className="home-title">Welcome to the Booking App</h1>
        <p className="home-subtitle">Manage your rooms effortlessly with a modern, premium interface.</p>
        <Link href="/login" className="home-cta">Explore Rooms</Link>
      </section>
    </main>
  );
}
