import { Minus, Plus } from "lucide-react";
import { cardInner, btnCircle } from "../ui";

const inter = { fontFamily: "'Inter', sans-serif" };
const dmSans = { fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.03em" };

export const CartItem = ({ item, cart, onAdd, onRemove }) => {
  const { _id } = item?.product || {};

  const entry =
    Array.isArray(cart) &&
    item &&
    cart.find(({ product }) => product._id == _id);

  const currentUnit = entry ? Number(entry.unit ?? entry.quantity ?? 0) : 0;

  const addCart = () => {
    const newUnit = currentUnit + 1;
    onAdd({ _id, qty: newUnit });
  };

  const removeCart = () => {
    if (!item || currentUnit <= 0) return;
    const newUnit = currentUnit - 1;
    if (newUnit > 0) {
      onAdd({ _id, qty: newUnit });
    } else {
      onRemove({ _id });
    }
  };

  if (!item || !item.product) {
    return null;
  }

  const { name, desc, price, banner } = item.product;
  const subtotal = Number(price || 0) * currentUnit;

  return (
    <div className={cardInner}>
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <img
          src={banner}
          alt={name}
          className="w-24 h-16 object-cover rounded-lg shrink-0"
        />
        <div className="min-w-0">
          <p className="font-medium truncate" style={dmSans}>
            {name}
          </p>
          <p className="text-black/50 text-sm truncate" style={inter}>
            {desc}
          </p>
          <p className="mt-1 text-ink font-semibold" style={inter}>
            ${Number(price || 0).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className={btnCircle}
            onClick={removeCart}
            aria-label="Quitar uno"
          >
            <Minus size={16} />
          </button>
          <span className="text-xl w-6 text-center font-medium" style={inter}>
            {currentUnit}
          </span>
          <button
            type="button"
            className={btnCircle}
            onClick={addCart}
            aria-label="Agregar uno"
          >
            <Plus size={16} />
          </button>
        </div>
        <span className="text-right text-sm text-black/60 min-w-[84px]" style={inter}>
          Subtotal:{" "}
          <span className="font-semibold text-ink">${subtotal.toLocaleString()}</span>
        </span>
      </div>
    </div>
  );
};