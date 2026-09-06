// Presets compartidos de diseño. Un solo lugar define la apariencia de
// botones, campos y contenedores para que toda la app se vea consistente.

export const container = "mx-auto max-w-7xl px-5 sm:px-8 lg:px-10";
export const page = "min-h-screen bg-cream";
export const card = "bg-white rounded-2xl border border-black/5 shadow-sm";
export const cardInner =
  "flex flex-col gap-3 p-3 sm:p-4 border border-black/10 rounded-xl bg-white";

export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cream rounded-lg";

const btnBase =
  "inline-flex items-center justify-center gap-2 h-11 px-5 text-sm font-medium rounded-lg transition-colors " +
  focusRing;

// Tipos de botón (usa siempre estos, no inventes estilos nuevos)
export const btnPrimary = `${btnBase} bg-accent text-ink hover:bg-accent/90`;
export const btnDark = `${btnBase} bg-ink text-white hover:bg-ink/85`;
export const btnOutline = `${btnBase} border border-black/15 text-ink hover:bg-paper`;
export const btnWhite = `${btnBase} bg-white text-ink hover:bg-white/90`;
export const btnSoft = `${btnBase} bg-accent-soft text-ink hover:bg-accent/70`;

export const btnIcon = `flex items-center justify-center w-11 h-11 rounded-lg text-black/60 hover:text-ink hover:bg-paper transition-colors ${focusRing}`;
export const btnCircle = `flex items-center justify-center w-9 h-9 rounded-lg bg-accent text-ink hover:bg-accent/90 transition-colors ${focusRing}`;

// Campos de formulario
export const input =
  "w-full border border-black/15 rounded-lg px-3.5 py-2.5 bg-white transition-colors focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink";

export const pillActive = "bg-ink text-white shadow-sm";
export const pillIdle =
  "bg-white text-ink border border-black/10 hover:border-black/30";