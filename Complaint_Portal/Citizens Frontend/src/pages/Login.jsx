import { FcGoogle } from "react-icons/fc";
import { RiShieldCheckLine } from "react-icons/ri";

/* ── decorative SVG wave blobs ─────────────────────────────────────────── */
function WaveTopRight() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className="absolute -top-8 -right-8 w-56 h-56 pointer-events-none select-none opacity-[0.07]"
      viewBox="0 0 220 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M200 0C200 0 240 60 200 120C160 180 80 200 40 180C0 160 -20 100 20 60C60 20 120 -10 200 0Z"
        fill="#6b7280"
      />
      <path
        d="M220 40C220 40 250 100 210 150C170 200 100 210 70 185C40 160 30 110 60 80C90 50 160 20 220 40Z"
        fill="#9ca3af"
      />
    </svg>
  );
}

function WaveBottomLeft() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className="absolute -bottom-8 -left-8 w-56 h-56 pointer-events-none select-none opacity-[0.07]"
      viewBox="0 0 220 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 220C20 220 -20 160 20 100C60 40 140 20 180 40C220 60 240 120 200 160C160 200 100 230 20 220Z"
        fill="#6b7280"
      />
      <path
        d="M0 180C0 180 -30 120 10 70C50 20 120 10 150 35C180 60 190 110 160 140C130 170 60 200 0 180Z"
        fill="#9ca3af"
      />
    </svg>
  );
}

/* ── main component ─────────────────────────────────────────────────────── */
export default function Login() {
  const handleGoogleSignIn = () => {
    window.location.href = `${import.meta.env.VITE_API_URL ?? "/api"}/auth/google`;
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-white px-4">
      {/* card */}
      <section
        aria-label="Sign in"
        className="
          relative overflow-hidden
          w-full max-w-[480px]
          bg-white
          rounded-[28px]
          shadow-[0_8px_40px_-8px_rgba(0,0,0,0.12),0_2px_12px_-4px_rgba(0,0,0,0.06)]
          px-10 py-12
          animate-fade-in-up
        "
      >
        {/* decorative waves */}
        <WaveTopRight />
        <WaveBottomLeft />

        {/* ── header ──────────────────────────────────────────────────── */}
        <header className="flex flex-col items-center gap-5 mb-10">
          {/* logo mark */}
          <div
            aria-hidden="true"
            className="
              w-14 h-14 rounded-2xl
              bg-gradient-to-br from-gray-900 to-gray-700
              flex items-center justify-center
              shadow-[0_4px_14px_-2px_rgba(0,0,0,0.25)]
            "
          >
            <span className="text-white text-xl font-black tracking-tighter select-none">N</span>
          </div>

          <div className="text-center space-y-1.5">
            <h1 className="text-[2rem] font-bold tracking-[0.04em] text-gray-900 leading-none">
              NSK ETECH
            </h1>
            <p className="text-[0.9375rem] text-gray-400 leading-snug">
              Sign in to continue to your account
            </p>
          </div>
        </header>

        {/* ── google button ────────────────────────────────────────────── */}
        <div className="mb-8">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            aria-label="Continue with Google"
            className="
              group relative w-full h-14
              flex items-center justify-center gap-3
              bg-white
              border border-gray-200
              rounded-2xl
              text-[0.9375rem] font-medium text-gray-700
              shadow-[0_1px_4px_-1px_rgba(0,0,0,0.08)]
              transition-all duration-200 ease-out
              hover:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.14)]
              hover:border-gray-300
              hover:scale-[1.01]
              active:scale-[0.98]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-offset-2
              focus-visible:ring-gray-900
              cursor-pointer
            "
          >
            <FcGoogle className="text-[1.375rem] shrink-0" aria-hidden="true" />
            <span>Continue with Google</span>
          </button>
        </div>

        {/* ── divider ──────────────────────────────────────────────────── */}
        <div className="flex items-center gap-4 mb-8" role="separator">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs font-medium text-gray-400 tracking-wider uppercase select-none">
            Secure
          </span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* ── footer ───────────────────────────────────────────────────── */}
        <footer className="flex items-center justify-center gap-2">
          <RiShieldCheckLine
            className="text-gray-300 text-lg shrink-0"
            aria-hidden="true"
          />
          <p className="text-[0.8125rem] text-gray-400 leading-tight">
            Your data is safe and secure with us
          </p>
        </footer>
      </section>
    </main>
  );
}
