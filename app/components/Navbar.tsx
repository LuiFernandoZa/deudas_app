import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="navbar">

      <Link
        href="/"
        className="navbarLogo"
      >
        4 STREETS
      </Link>

      <div className="navbarLinks">

        <Link href="/">
          Deudas
        </Link>

        <Link href="/calculadora">
          Calculadora
        </Link>

      </div>

    </nav>
  );
}