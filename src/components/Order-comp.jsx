import { useState } from "react";
import { Eye, ChevronDown, PackageCheck } from "lucide-react";
import { cardInner, btnDark, focusRing } from "../ui";

const inter = { fontFamily: "'Inter', sans-serif" };
const dmSans = { fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.03em" };

const STATUS_LABELS = {
  pending: "En preparación",
};

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const OrderItem = ({ item, onTapViewMore, catalog }) => {
  const [open, setOpen] = useState(false);

  const orderId = item?._id
    ? String(item._id).slice(-6).toUpperCase()
    : item?.orderId || "—";

  const amount = Number(item?.total ?? item?.amount ?? 0);

  const status = item?.status || "pending";
  const statusLabel = STATUS_LABELS[status] || status;

  const publishedAt = formatDate(item?.createdAt);

  const products = Array.isArray(item?.products) ? item.products : [];

  const catalogById = (productId) => {
    if (!Array.isArray(catalog)) return null;
    return catalog.find((p) => p?._id === productId) || null;
  };

  const nameFor = (product) => {
    if (product?.name) return product.name;
    const match = catalogById(product?.productId);
    return match?.name || product?.productId || "Vehículo";
  };

  const hasDetails = products.length > 0;

  const onViewMore = () => {
    if (onTapViewMore) onTapViewMore(item._id);
    setOpen((prev) => !prev);
  };

  return (
    <div className={cardInner}>
      <div className="flex items-center gap-4 min-w-0">
        <span className="flex items-center justify-center w-11 h-11 rounded-lg bg-accent-soft text-ink shrink-0">
          <PackageCheck size={20} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-xs text-black/40 uppercase tracking-wide" style={inter}>
            Pedido
          </p>
          <p className="truncate" style={dmSans}>
            #{orderId}
          </p>
          {publishedAt && (
            <p className="text-xs text-black/50" style={inter}>
              {publishedAt}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink bg-amber-100 border border-amber-200 rounded-full px-2.5 py-1" style={inter}>
          <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
          {statusLabel}
        </span>
        <span className="text-lg font-semibold text-ink" style={inter}>
          ${amount.toLocaleString()}
        </span>
        <button
          type="button"
          className={btnDark}
          style={inter}
          onClick={onViewMore}
        >
          <Eye size={16} />
          <span className="hidden sm:inline">Ver detalles</span>
        </button>
      </div>

      {open && hasDetails && (
        <div className="border-t border-black/10 pt-3 mt-1">
          <ul className="flex flex-col gap-2">
            {products.map((product, i) => {
              const unit = Number(product?.quantity ?? 1);
              const price = Number(product?.price ?? 0);
              const lineName = nameFor(product);
              return (
                <li key={i} className="flex items-center gap-3 min-w-0">
                  {product?.banner ? (
                    <img
                      src={product.banner}
                      alt={lineName}
                      className="w-14 h-10 object-cover rounded-md shrink-0"
                    />
                  ) : (
                    <span className="flex items-center justify-center w-14 h-10 rounded-md bg-paper text-black/40 shrink-0">
                      <PackageCheck size={18} aria-hidden="true" />
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink truncate" style={dmSans}>
                      {lineName}
                    </p>
                    <p className="text-xs text-black/50" style={inter}>
                      {unit} x ${price.toLocaleString()}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-ink shrink-0" style={inter}>
                    ${(unit * price).toLocaleString()}
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="mt-3 pt-3 border-t border-black/10 flex items-center justify-between">
            <span className="text-sm text-black/60" style={inter}>
              Total
            </span>
            <span className="text-lg font-bold text-ink" style={inter}>
              ${amount.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {open && !hasDetails && (
        <p className="border-t border-black/10 pt-3 mt-1 text-sm text-black/50" style={inter}>
          Sin artículos registrados.
        </p>
      )}

      {!open && hasDetails && (
        <button
          type="button"
          className={`inline-flex items-center gap-1 text-sm text-black/50 hover:text-ink transition-colors w-fit ${focusRing}`}
          onClick={onViewMore}
          style={inter}
        >
          <ChevronDown size={15} aria-hidden="true" />
          {products.length} {products.length === 1 ? "artículo" : "artículos"}
        </button>
      )}
    </div>
  );
};