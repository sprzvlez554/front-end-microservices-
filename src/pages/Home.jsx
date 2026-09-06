import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  ArrowUpRight,
  ShieldCheck,
  BadgeCheck,
  Wrench,
  Gauge,
  Star,
  Quote,
} from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import { onGetProducts } from "../store/actions";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { container } from "../ui";

const PRODUCT_IMAGE =
  "https://www.freeiconspng.com/uploads/red-sports-car-png-1.png";

const NAV_LINKS = [
  { label: "Vehículos", to: "/vehicles" },
  { label: "Destacados", href: "#destacados" },
  { label: "Beneficios", href: "#beneficios" },
  { label: "Testimonios", href: "#testimonios" },
];

const MARQUEE_ITEMS = [
  "SEDÁN",
  "SUV",
  "PICKUP",
  "SPORT",
  "GARANTÍA 12 MESES",
  "PERITAJE 150 PUNTOS",
  "HISTORIAL VERIFICADO",
  "HATCHBACK",
  "+1000 CLIENTES",
];

const CAROUSEL_CARDS = [
  {
    icon: ShieldCheck,
    bg: "bg-accent",
    text: "Garantía mecánica de 12 meses en cada vehículo.",
  },
  {
    icon: BadgeCheck,
    bg: "bg-emerald-400",
    text: "Peritaje certificado de 150 puntos antes de la entrega.",
  },
  {
    icon: Wrench,
    bg: "bg-cyan-400",
    text: "Primer mantenimiento incluido en nuestros talleres.",
  },
  {
    icon: Gauge,
    bg: "bg-fuchsia-400",
    text: "Historial de kilometraje verificado y sin reportes.",
  },
];

const TESTIMONIALS = [
  {
    name: "Laura Gómez",
    role: "Compró su Sedán Ejecutivo",
    img: "https://i.pravatar.cc/120?img=47",
    gradient: "from-accent via-amber-400 to-orange-400",
    text: "El proceso fue transparente de principio a fin. El vehículo llegó impecable y con todo el historial a la mano. 100% recomendados.",
  },
  {
    name: "Andrés Vidal",
    role: "Compró su SUV Familiar",
    img: "https://i.pravatar.cc/120?img=12",
    gradient: "from-cyan-400 via-teal-400 to-emerald-400",
    text: "Me acompañaron en cada paso, hasta la entrega. La garantía de 12 meses me dio la tranquilidad que buscaba para mi familia.",
  },
  {
    name: "Valentina Ríos",
    role: "Compró su Hatchback Urbano",
    img: "https://i.pravatar.cc/120?img=32",
    gradient: "from-fuchsia-400 via-pink-400 to-rose-400",
    text: "Encontrar un auto certificado con financiamiento fácil fue un alivio. El peritaje de 150 puntos me dejó dormir tranquila.",
  },
];

const CAROUSEL_INTERVAL = 5000;

const dmSans = { fontFamily: "'DM Sans', sans-serif" };
const inter = { fontFamily: "'Inter', sans-serif" };

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-md";

const Stars = () => (
  <div className="flex gap-0.5" aria-label="5 de 5 estrellas">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} size={16} className="fill-accent text-accent" aria-hidden="true" />
    ))}
  </div>
);

