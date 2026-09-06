import { useState, useCallback, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ShoppingBag, User, Gauge, Menu, X, Search } from "lucide-react";
import { btnDark } from "../ui";

const dmSans = { fontFamily: "'DM Sans', sans-serif", fontWeight: 500, letterSpacing: "-0.05em" };
const inter = { fontFamily: "'Inter', sans-serif" };

const NAV_LINKS = [
  { label: "Inicio", to: "/" },
  { label: "Vehículos", to: "/vehicles" },
  { label: "Mi cuenta", to: "/login" },
];

export const Header = () => {
  const { user, cart } = useSelector((state) => state.userReducer);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const menuButtonRef = useRef(null);
  const wasMenuOpen = useRef(false);

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const { token } = user;

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const cartCount = Array.isArray(cart)
    ? cart.reduce((sum, item) => sum + Number(item?.unit ?? item?.quantity ?? 0), 0)
    : 0;

  useEffect(() => {
    if (menuOpen) {
      wasMenuOpen.current = true;
      return;
    }
    if (wasMenuOpen.current) {
      wasMenuOpen.current = false;
      menuButtonRef.current?.focus();
    }
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") closeMenu();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen, closeMenu]);

  const submitSearch = (event) => {
    event.preventDefault();
    const trimmed = query.trim();
    setSearchOpen(false);
    setQuery("");
    navigate(trimmed ? `/vehicles?q=${encodeURIComponent(trimmed)}` : "/vehicles");
  };

  const navLink = (link) => {
    const active = pathname === link.to;
    return (
      <Link
        key={link.to}
        to={link.to}
        aria-current={active ? "page" : undefined}
        className={`relative text-sm transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md px-2 py-1 ${
          active ? "text-accent" : "text-white/80"
        }`}
        style={inter}
      >
        {link.label}
        {active && (
          <span
            className="absolute -bottom-1 left-2 right-2 h-0.5 rounded-full bg-accent"
            aria-hidden="true"
          />
        )}
      </Link>
    );
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-ink text-white border-b border-white/10">
        <div
          className="h-0.5 bg-gradient-to-r from-accent via-amber-400 to-accent"
          aria-hidden="true"
        />
        <nav className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 flex items-center justify-between gap-4 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              ref={menuButtonRef}
              type="button"
              className="lg:hidden flex items-center justify-center w-11 h-11 rounded-lg text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <Link
              to="/"
              className="flex items-center gap-2.5 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg"
              style={dmSans}
            >
              <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent text-ink shadow-sm">
                <Gauge size={20} aria-hidden="true" />
              </span>
              <span className="text-lg sm:text-xl truncate">
                Autos<span className="text-accent">Enfasis</span>-I
              </span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(navLink)}
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <div className="relative hidden sm:block">
              {searchOpen ? (
                <form
                  role="search"
                  onSubmit={submitSearch}
                  className="flex items-center gap-2 bg-white text-ink rounded-lg px-3 h-11"
                >
                  <Search size={18} className="text-black/40" aria-hidden="true" />
                  <input
                    autoFocus
                    type="search"
                    placeholder="Buscar vehículo..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-40 bg-transparent outline-none text-sm"
                    aria-label="Buscar vehículo"
                  />
                  <button type="submit" className="sr-only">Buscar</button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className="flex items-center justify-center w-11 h-11 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  aria-label="Buscar vehículo"
                >
                  <Search size={20} strokeWidth={1.5} />
                </button>
              )}
            </div>

            <Link
              to="/login"
              className="relative flex items-center justify-center w-11 h-11 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label={`Carrito con ${cartCount} vehículos`}
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-accent text-ink text-xs font-semibold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link to="/login" className={btnDark} style={inter}>
              <User size={18} strokeWidth={1.5} />
              <span className="hidden sm:inline">{token ? "Mi cuenta" : "Ingresar"}</span>
            </Link>
          </div>
        </nav>
      </header>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="lg:hidden fixed inset-0 z-50 bg-ink/95 backdrop-blur flex flex-col"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <span className="text-lg text-white" style={dmSans}>
              Menú
            </span>
            <button
              type="button"
              onClick={closeMenu}
              aria-label="Cerrar menú"
              className="flex items-center justify-center w-11 h-11 rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          <nav aria-label="Menú móvil" className="flex flex-col p-5 gap-1">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={closeMenu}
                  aria-current={active ? "page" : undefined}
                  className={`px-4 py-3 rounded-lg text-lg transition-colors ${
                    active
                      ? "bg-accent text-ink font-medium"
                      : "text-white/90 hover:bg-white/10"
                  }`}
                  style={inter}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <form
            role="search"
            onSubmit={submitSearch}
            className="mt-auto p-5 flex items-center gap-2 bg-white text-ink rounded-xl mx-5 mb-8"
          >
            <Search size={18} className="text-black/40 shrink-0" aria-hidden="true" />
            <input
              type="search"
              placeholder="Buscar vehículo..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent outline-none text-sm"
              aria-label="Buscar vehículo"
            />
            <button type="submit" className="text-sm font-medium text-ink">Buscar</button>
          </form>
        </div>
      )}
    </>
  );
};