import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  ChevronRight,
  ShieldCheck,
  BadgeCheck,
  Gauge,
  ChevronLeft,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  onGetProductDetails,
  onAddToWishlist,
  onAddToCart,
  onRemoveFromWishlist,
  onRemoveFromCart,
} from "../store/actions";
import { container, card, btnPrimary, btnCircle, btnOutline, focusRing } from "../ui";

const dmSans = { fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.05em", fontWeight: 400 };
const inter = { fontFamily: "'Inter', sans-serif" };

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const { currentProduct } = useAppSelector((state) => state.shoppingReducer);
  const { wishlist, cart } = useAppSelector((state) => state.userReducer);

  useEffect(() => {
    if (id) {
      dispatch(onGetProductDetails(id));
    }
  }, [dispatch, id]);

  if (!currentProduct) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center" style={inter}>
        <div className="flex flex-col items-center gap-3 text-black/50">
          <span className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" aria-hidden="true" />
          <span>Cargando vehículo...</span>
        </div>
      </div>
    );
  }

  const { _id, banner, price, name, desc, type, available } = currentProduct;

  const cartEntry =
    Array.isArray(cart) && cart.find((item) => item?.product?._id === _id);

  const currentUnit = cartEntry ? Number(cartEntry?.unit ?? cartEntry?.quantity ?? 0) : 0;

  const addCart = () => {
    const newUnit = currentUnit + 1;
    dispatch(onAddToCart({ ...currentProduct, qty: newUnit }));
  };

  const removeCart = () => {
    if (currentUnit <= 0) return;
    const newUnit = currentUnit - 1;
    if (newUnit > 0) {
      dispatch(onAddToCart({ _id, qty: newUnit }));
    } else {
      dispatch(onRemoveFromCart(_id));
    }
  };

  const isWishlisted =
    Array.isArray(wishlist) && wishlist.some((item) => item?._id === _id);

  const total = Number(price || 0) * currentUnit;

  return (
    <div className="min-h-screen bg-cream relative overflow-hidden">
      <div aria-hidden="true" className="absolute -top-40 -right-32 w-[520px] h-[520px] rounded-full bg-accent/15 blur-[130px]" />
      <div aria-hidden="true" className="absolute bottom-0 -left-40 w-[420px] h-[420px] rounded-full bg-cyan-400/15 blur-[120px]" />

      <div className={`${container} relative py-8 sm:py-12`}>
        <nav aria-label="Migas de pan" className="flex items-center gap-2 text-sm text-black/50 mb-6" style={inter}>
          <Link to="/vehicles" className={`hover:text-ink transition-colors ${focusRing}`}>
            Vehículos
          </Link>
          <ChevronRight size={14} aria-hidden="true" />
          <span className="capitalize text-black/80">{type}</span>
          <ChevronRight size={14} aria-hidden="true" />
          <span className="text-ink truncate">{name}</span>
        </nav>

        <div className={`${card} overflow-hidden`}>
          <div aria-hidden="true" className="h-1.5 bg-gradient-to-r from-accent via-pink-400 to-cyan-400" />
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative bg-paper min-h-[320px]">
              <img
                src={banner}
                alt={name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {available ? (
                <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-emerald-500 text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-sm" style={inter}>
                  <span className="w-1.5 h-1.5 rounded-full bg-white" aria-hidden="true" />
                  Disponible
                </span>
              ) : (
                <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-sm" style={inter}>
                  No disponible
                </span>
              )}
            </div>

            <div className="p-6 sm:p-10 flex flex-col gap-5">
              <span className="inline-flex items-center gap-2 text-sm text-black/50" style={inter}>
                <span className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse" aria-hidden="true" />
                <span className="capitalize">{type}</span>
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl leading-[1.05] text-ink" style={dmSans}>
                {name}
              </h1>

              <p className="text-black/70 leading-relaxed" style={inter}>
                {desc}
              </p>

              <div className="flex items-end justify-between flex-wrap gap-3 border-y border-black/10 py-4">
                <div>
                  <p className="text-xs text-black/40 uppercase tracking-wide" style={inter}>
                    Precio
                  </p>
                  <p className="text-3xl sm:text-4xl font-bold text-ink" style={inter}>
                    ${Number(price || 0).toLocaleString()}
                  </p>
                </div>
                {currentUnit > 0 && (
                  <p className="text-sm text-black/50" style={inter}>
                    Subtotal:{" "}
                    <span className="font-semibold text-ink">${total.toLocaleString()}</span>
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {cartEntry || currentUnit > 0 ? (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className={btnCircle}
                      onClick={removeCart}
                      aria-label="Quitar uno"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="text-xl w-8 text-center font-medium" style={inter}>
                      {currentUnit}
                    </span>
                    <button
                      type="button"
                      className={btnCircle}
                      onClick={addCart}
                      aria-label="Agregar uno"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className={btnPrimary}
                    style={inter}
                    onClick={addCart}
                  >
                    <ShoppingCart size={18} />
                    Agregar al carrito
                  </button>
                )}

                <button
                  type="button"
                  aria-pressed={isWishlisted}
                  onClick={() =>
                    dispatch(
                      isWishlisted ? onRemoveFromWishlist(_id) : onAddToWishlist(currentProduct)
                    )
                  }
                  className={btnOutline}
                  style={inter}
                >
                  <Heart
                    size={18}
                    className={isWishlisted ? "fill-pink-500 text-pink-600" : ""}
                  />
                  {isWishlisted ? "En favoritos" : "Añadir a favoritos"}
                </button>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-1 text-sm text-black/60" style={inter}>
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck size={16} className="text-accent" aria-hidden="true" />
                  Garantía de 12 meses
                </span>
                <span className="inline-flex items-center gap-2">
                  <BadgeCheck size={16} className="text-emerald-500" aria-hidden="true" />
                  Peritaje de 150 puntos
                </span>
                <span className="inline-flex items-center gap-2">
                  <Gauge size={16} className="text-cyan-500" aria-hidden="true" />
                  Historial verificado
                </span>
              </div>
            </div>
          </div>
        </div>

        <Link
          to="/vehicles"
          className={`inline-flex items-center gap-2 mt-8 text-sm text-black/60 hover:text-ink transition-colors ${focusRing}`}
          style={inter}
        >
          <ChevronLeft size={16} aria-hidden="true" />
          Volver a vehículos
        </Link>
      </div>
    </div>
  );
};

export { ProductDetails };