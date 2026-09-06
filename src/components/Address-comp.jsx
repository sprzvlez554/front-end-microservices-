import { MapPin, Trash2, Pencil } from "lucide-react";
import { card, btnIcon } from "../ui";

const inter = { fontFamily: "'Inter', sans-serif" };
const dmSans = { fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.03em" };

export const AddressComponent = ({ address }) => {
  const addressCard = ({ street, postalCode, city, country }, key) => (
    <article
      key={key}
      className={`${card} min-w-[260px] p-4 flex flex-col justify-between gap-4`}
    >
      <div>
        <span
          className="inline-flex items-center gap-1 text-xs font-medium bg-accent-soft text-ink rounded-full px-2.5 py-1 mb-3"
          style={inter}
        >
          <MapPin size={12} aria-hidden="true" />
          Dirección
        </span>
        <p className="font-medium" style={dmSans}>
          {street}
        </p>
        <span className="text-black/60 text-sm" style={inter}>
          {postalCode}, {city}, {country}
        </span>
      </div>
      <div className="flex gap-2 self-end">
        <button
          type="button"
          className={btnIcon}
          aria-label="Eliminar dirección"
        >
          <Trash2 size={16} />
        </button>
        <button
          type="button"
          className={btnIcon}
          aria-label="Editar dirección"
        >
          <Pencil size={16} />
        </button>
      </div>
    </article>
  );

  const listOfAddress = () => {
    if (Array.isArray(address)) {
      return address.map((item, i) => addressCard(item, i));
    }
    return <p className="text-black/50" style={inter}>Sin direcciones disponibles</p>;
  };

  return (
    <div className="flex flex-row flex-nowrap gap-4 overflow-x-auto pb-2 -mb-2">
      {listOfAddress()}
    </div>
  );
};