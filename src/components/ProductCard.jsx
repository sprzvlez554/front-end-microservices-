import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { card, btnCircle } from "../ui";

const dmSans = { fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.03em" };
const inter = { fontFamily: "'Inter', sans-serif" };

const ProductCard = ({ item }) => {
  const { _id, banner, price, name, desc, available, type } = item;

  return (
    <Link
      to={"/details/" + _id}
      className={`group flex flex-col ${card} overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-paper">
        <img
          src={banner}
          alt={name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 left-3 flex gap-2">
          {type && (
            <span
              className="inline-block text-xs font-medium capitalize bg-white/95 text-ink px-2.5 py-1 rounded-full shadow-sm"
              style={inter}
            >
              {type}
            </span>
          )}
          {!available && (
            <span
              className="inline-block text-xs font-medium bg-ink text-white px-2.5 py-1 rounded-full shadow-sm"
              style={inter}
            >
              No disponible
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-1.5 p-4 sm:p-5">
        <p className="text-lg text-ink" style={dmSans}>
          {name}
        </p>
        <p className="text-sm text-black/60 line-clamp-2" style={inter}>
          {desc}
        </p>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xl font-semibold text-ink" style={inter}>
            ${Number(price || 0).toLocaleString()}
          </p>
          <span
            className={`${btnCircle} opacity-70 group-hover:opacity-100 transition-opacity`}
            aria-hidden="true"
          >
            <ArrowUpRight size={16} />
          </span>
        </div>
      </div>
    </Link>
  );
};

export { ProductCard };