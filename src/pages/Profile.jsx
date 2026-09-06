import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  ListOrdered,
  Gift,
  Car,
  Mail,
  Phone,
  LogOut,
  MapPin,
  Pencil,
  Trash2,
  PartyPopper,
  ShieldCheck,
  X,
} from "lucide-react";
import {
  onRemoveFromWishlist,
  onViewProfile,
  onAddToCart,
  onRemoveFromCart,
  onCreateAddress,
  onRemoveAddress,
  onPlaceOrder,
  onGetProducts,
  onLogout,
} from "../store/actions";
import { CartItem } from "../components/Cart-comp";
import { WishItem } from "../components/Wishlist-comp";
import { OrderItem } from "../components/Order-comp";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  container,
  page,
  card,
  input,
  btnDark,
  btnOutline,
  btnPrimary,
  focusRing,
} from "../ui";

const dmSans = { fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.03em" };
const inter = { fontFamily: "'Inter', sans-serif" };

const TABS = [
  { key: "cart", label: "Carrito", icon: ShoppingCart },
  { key: "wishlist", label: "Favoritos", icon: Heart },
  { key: "orders", label: "Pedidos", icon: ListOrdered },
];

const displayNameFrom = (email) => {
  if (!email) return "";
  return email
    .split("@")[0]
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const Profile = () => {
  const { user, profile, wishlist, cart, orders } = useAppSelector(
    (state) => state.userReducer
  );
  const { products } = useAppSelector((state) => state.shoppingReducer);
  const dispatch = useAppDispatch();

  const [activeTab, setActiveTab] = useState("cart");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

  const customerId =
    user.customer?._id ||
    user.customer?.id ||
    user._id ||
    user.id ||
    null;

  const hasToken = !!(user?.token || localStorage.getItem("token"));

  useEffect(() => {
    if (customerId || hasToken) {
      dispatch(onViewProfile());
    }

    if (products.length === 0) {
      dispatch(onGetProducts());
    }
  }, [customerId, hasToken, dispatch, products.length]);

  const onAdd = ({ _id, qty }) => {
    dispatch(onAddToCart({ _id, qty }));
  };

  const onRemove = ({ _id }) => {
    dispatch(onRemoveFromCart(_id));
  };

  const removeFromWishlist = (_id) => {
    dispatch(onRemoveFromWishlist(_id));
  };

  const addNewAddress = () => {
    dispatch(onCreateAddress({ street, postalCode, city, country }));
    setShowAddressForm(false);
  };

  const removeAddress = () => {
    dispatch(onRemoveAddress());
    setShowAddressForm(false);
  };

  const onTapPlaceOrder = async () => {
    const placedItems = (Array.isArray(cart) ? cart : [])
      .filter((item) => item?.product)
      .map((item) => {
        const unit = Number(item?.unit ?? item?.quantity ?? 0);
        const price = Number(item?.product?.price ?? 0);
        return {
          name: item.product.name,
          banner: item.product.banner,
          unit,
          price,
          subtotal: unit * price,
        };
      });

    const created = await dispatch(onPlaceOrder());

    if (created) {
      setLastOrder({ ...created, items: placedItems });
    }
  };

  const closeOrder = () => setLastOrder(null);

  useEffect(() => {
    if (!lastOrder) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") closeOrder();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [lastOrder]);

  const emptyState = (message) => (
    <div
      className="flex flex-col items-center justify-center gap-4 h-64 text-black/40"
      style={inter}
    >
      <p>{message}</p>
      <Link
        to="/vehicles"
        className={`${btnOutline}`}
      >
        <Car size={16} aria-hidden="true" />
        Explorar vehículos
      </Link>
    </div>
  );

  const displayName = displayNameFrom(profile?.email);
  const initial = (displayName || profile?.email || "?").charAt(0).toUpperCase();

  const totalAmount = Array.isArray(cart)
    ? cart.reduce((sum, item) => {
        const unit = Number(item?.unit ?? item?.quantity ?? 0);
        const price = Number(item?.product?.price ?? item?.price ?? 0);
        return sum + unit * price;
      }, 0)
    : 0;

  const stats = [
    { label: "En el carrito", value: Array.isArray(cart) ? cart.reduce((s, i) => s + Number(i?.unit ?? i?.quantity ?? 0), 0) : 0, icon: ShoppingCart, chip: "bg-accent text-ink" },
    { label: "Favoritos", value: Array.isArray(wishlist) ? wishlist.length : 0, icon: Heart, chip: "bg-fuchsia-400 text-ink" },
    { label: "Pedidos", value: Array.isArray(orders) ? orders.length : 0, icon: ListOrdered, chip: "bg-cyan-400 text-ink" },
  ];

  return (
    <div className={page}>
      <div className={`${container} py-8`}>
        <header className="relative overflow-hidden rounded-2xl bg-ink text-white p-5 sm:p-8 mb-6">
          <div aria-hidden="true" className="absolute -top-24 -left-20 w-[360px] h-[360px] rounded-full bg-accent/25 blur-[110px]" />
          <div aria-hidden="true" className="absolute top-1/3 -right-20 w-[380px] h-[380px] rounded-full bg-fuchsia-500/20 blur-[120px]" />
          <div aria-hidden="true" className="absolute bottom-0 left-1/3 w-[300px] h-[300px] rounded-full bg-cyan-400/15 blur-[110px]" />

          <div className="relative flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="flex items-center gap-5 min-w-0">
              <div
                className="shrink-0 w-16 h-16 rounded-2xl bg-accent text-ink flex items-center justify-center text-2xl ring-2 ring-accent ring-offset-2 ring-offset-ink"
                aria-hidden="true"
                style={dmSans}
              >
                {initial}
              </div>
              <div className="min-w-0">
                <p className="text-sm text-white/60" style={inter}>
                  Hola de nuevo,
                </p>
                <h1 className="text-2xl sm:text-3xl truncate" style={dmSans}>
                  {displayName || "Tu cuenta"}
                </h1>
                <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2 text-sm text-white/70" style={inter}>
                  {profile?.email && (
                    <span className="inline-flex items-center gap-1.5 min-w-0">
                      <Mail size={14} aria-hidden="true" className="shrink-0 text-accent" />
                      <span className="truncate">{profile.email}</span>
                    </span>
                  )}
                  {profile?.phone && (
                    <span className="inline-flex items-center gap-1.5">
                      <Phone size={14} aria-hidden="true" className="text-cyan-400" />
                      {profile.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 lg:ml-auto shrink-0">
              <Link
                to="/vehicles"
                className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-lg text-sm font-medium bg-accent text-ink hover:bg-accent/90 transition-colors"
                style={inter}
              >
                <Car size={18} aria-hidden="true" />
                Adquirir vehículos
              </Link>
              <button
                type="button"
                onClick={() => dispatch(onLogout())}
                className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-lg text-sm font-medium bg-white/10 text-white border border-white/20 hover:bg-white/15 transition-colors"
                style={inter}
              >
                <LogOut size={18} aria-hidden="true" />
                <span className="hidden sm:inline">Cerrar sesión</span>
              </button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {stats.map(({ label, value, icon: Icon, chip }) => (
            <div key={label} className={`${card} p-4 flex items-center gap-4`}>
              <span className={`flex items-center justify-center w-10 h-10 rounded-lg ${chip}`}>
                <Icon size={18} aria-hidden="true" />
              </span>
              <div>
                <p className="text-2xl font-semibold text-ink" style={inter}>{value}</p>
                <p className="text-sm text-black/50" style={inter}>{label}</p>
              </div>
            </div>
          ))}
        </div>

        {profile?.address && !showAddressForm ? (
          <div className="mb-8">
            <h2 className="block mb-3 text-sm font-medium text-black/60 uppercase tracking-wide" style={inter}>
              Tu dirección
            </h2>
            <div className={`${card} p-5 sm:p-7 max-w-3xl`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent-soft text-ink shrink-0">
                    <MapPin size={18} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium text-ink break-words" style={dmSans}>
                      {profile.address}
                    </p>
                    <p className="text-sm text-black/50" style={inter}>
                      Guardada en tu cuenta
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    type="button"
                    className={btnOutline}
                    style={inter}
                    onClick={() => setShowAddressForm(true)}
                  >
                    <Pencil size={16} aria-hidden="true" />
                    Cambiar
                  </button>
                  <button
                    type="button"
                    className={btnOutline}
                    style={inter}
                    onClick={removeAddress}
                  >
                    <Trash2 size={16} aria-hidden="true" />
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form className={`${card} p-5 sm:p-7 max-w-3xl mb-8`} style={inter}>
            <h2 className="text-2xl mb-4" style={dmSans}>
              {profile?.address ? "Editar dirección" : "Dirección"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1.5 text-black/70">Calle</label>
                <input
                  type="text"
                  onChange={(e) => setStreet(e.target.value)}
                  className={input}
                  placeholder="1234 Main St"
                />
              </div>
              <div>
                <label className="block text-sm mb-1.5 text-black/70">Ciudad</label>
                <input
                  type="text"
                  onChange={(e) => setCity(e.target.value)}
                  className={input}
                />
              </div>
              <div>
                <label className="block text-sm mb-1.5 text-black/70">Departamento/Estado</label>
                <input
                  type="text"
                  onChange={(e) => setState(e.target.value)}
                  className={input}
                />
              </div>
              <div>
                <label className="block text-sm mb-1.5 text-black/70">Código postal</label>
                <input
                  type="text"
                  onChange={(e) => setPostalCode(e.target.value)}
                  className={input}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm mb-1.5 text-black/70">País</label>
                <input
                  type="text"
                  onChange={(e) => setCountry(e.target.value)}
                  className={input}
                />
              </div>
            </div>
            <button
              type="button"
              className={`${btnDark} mt-5`}
              onClick={addNewAddress}
            >
              Guardar dirección
            </button>
          </form>
        )}

        <div className={`${card} overflow-hidden`}>
          <div className="border-b border-black/10 px-4 sm:px-6 pt-4">
            <div role="tablist" aria-label="Secciones de la cuenta" className="flex gap-1 overflow-x-auto">
              {TABS.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm border-b-2 whitespace-nowrap transition-colors ${focusRing} ${
                    activeTab === key
                      ? "border-accent text-ink"
                      : "border-transparent text-black/40 hover:text-black/70"
                  }`}
                  style={inter}
                >
                  <Icon size={16} aria-hidden="true" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 sm:p-6 min-h-[20rem]">
            {activeTab === "cart" &&
              (Array.isArray(cart) && cart.length ? (
                <div className="flex flex-col gap-3">
                  {cart.map((item, i) => (
                    <CartItem key={i} cart={cart} item={item} onAdd={onAdd} onRemove={onRemove} />
                  ))}
                </div>
              ) : (
                emptyState("Tu carrito está vacío!")
              ))}

            {activeTab === "wishlist" &&
              (Array.isArray(wishlist) && wishlist.length ? (
                <div className="flex flex-col gap-3">
                  {wishlist.map((item, i) => (
                    <WishItem key={i} item={item} onTapRemove={removeFromWishlist} />
                  ))}
                </div>
              ) : (
                emptyState("Tu wishlist está vacía!")
              ))}

            {activeTab === "orders" &&
              (Array.isArray(orders) && orders.length ? (
                <div className="flex flex-col gap-3">
                  {orders.map((item, i) => (
                    <OrderItem key={i} item={item} catalog={products} />
                  ))}
                </div>
              ) : (
                emptyState("No tienes pedidos todavía!")
              ))}
          </div>

          {Array.isArray(cart) && cart.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-black/10 p-4 sm:px-6 bg-cream/50">
              <span className="text-lg" style={inter}>
                Total:
                <span className="font-bold text-2xl ml-2 text-ink">
                  ${totalAmount.toLocaleString()}
                </span>
              </span>
              <button
                className={btnPrimary}
                style={inter}
                onClick={onTapPlaceOrder}
              >
                <Gift size={18} />
                Realizar Pedido
              </button>
            </div>
          )}
        </div>

        {lastOrder && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Confirmación de pedido"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm"
            onClick={closeOrder}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div aria-hidden="true" className="h-1.5 bg-gradient-to-r from-accent via-pink-400 to-cyan-400" />

                <button
                  type="button"
                  className="absolute top-4 right-4 flex items-center justify-center w-9 h-9 rounded-lg text-black/50 hover:text-ink hover:bg-paper transition-colors"
                  onClick={closeOrder}
                  aria-label="Cerrar confirmación"
                >
                  <X size={18} aria-hidden="true" />
                </button>

                <div className="p-6 sm:p-8 text-center">
                  <span
                    className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent via-amber-400 to-orange-400 text-ink shadow-lg"
                    aria-hidden="true"
                  >
                    <PartyPopper size={30} />
                  </span>

                  <h2 className="mt-5 text-3xl text-ink" style={dmSans}>
                    ¡Pedido realizado!
                  </h2>
                  <p className="mt-2 text-black/60" style={inter}>
                    ¡Felicitaciones{displayName ? `, ${displayName}` : ""}! Tu vehículo
                    queda reservado. Nos pondremos en contacto para coordinar la
                    entrega con garantía de 12 meses y peritaje certificado.
                  </p>

                  <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-ink bg-accent-soft rounded-full px-3 py-1.5" style={inter}>
                    <MapPin size={12} aria-hidden="true" />
                    Pedido #{(lastOrder?._id || "").slice(-6).toUpperCase()}
                  </div>

                  {(Array.isArray(lastOrder.items) && lastOrder.items.length > 0) && (
                    <div className="mt-5 text-left rounded-xl border border-black/10 bg-cream/60 p-3">
                      <ul className="flex flex-col gap-2.5 max-h-44 overflow-y-auto pr-1">
                        {lastOrder.items.map((item, i) => (
                          <li key={i} className="flex items-center gap-3">
                            {item.banner && (
                              <img
                                src={item.banner}
                                alt={item.name}
                                className="w-14 h-10 object-cover rounded-md shrink-0"
                              />
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-ink truncate" style={dmSans}>
                                {item.name}
                              </p>
                              <p className="text-xs text-black/50" style={inter}>
                                {item.unit} x ${Number(item.price || 0).toLocaleString()}
                              </p>
                            </div>
                            <span className="text-sm font-semibold text-ink" style={inter}>
                              ${Number(item.subtotal || 0).toLocaleString()}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-3 pt-3 border-t border-black/10 flex items-center justify-between">
                        <span className="text-sm text-black/60" style={inter}>Total</span>
                        <span className="text-lg font-bold text-ink" style={inter}>
                          ${Number(lastOrder.total || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="mt-5 flex items-center justify-center gap-2 text-sm text-black/60" style={inter}>
                    <ShieldCheck size={16} className="text-emerald-500" aria-hidden="true" />
                    Tu compra está protegida y verificada por nosotros.
                  </div>

                  <div className="mt-5 flex flex-col gap-2">
                    <Link
                      to="/vehicles"
                      className={`${btnPrimary} w-full`}
                      style={inter}
                    >
                      <Car size={18} aria-hidden="true" />
                      Seguir explorando
                    </Link>
                    <button
                      type="button"
                      className={`${btnOutline} w-full`}
                      style={inter}
                      onClick={closeOrder}
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { Profile };