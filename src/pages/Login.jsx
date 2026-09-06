import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, AlertCircle, Gauge, ShieldCheck, BadgeCheck } from "lucide-react";
import { onSignup, onLogin, onClearAuthError } from "../store/actions";
import { Profile } from "./Profile";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { card, input, btnPrimary, focusRing } from "../ui";

const dmSans = { fontFamily: "'DM Sans', sans-serif" };
const inter = { fontFamily: "'Inter', sans-serif" };

const TRUST_POINTS = [
  { icon: ShieldCheck, color: "text-accent", text: "Garantía mecánica de 12 meses" },
  { icon: BadgeCheck, color: "text-emerald-400", text: "Peritaje certificado de 150 puntos" },
  { icon: Gauge, color: "text-cyan-400", text: "Historial de kilometraje verificado" },
];

const MARQUEE_ITEMS = [
  "SEDÁN",
  "SUV",
  "PICKUP",
  "SPORT",
  "GARANTÍA 12 MESES",
  "PERITAJE 150 PUNTOS",
  "HISTORIAL VERIFICADO",
  "+1000 CLIENTES",
];

const Login = () => {
  const { user, authPending, authError } = useAppSelector(
    (state) => state.userReducer
  );
  const dispatch = useAppDispatch();

  const { token } = user;

  const [isSignup, setSignup] = useState(false);

  const switchMode = (signup) => {
    setSignup(signup);
    if (authError) dispatch(onClearAuthError());
  };

  const clearErrorOnEdit = () => {
    if (authError) dispatch(onClearAuthError());
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupPhone, setSignupPhone] = useState("");

  const userSignup = (event) => {
    event.preventDefault();
    dispatch(
      onSignup({
        email: signupEmail,
        password: signupPassword,
        phone: signupPhone,
      })
    );
  };

  const userLogin = (event) => {
    event.preventDefault();
    dispatch(onLogin({ email, password }));
  };

  if (token) {
    return <Profile />;
  }

  const errorBanner = authError && (
    <div
      id="auth-error"
      role="alert"
      className="flex items-start gap-2.5 mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm"
      style={inter}
    >
      <AlertCircle size={18} aria-hidden="true" className="shrink-0 mt-px" />
      <span>{authError}</span>
    </div>
  );

  const submitProps = {
    disabled: authPending,
    className: `${btnPrimary} w-full mt-2 disabled:opacity-60 disabled:cursor-not-allowed`,
    type: "submit",
    style: { fontWeight: 500 },
  };

  const invalidProps = authError
    ? { "aria-invalid": true, "aria-describedby": "auth-error" }
    : {};

  const field = (id, label, type, value, placeholder, onChange, extra = {}) => (
    <div>
      <label htmlFor={id} className="block text-sm mb-1.5 text-black/70">
        {label}
      </label>
      <input
        id={id}
        className={input}
        type={type}
        required
        placeholder={placeholder}
        value={value}
        {...extra}
        {...invalidProps}
        onChange={onChange}
      />
    </div>
  );

  const loginForm = (
    <form className="flex flex-col gap-4" style={inter} onSubmit={userLogin}>
      {field("login-email", "Correo electrónico", "email", email, "tu@email.com", (e) => {
        setEmail(e.target.value);
        clearErrorOnEdit();
      }, { autoComplete: "email" })}
      {field("login-password", "Contraseña", "password", password, "••••••••", (e) => {
        setPassword(e.target.value);
        clearErrorOnEdit();
      }, { autoComplete: "current-password" })}
      <button {...submitProps}>
        {authPending ? "Iniciando sesión…" : "Iniciar sesión"}
      </button>
    </form>
  );

  const signUpForm = (
    <form className="flex flex-col gap-4" style={inter} onSubmit={userSignup}>
      {field("signup-email", "Correo electrónico", "email", signupEmail, "tu@email.com", (e) => {
        setSignupEmail(e.target.value);
        clearErrorOnEdit();
      }, { autoComplete: "email" })}
      {field("signup-password", "Contraseña", "password", signupPassword, "Mínimo 6 caracteres", (e) => {
        setSignupPassword(e.target.value);
        clearErrorOnEdit();
      }, { autoComplete: "new-password", minLength: 6 })}
      {field("signup-phone", "Teléfono", "tel", signupPhone, "300 000 0000", (e) => {
        setSignupPhone(e.target.value);
        clearErrorOnEdit();
      }, { autoComplete: "tel" })}
      <button {...submitProps}>
        {authPending ? "Creando cuenta…" : "Crear cuenta"}
      </button>
    </form>
  );

  return (
    <div className="min-h-screen bg-cream flex flex-col overflow-hidden">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2">
        <aside className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden bg-ink text-white">
          <div aria-hidden="true" className="absolute -top-24 -left-20 w-[380px] h-[380px] rounded-full bg-accent/25 blur-[110px]" />
          <div aria-hidden="true" className="absolute top-1/3 -right-24 w-[420px] h-[420px] rounded-full bg-fuchsia-500/25 blur-[120px]" />
          <div aria-hidden="true" className="absolute bottom-0 left-1/4 w-[340px] h-[340px] rounded-full bg-cyan-400/20 blur-[110px]" />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(60%_50%_at_70%_30%,rgba(255,180,0,0.2),transparent)]"
          />
          <div aria-hidden="true" className="absolute -right-24 -bottom-32 opacity-20 select-none pointer-events-none">
            <Gauge size={480} strokeWidth={0.5} />
          </div>

          <div className="relative flex items-center gap-2">
            <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent text-ink">
              <Gauge size={22} aria-hidden="true" />
            </span>
            <span className="text-2xl" style={{ ...dmSans, fontWeight: 500, letterSpacing: "-0.05em" }}>
              AutosEnfasis-I
            </span>
          </div>

          <div className="relative">
            <h2 className="text-4xl xl:text-5xl leading-[1.05] max-w-md" style={{ ...dmSans, fontWeight: 400, letterSpacing: "-0.05em" }}>
              <span className="text-white block">Adquiere tu</span>
              <span className="bg-gradient-to-r from-accent via-pink-400 to-cyan-400 bg-clip-text text-transparent block">
                vehículo de confianza
              </span>
            </h2>
            <ul className="mt-8 space-y-3">
              {TRUST_POINTS.map(({ icon: Icon, color, text }) => (
                <li key={text} className="flex items-center gap-3 text-white/80 text-sm" style={inter}>
                  <Icon size={18} className={color} aria-hidden="true" />
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <p className="relative text-sm text-white/40" style={inter}>
            +1000 clientes ya conducen su vehículo con nosotros.
          </p>
        </aside>

        <div className="relative flex flex-col items-center justify-center p-5 sm:p-10">
          <div aria-hidden="true" className="absolute -top-32 -right-24 w-[360px] h-[360px] rounded-full bg-accent/15 blur-[110px]" />
          <div className="relative w-full max-w-sm">
            <Link
              to="/"
              className={`inline-flex items-center gap-1.5 text-sm text-black/60 hover:text-black transition-colors mb-8 ${focusRing}`}
              style={inter}
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Volver al inicio
            </Link>

            <div className={`${card} p-6 sm:p-8`}>
              <div
                role="tablist"
                aria-label="Acceso a la cuenta"
                className="flex p-1 bg-cream rounded-lg mb-6"
                style={inter}
              >
                {[
                  { key: "login", label: "Iniciar sesión" },
                  { key: "signup", label: "Crear cuenta" },
                ].map(({ key, label }) => {
                  const selected = (key === "signup") === isSignup;
                  return (
                    <button
                      key={key}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      aria-controls="auth-panel"
                      onClick={() => switchMode(key === "signup")}
                      className={`flex-1 py-2 text-sm rounded-lg transition-colors ${focusRing} ${
                        selected
                          ? "bg-gradient-to-r from-accent via-amber-400 to-accent text-ink shadow-sm"
                          : "text-black/50 hover:text-black/80"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              <div id="auth-panel" role="tabpanel">
                <h1 className="text-2xl mb-1" style={dmSans}>
                  {isSignup ? "Crea tu cuenta" : "Bienvenido de vuelta"}
                </h1>
                <p className="text-sm text-black/50 mb-6" style={inter}>
                  {isSignup
                    ? "Regístrate para guardar vehículos y hacer pedidos."
                    : "Accede para ver tu carrito, favoritos y pedidos."}
                </p>
                {errorBanner}
                {isSignup ? signUpForm : loginForm}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="relative -rotate-1 bg-gradient-to-r from-accent via-amber-400 to-accent py-2.5 overflow-hidden">
        <div className="marquee-track flex gap-8 whitespace-nowrap w-max">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-8 text-ink font-bold tracking-wide text-sm"
              style={{ ...dmSans, textTransform: "uppercase" }}
            >
              {item}
              <span className="w-2 h-2 rounded-full bg-ink/70" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export { Login };