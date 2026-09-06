import { Link } from "react-router-dom";
import { Trash2, ArrowUpRight } from "lucide-react";
import { cardInner, btnOutline, btnCircle } from "../ui";

const inter = { fontFamily: "'Inter', sans-serif" };
const dmSans = { fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.03em" };

export const WishItem = ({ item, onTapRemove }) => {
  const { _id, name, desc, price, banner } = item;

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

      <div className="flex items-center gap-2 shrink-0">
        <Link
          to={`/details/${_id}`}
          className={btnOutline}
          style={inter}
        >
          Ver
          <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
        <button
          type="button"
          className={btnCircle}
          style={inter}
          onClick={() => onTapRemove(_id)}
          aria-label="Quitar de favoritos"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
};