const Home = () => {
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((state) => state.shoppingReducer);

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCard, setActiveCard] = useState(0);
  const [carouselPaused, setCarouselPaused] = useState(false);
  const menuButtonRef = useRef(null);
  const wasMenuOpen = useRef(false);

  useEffect(() => {
    dispatch(onGetProducts());
  }, [dispatch]);

  useEffect(() => {
    if (carouselPaused) return;
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % CAROUSEL_CARDS.length);
    }, CAROUSEL_INTERVAL);
    return () => clearInterval(interval);
  }, [carouselPaused]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

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

  const featured = Array.isArray(products) ? products.slice(0, 4) : [];

  const renderNavLink = (link, className, onClick) =>
    link.to ? (
      <Link key={link.label} to={link.to} className={className} onClick={onClick}>
        {link.label}
      </Link>
    ) : (
      <a key={link.label} href={link.href} className={className} onClick={onClick}>
        {link.label}
      </a>
    );

  return (
    <div className="min-h-screen relative overflow-hidden bg-ink">
      {/* ============ NAVBAR ============ */}
      <header className="relative z-30">
        <nav className={`${container} flex items-center justify-between py-5`}>
          <Link
            to="/"
            className={`flex items-center gap-2.5 text-white text-xl ${focusRing}`}
            style={{ ...dmSans, fontWeight: 500, letterSpacing: "-0.05em" }}
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent text-ink">
              <Gauge size={20} aria-hidden="true" />
            </span>
            Autos<span className="text-accent">Enfasis</span>-I
          </Link>

          <div className="hidden lg:flex items-center gap-8 text-white/80 text-sm" style={inter}>
            {NAV_LINKS.map((link) =>
              renderNavLink(link, `hover:text-white transition-colors ${focusRing}`)
            )}
            <Link
              to="/vehicles"
              className="inline-flex items-center gap-1.5 bg-accent text-ink h-10 px-4 rounded-lg hover:bg-accent/90 transition-colors font-medium"
              style={inter}
            >
              Explorar
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            className="lg:hidden text-white p-2 -mr-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center gap-8"
        >
          <button
            type="button"
            aria-label="Cerrar menú"
            className="absolute top-5 right-5 text-white p-2"
            onClick={closeMenu}
          >
            <X size={28} />
          </button>
          <nav
            aria-label="Menú móvil"
            className="flex flex-col items-center gap-6"
            style={dmSans}
          >
            {NAV_LINKS.map((link) =>
              renderNavLink(link, `text-2xl text-white ${focusRing}`, closeMenu)
            )}
            <Link
              to="/vehicles"
              onClick={closeMenu}
              className="mt-2 inline-flex items-center gap-2 bg-accent text-ink h-12 px-6 rounded-lg font-medium"
              style={inter}
            >
              Explorar vehículos
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </nav>
        </div>
      )}

      {/* ============ HERO ============ */}
      <section className="relative z-10">
        {/* Blobs de color */}
        <div aria-hidden="true" className="absolute -top-32 -left-24 w-[480px] h-[480px] rounded-full bg-accent/25 blur-[120px]" />
        <div aria-hidden="true" className="absolute top-40 -right-32 w-[520px] h-[520px] rounded-full bg-fuchsia-500/25 blur-[130px]" />
        <div aria-hidden="true" className="absolute bottom-0 left-1/3 w-[420px] h-[420px] rounded-full bg-cyan-400/20 blur-[120px]" />

        <div className={`${container} relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-10 lg:pt-16 pb-20`}>
          <div>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-accent bg-accent/10 border border-accent/30 rounded-full px-4 py-1.5" style={inter}>
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" aria-hidden="true" />
              Catálogo certificado y verificado
            </span>

            <h1 className="mt-6 text-[clamp(2.6rem,8vw,6rem)] leading-[0.95]" style={{ ...dmSans, fontWeight: 400, letterSpacing: "-0.05em" }}>
              <span className="text-white block">Adquiere tu</span>
              <span className="bg-gradient-to-r from-accent via-pink-400 to-cyan-400 bg-clip-text text-transparent block">
                vehículo de
              </span>
              <span className="text-white block">confianza</span>
            </h1>

            <p className="mt-6 max-w-[46ch] text-white/70 text-base sm:text-lg lg:text-xl" style={inter}>
              Vehículos certificados, con historial verificado y garantía incluida.
              Encuentra el que se ajusta a tu presupuesto.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                to="/vehicles"
                className="inline-flex items-center justify-center gap-2 bg-accent text-ink h-14 px-8 rounded-xl text-lg font-medium hover:bg-accent/90 transition-colors"
                style={inter}
              >
                Ver vehículos
                <ArrowUpRight size={20} aria-hidden="true" />
              </Link>
              <a
                href="#testimonios"
                className="inline-flex items-center justify-center bg-white/10 text-white border border-white/20 h-14 px-8 rounded-xl text-lg hover:bg-white/15 transition-colors"
                style={inter}
              >
                Ver testimonios
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/70" style={inter}>
              <span className="inline-flex items-center gap-2">
                <ShieldCheck size={17} className="text-accent" aria-hidden="true" />
                12 meses de garantía
              </span>
              <span className="inline-flex items-center gap-2">
                <BadgeCheck size={17} className="text-cyan-400" aria-hidden="true" />
                Peritaje 150 puntos
              </span>
              <span className="inline-flex items-center gap-2">
                <Gauge size={17} className="text-fuchsia-400" aria-hidden="true" />
                +1000 clientes
              </span>
            </div>
          </div>

          {/* Visual con el auto */}
          <div className="relative flex items-center justify-center">
            <div
              aria-hidden="true"
              className="absolute w-[360px] sm:w-[440px] h-[360px] sm:h-[440px] rounded-full bg-gradient-to-tr from-accent via-fuchsia-500 to-cyan-400 opacity-70 blur-2xl"
            />
            <div
              aria-hidden="true"
              className="relative w-[340px] sm:w-[420px] h-[340px] sm:h-[420px] rounded-full border border-white/15 bg-ink/60 overflow-hidden"
            >
              <img
                src={PRODUCT_IMAGE}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-contain drop-shadow-2xl"
              />
            </div>

            <div className="absolute top-2 left-0 sm:-left-2 animate-float bg-ink/80 backdrop-blur border border-white/15 rounded-xl px-4 py-3 flex items-center gap-3 shadow-2xl">
              <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent text-ink">
                <ShieldCheck size={18} aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-medium text-white" style={inter}>Garantía 12 meses</p>
                <p className="text-xs text-white/60" style={inter}>Cobertura incluida</p>
              </div>
            </div>

            <div className="absolute bottom-2 right-0 sm:-right-2 animate-float-delay bg-ink/80 backdrop-blur border border-white/15 rounded-xl px-4 py-3 flex items-center gap-3 shadow-2xl">
              <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-cyan-400 text-ink">
                <Gauge size={18} aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-medium text-white" style={inter}>Historial verificado</p>
                <p className="text-xs text-white/60" style={inter}>Sin reportes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ MARQUEE ============ */}
      <section aria-hidden="true" className="relative z-10 -rotate-1 bg-gradient-to-r from-accent via-amber-400 to-accent py-3 overflow-hidden">
        <div className="marquee-track flex gap-8 whitespace-nowrap w-max">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-8 text-ink font-bold tracking-wide text-sm"
              style={{ ...dmSans, textTransform: "uppercase" }}
            >
              {item}
              <span className="w-2 h-2 rounded-full bg-ink/70" />
            </span>
          ))}
        </div>
      </section>

      {/* ============ DESTACADOS ============ */}
      <section id="destacados" className="relative z-10 bg-cream py-20 sm:py-24">
        <div className={container}>
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-medium text-fuchsia-600 mb-2" style={inter}>
                <span className="h-px w-8 bg-fuchsia-500" aria-hidden="true" />
                Lo más pedido
              </p>
              <h2 className="text-3xl sm:text-5xl text-ink" style={{ ...dmSans, letterSpacing: "-0.05em" }}>
                Vehículos destacados
              </h2>
            </div>
            <a
              href="#beneficios"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-ink underline underline-offset-4 hover:text-black/60 transition-colors"
              style={inter}
            >
              Ver beneficios
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>

          {featured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((item) => (
                <ProductCard key={item._id} item={item} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-2xl bg-white border border-black/5 overflow-hidden">
                  <div className="aspect-[4/3] bg-paper" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 w-2/3 rounded bg-paper" />
                    <div className="h-3 w-full rounded bg-paper" />
                    <div className="h-5 w-1/3 rounded bg-paper" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============ BENEFICIOS ============ */}
      <section
        id="beneficios"
        aria-label="Beneficios"
        className="relative z-10 bg-ink py-20 sm:py-24"
      >
        <div className={container}>
          <p className="inline-flex items-center gap-2 text-sm font-medium text-cyan-300 mb-2" style={inter}>
            <span className="h-px w-8 bg-cyan-400" aria-hidden="true" />
            Por qué elegirnos
          </p>
          <h2 className="text-3xl sm:text-5xl text-white" style={{ ...dmSans, letterSpacing: "-0.05em" }}>
            Beneficios que suman
          </h2>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
            <article
              className="rounded-2xl bg-white/5 border border-white/10 p-8 sm:p-10"
              onMouseEnter={() => setCarouselPaused(true)}
              onMouseLeave={() => setCarouselPaused(false)}
              onFocus={() => setCarouselPaused(true)}
              onBlur={() => setCarouselPaused(false)}
            >
              <div className="relative flex items-center gap-5 min-h-[96px]" aria-live="polite">
                {CAROUSEL_CARDS.map((card, i) => {
                  const Icon = card.icon;
                  const isActive = i === activeCard;
                  return (
                    <div
                      key={card.text}
                      aria-hidden={!isActive}
                      className={`flex items-center gap-5 transition-all duration-700 ${
                        isActive
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-4 absolute inset-0 pointer-events-none"
                      }`}
                    >
                      <span
                        className={`shrink-0 rounded-2xl ${card.bg} text-ink flex items-center justify-center w-14 h-14`}
                      >
                        <Icon size={24} aria-hidden="true" />
                      </span>
                      <p className="text-white/90 text-lg sm:text-xl" style={inter}>
                        {card.text}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-2 mt-8">
                {CAROUSEL_CARDS.map((card, i) => (
                  <button
                    key={card.text}
                    type="button"
                    aria-label={`Ver beneficio ${i + 1} de ${CAROUSEL_CARDS.length}`}
                    aria-current={i === activeCard}
                    onClick={() => setActiveCard(i)}
                    className="h-6 flex-1 flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
                  >
                    <span
                      className={`h-1 w-full rounded-full transition-colors duration-500 ${
                        i === activeCard ? "bg-accent" : "bg-white/20"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </article>

            <article className="rounded-2xl bg-gradient-to-br from-accent via-amber-400 to-orange-400 p-8 sm:p-10 flex flex-col justify-between">
              <p className="text-5xl sm:text-6xl text-ink font-medium" style={dmSans}>
                +1000
              </p>
              <p className="text-ink/80 text-lg mt-3" style={inter}>
                Clientes que ya conducen su vehículo con nosotros sin sustos.
              </p>
              <Link
                to="/vehicles"
                className="mt-8 inline-flex items-center gap-2 bg-ink text-white h-12 px-6 rounded-xl font-medium hover:bg-ink/85 transition-colors w-fit"
                style={inter}
              >
                Cotiza hoy
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIOS ============ */}
      <section id="testimonios" className="relative z-10 bg-cream py-20 sm:py-24">
        <div className={container}>
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 text-sm font-medium text-accent mb-2" style={inter}>
              <span className="h-px w-8 bg-accent" aria-hidden="true" />
              Historias reales
            </p>
            <h2 className="text-3xl sm:text-5xl text-ink" style={{ ...dmSans, letterSpacing: "-0.05em" }}>
              Lo que dicen nuestros clientes
            </h2>
            <p className="mt-3 text-black/60 text-lg" style={inter}>
              Más de 1000 personas ya estrenaron su vehículo con nosotros.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, role, img, gradient, text }) => (
              <figure
                key={name}
                className="group relative bg-white rounded-2xl border border-black/5 shadow-sm p-6 sm:p-7 flex flex-col gap-5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div aria-hidden="true" className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${gradient}`} />
                <Quote
                  size={36}
                  className="text-accent rotate-180"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <blockquote className="text-black/75 leading-relaxed" style={inter}>
                  "{text}"
                </blockquote>
                <figcaption className="flex items-center gap-4 mt-auto pt-4 border-t border-black/5">
                  <img
                    src={img}
                    alt={name}
                    loading="lazy"
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-offset-2 ring-accent"
                  />
                  <div>
                    <p className="font-medium text-ink" style={dmSans}>
                      {name}
                    </p>
                    <p className="text-sm text-black/50" style={inter}>
                      {role}
                    </p>
                  </div>
                  <span className="ml-auto">
                    <Stars />
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA FINAL ============ */}
      <section className="relative z-10 py-20 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-ink via-fuchsia-900/40 to-ink" aria-hidden="true" />
        <div aria-hidden="true" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[420px] rounded-full bg-accent/20 blur-[140px]" />
        <div className={`${container} relative text-center`}>
          <h2 className="text-4xl sm:text-6xl text-white max-w-3xl mx-auto" style={{ ...dmSans, letterSpacing: "-0.05em" }}>
            Tu próximo vehículo te está{" "}
            <span className="bg-gradient-to-r from-accent via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              esperando
            </span>
          </h2>
          <p className="mt-5 text-white/70 text-lg max-w-xl mx-auto" style={inter}>
            Agenda una visita o cotiza en línea. Certificado, con garantía y listo para rodar.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/vehicles"
              className="inline-flex items-center gap-2 bg-accent text-ink h-14 px-8 rounded-xl text-lg font-medium hover:bg-accent/90 transition-colors"
              style={inter}
            >
              Explorar catálogo
              <ArrowUpRight size={20} aria-hidden="true" />
            </Link>
            <a
              href="#destacados"
              className="inline-flex items-center bg-white/10 text-white border border-white/20 h-14 px-8 rounded-xl text-lg hover:bg-white/15 transition-colors"
              style={inter}
            >
              Volver arriba
            </a>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="relative z-10 border-t border-white/10">
        <div className={`${container} py-8 flex flex-col sm:flex-row items-center justify-between gap-4`}>
          <Link
            to="/"
            className="flex items-center gap-2 text-white"
            style={{ ...dmSans, fontWeight: 500, letterSpacing: "-0.05em" }}
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent text-ink">
              <Gauge size={17} aria-hidden="true" />
            </span>
            Autos<span className="text-accent">Enfasis</span>-I
          </Link>
          <p className="text-sm text-white/50" style={inter}>
            © 2026 AutosEnfasis-I. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export { Home };