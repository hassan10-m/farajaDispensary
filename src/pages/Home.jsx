import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-page">
      {/* Top banner */}
      <header className="home-banner">
        <h1>FARAJA DISPENSARY</h1>
        <p>Your Health, Our Priority</p>
      </header>

      {/* Nav bar */}
      <nav className="home-nav">
        <a href="#home">Home</a>
        <a href="#about">About Us</a>
        <a href="#services">Services</a>
        <a href="#contact">Contact</a>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </nav>

      {/* Hero */}
      <section id="home" className="home-hero">
        <h2>Welcome to Faraja Dispensary</h2>
        <p>
          Faraja Dispensary provides quality healthcare services to our
          patients in a safe and friendly environment.
        </p>
        <Link to="/register" className="home-cta">
          Register Now
        </Link>
      </section>

      {/* About */}
      <section id="about" className="home-about">
        <h3>About Faraja Dispensary</h3>
        <p>
          Faraja Dispensary is committed to providing reliable, affordable
          and accessible healthcare services to the community.
        </p>
      </section>
    </div>
  );
}
