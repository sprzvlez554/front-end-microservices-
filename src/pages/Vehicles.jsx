import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { onGetProducts } from "../store/actions";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { container, pillActive, pillIdle, focusRing } from "../ui";

const dmSans = { fontFamily: "'DM Sans', sans-serif", fontWeight: 400, letterSpacing: "-0.05em" };
const inter = { fontFamily: "'Inter', sans-serif" };

const MARQUEE_ITEMS = [
  "SEDÁN",
  "SUV",
  "PICKUP",
  "SPORT",
  "HATCHBACK",
  "GARANTÍA 12 MESES",
  "PERITAJE 150 PUNTOS",
  "HISTORIAL VERIFICADO",
  "+1000 CLIENTES",
];

const Vehicles = () => {
  const { categories, products } = useAppSelector((state) => state.shoppingReducer);
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("all");

  const query = (searchParams.get("q") || "").trim().toLowerCase();

  useEffect(() => {
    dispatch(onGetProducts());
  }, [dispatch]);

  const countFor = useMemo(() => {
    const counts = { all: products.length };
    if (Array.isArray(categories)) {
      categories.forEach((cat) => {
        counts[cat] = products.filter((item) => item.type === cat).length;
      });
    }
    return counts;
  }, [categories, products]);

  const filteredProducts = useMemo(() => {
    const byCategory =
      activeCategory === "all"
        ? products
        : products.filter((item) => item.type === activeCategory);
    if (!query) return byCategory;
    return byCategory.filter((item) =>
      String(item.name || "").toLowerCase().includes(query)
    );
  }, [products, activeCategory, query]);

  const pills = ["all", ...(Array.isArray(categories) ? categories : [])];

  const selectCategory = (category) => {
    setActiveCategory(category);
    if (query) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("q");
      setSearchParams(params);
    }
  };

  return (
    <div className="min-h-screen bg-cream overflow-hidden">
      <section className="relative bg-ink overflow-hidden">
        <div aria-hidden="true" className="absolute -top-32 -left-24 w-[480px] h-[480px] rounded-full bg-accent/25 blur-[120px]" />
        <div aria-hidden="true" className="absolute top-40 -right-32 w-[520px] h-[520px] rounded-full bg-fuchsia-500/25 blur-[130px]" />
        <div aria-hidden="true" className="absolute bottom-0 left-1/3 w-[420px] h-[420px] rounded-full bg-cyan-400/20 blur-[120px]" />

        <div className={`${container} relative py-16 sm:py-20`}>
          <p className="inline-flex items-center gap-2 text-sm font-medium text-accent bg-accent/10 border border-accent/30 rounded-full px-4 py-1.5" style={inter}>
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" aria-hidden="true" />
            {query ? "Resultados de búsqueda" : "Catálogo certificado y verificado"}
          </p>

          <h1 className="mt-6 text-[clamp(2.4rem,7vw,5.5rem)] leading-[0.95]" style={{ ...dmSans, letterSpacing: "-0.05em" }}>
            <span className="text-white block">Nuestros</span>
            <span className="bg-gradient-to-r from-accent via-pink-400 to-cyan-400 bg-clip-text text-transparent block">
              Vehículos
            </span>
          </h1>

          <p className="mt-6 max-w-3xl text-white/70 text-base sm:text-lg" style={inter}>
            {query ? (
              <>
                Resultados para <span className="text-white font-medium">"{query}"</span>. Todo el catálogo con historial verificado y garantía incluida.
              </>
            ) : (
              "Encuentra el vehículo ideal para ti, con historial verificado y garantía incluida."
            )}
          </p>
        </div>
      </section>

      <div aria-hidden="true" className="relative -rotate-1 bg-gradient-to-r from-accent via-amber-400 to-accent py-3 overflow-hidden">
        <div className="marquee-track flex gap-10 whitespace-nowrap w-max">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-10 text-ink font-bold tracking-wide text-sm"
              style={{ ...dmSans, textTransform: "uppercase" }}
            >
              {item}
              <span className="w-2 h-2 rounded-full bg-ink/70" />
            </span>
          ))}
        </div>
      </div>

      {!query && (
        <div className={`${container} flex flex-wrap gap-2 pt-8`}>
          {pills.map((cat) => (
            <button
              key={cat}
              onClick={() => selectCategory(cat)}
              aria-pressed={activeCategory === cat}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${focusRing} ${
                activeCategory === cat ? pillActive : pillIdle
              }`}
              style={inter}
            >
              {cat === "all" ? "Todos" : cat}
              <span
                className={`ml-2 text-xs ${
                  activeCategory === cat ? "text-accent" : "text-black/40"
                }`}
              >
                {countFor[cat] ?? 0}
              </span>
            </button>
          ))}
        </div>
      )}

      <div className={`${container} pt-8 pb-20`}>
        {products.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl bg-white border border-black/5 overflow-hidden"
              >
                <div className="aspect-[4/3] bg-paper" />
                <div className="p-5 space-y-3">
                  <div className="h-4 w-2/3 rounded bg-paper" />
                  <div className="h-3 w-full rounded bg-paper" />
                  <div className="h-5 w-1/3 rounded bg-paper" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((item) => (
              <ProductCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <p className="text-black/50 text-center py-20" style={inter}>
            No encontramos vehículos con esos criterios.
          </p>
        )}
      </div>
    </div>
  );
};

export { Vehicles };