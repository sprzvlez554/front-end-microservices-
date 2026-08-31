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
} from "lucide-react";
import {
  onRemoveFromWishlist,
  onViewProfile,
  onAddToCart,
  onRemoveFromCart,
  onCreateAddress,
  onPlaceOrder,
  onLogout,
} from "../store/actions";
import { AddressComponent } from "../components/Address-comp";
import { CartItem } from "../components/Cart-comp";
import { WishItem } from "../components/Wishlist-comp";
import { OrderItem } from "../components/Order-comp";

import { useAppDispatch, useAppSelector } from "../store/hooks";

const dmSans = { fontFamily: "'DM Sans', sans-serif" };
const inter = { fontFamily: "'Inter', sans-serif" };

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 rounded-sm";

const TABS = [
  { key: "cart", label: "Carrito", icon: ShoppingCart },
  { key: "wishlist", label: "Favoritos", icon: Heart },
  { key: "orders", label: "Pedidos", icon: ListOrdered },
];

// The customer record has no name field (see backend Customer.js), so the
// greeting is built from the local part of the email address.
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
  const { user, profile, wishlist, cart, orders, address } = useAppSelector(
    (state) => state.userReducer
  );
  const dispatch = useAppDispatch();

  const [activeTab, setActiveTab] = useState("cart");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

  const { token, _id, id } = user;
  const customerId = _id || id;

  useEffect(() => {
    if (customerId) {
      dispatch(onViewProfile(customerId));
    }
  }, [customerId, dispatch]);

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
  };
  
  const onTapPlaceOrder = () => {
  dispatch(onPlaceOrder());
  };

  const emptyState = (message) => (
    <div
      className="flex flex-col items-center justify-center gap-4 h-64 text-black/40"
      style={inter}
    >
      <p>{message}</p>
      <Link
        to="/vehicles"
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-md border border-black/20 text-black hover:bg-black/5 transition-colors ${focusRing}`}
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

  return (
    <div className="min-h-screen bg-[#F5F5F3] px-5 sm:px-8 lg:px-10 py-8">
      {/* Account header: who is signed in, plus the way into the catalogue. */}
      <header className="bg-white rounded-lg p-5 sm:p-6 mb-6 flex flex-col sm:flex-row sm:items-center gap-5">
        <div
          className="shrink-0 w-14 h-14 rounded-full bg-black text-white flex items-center justify-center text-xl"
          aria-hidden="true"
          style={dmSans}
        >
          {initial}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm text-black/50" style={inter}>
            Hola de nuevo,
          </p>
          <h1
            className="text-2xl sm:text-3xl truncate"
            style={{ ...dmSans, letterSpacing: "-0.03em" }}
          >
            {displayName || "Tu cuenta"}
          </h1>
          <div
            className="flex flex-wrap gap-x-5 gap-y-1 mt-2 text-sm text-black/60"
            style={inter}
          >
            {profile?.email && (
              <span className="inline-flex items-center gap-1.5 min-w-0">
                <Mail size={14} aria-hidden="true" className="shrink-0" />
                <span className="truncate">{profile.email}</span>
              </span>
            )}
            {profile?.phone && (
              <span className="inline-flex items-center gap-1.5">
                <Phone size={14} aria-hidden="true" />
                {profile.phone}
              </span>
            )}
          </div>
        </div>

        <div className="shrink-0 flex flex-col sm:flex-row gap-3">
          <Link
            to="/vehicles"
            className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-black text-white hover:bg-black/85 transition-colors ${focusRing}`}
            style={inter}
          >
            <Car size={18} aria-hidden="true" />
            Adquirir vehículos
          </Link>
          <button
            type="button"
            onClick={() => dispatch(onLogout())}
            className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md border border-black/20 text-black/70 hover:text-black hover:bg-black/5 transition-colors ${focusRing}`}
            style={inter}
          >
            <LogOut size={18} aria-hidden="true" />
            Cerrar sesión
          </button>
        </div>
      </header>

      {Array.isArray(address) && address.length ? (
        <div className="mb-8">
          <label className="block mb-2 text-sm text-black/60" style={inter}>
            Tu dirección
          </label>
          <AddressComponent address={address} />
        </div>
      ) : (
        <form className="mb-8 bg-white p-5 rounded-lg max-w-3xl" style={inter}>
          <h2 className="text-2xl mb-4" style={dmSans}>
            Dirección
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Calle</label>
              <input
                type="text"
                onChange={(e) => setStreet(e.target.value)}
                className="w-full border border-black/15 rounded-md px-3 py-2"
                placeholder="1234 Main St"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Ciudad</label>
              <input
                type="text"
                onChange={(e) => setCity(e.target.value)}
                className="w-full border border-black/15 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Departamento/Estado</label>
              <input
                type="text"
                onChange={(e) => setState(e.target.value)}
                className="w-full border border-black/15 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Código postal</label>
              <input
                type="text"
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full border border-black/15 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">País</label>
              <input
                type="text"
                onChange={(e) => setCountry(e.target.value)}
                className="w-full border border-black/15 rounded-md px-3 py-2"
              />
            </div>
          </div>
          <button
            type="button"
            className="mt-4 px-5 py-2 rounded-md bg-black text-white"
            onClick={addNewAddress}
          >
            Guardar dirección
          </button>
        </form>
      )}

      <div className="bg-white rounded-t-lg px-4 sm:px-6 pt-4">
        <div role="tablist" aria-label="Secciones de la cuenta" className="flex gap-1 border-b border-black/10">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={activeTab === key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm border-b-2 transition-colors ${focusRing} ${activeTab === key
                  ? "border-black text-black"
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

      <div className="bg-white rounded-b-lg p-4 sm:p-6 min-h-[20rem]">
        {activeTab === "cart" &&
          (Array.isArray(cart) && cart.length ? (
            <div>
              {cart.map((item, i) => (
                <CartItem key={i} cart={cart} item={item} onAdd={onAdd} onRemove={onRemove} />
              ))}
            </div>
          ) : (
            emptyState("Tu carrito está vacío!")
          ))}

        {activeTab === "wishlist" &&
          (Array.isArray(wishlist) && wishlist.length ? (
            <div>
              {wishlist.map((item, i) => (
                <WishItem key={i} item={item} onTapRemove={removeFromWishlist} />
              ))}
            </div>
          ) : (
            emptyState("Tu wishlist está vacía!")
          ))}

        {activeTab === "orders" &&
          (Array.isArray(orders) && orders.length ? (
            <div>
              {orders.map((item, i) => (
                <OrderItem key={i} item={item} onTapViewMore={() => { }} />
              ))}
            </div>
          ) : (
            emptyState("No tienes pedidos todavía!")
          ))}
      </div>

      {Array.isArray(cart) && cart.length > 0 && (
        <div className="bg-white rounded-lg mt-4 p-4 flex flex-wrap items-center justify-between gap-4">
          <span className="text-lg" style={inter}>
            Total: <span className="font-bold ml-2">${totalAmount.toLocaleString()}</span>
          </span>
          <button
            className="flex items-center gap-2 px-5 py-3 rounded-md bg-black text-white"
            style={inter}
            onClick={onTapPlaceOrder}
          >
            <Gift size={18} />
            Realizar Pedido
          </button>
        </div>
      )}
    </div>
  );
};

export { Profile };
