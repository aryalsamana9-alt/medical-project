import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-slate-50 to-indigo-50/40">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-indigo-100/40 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full bg-teal-100/30 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-6 py-20 lg:py-28 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Left: Hero text */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700 mb-6">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-indigo-500" />
                </span>
                HIPAA Compliant • 24/7 Support
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.1]">
                Your health,{" "}
                <span className="bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent">
                  unified.
                </span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-slate-600 max-w-xl mx-auto lg:mx-0">
                Connect with board-certified specialists, take intelligent health
                assessments, and manage your wellness journey — all from one
                secure, beautifully designed platform.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-200 transition-all duration-200 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 hover:-translate-y-0.5 active:scale-[0.97]"
                >
                  Get Started
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-8 py-3.5 text-base font-semibold text-slate-700 transition-all duration-200 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-md active:scale-[0.97]"
                >
                  I already have an account
                </Link>
              </div>

              {/* Trust badges */}
              <div className="mt-10 flex items-center gap-6 justify-center lg:justify-start text-sm text-slate-500">
                <div className="flex items-center gap-1.5">
                  <svg className="h-5 w-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  End-to-end encrypted
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="h-5 w-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Trusted by 10k+ patients
                </div>
              </div>
            </div>

            {/* Right: Abstract illustration */}
            <div className="hidden lg:flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Floating cards mockup */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 animate-[float_5s_ease-in-out_infinite]">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-teal-400 flex items-center justify-center text-white text-lg font-bold">H</div>
                    <div>
                      <div className="h-2.5 w-24 rounded-full bg-slate-200" />
                      <div className="h-2 w-16 rounded-full bg-slate-100 mt-1.5" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 w-full rounded-full bg-slate-100" />
                    <div className="h-3 w-3/4 rounded-full bg-slate-100" />
                    <div className="h-3 w-5/6 rounded-full bg-slate-100" />
                  </div>
                  <div className="mt-5 flex gap-3">
                    <div className="h-20 flex-1 rounded-2xl bg-gradient-to-br from-indigo-50 to-teal-50 border border-indigo-100 flex items-center justify-center text-2xl">💬</div>
                    <div className="h-20 flex-1 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-100 flex items-center justify-center text-2xl">📅</div>
                  </div>
                </div>
                {/* Second floating card */}
                <div className="absolute -bottom-8 -right-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/50 w-48 animate-[float_5s_ease-in-out_infinite_1s]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-teal-400 to-emerald-400" />
                    <div className="text-sm font-semibold text-slate-800">Dr. Chen</div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 mb-1" />
                  <div className="h-2 w-2/3 rounded-full bg-slate-100" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURE CARDS ===== */}
      <section className="py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center mb-14">
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Why HealthApp?</h2>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            Everything you need to manage your health — securely, intelligently, beautifully.
          </p>
        </div>

        <div className="mx-auto max-w-7xl grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: "📊",
              title: "Track Progress",
              desc: "Monitor your health metrics and see improvements over time with beautiful visual dashboards.",
              gradient: "from-indigo-50 to-blue-50",
              border: "border-indigo-100",
            },
            {
              icon: "🔒",
              title: "Secure & Private",
              desc: "Your data is end-to-end encrypted and only accessible to you and your care team.",
              gradient: "from-teal-50 to-emerald-50",
              border: "border-teal-100",
            },
            {
              icon: "💬",
              title: "Stay Connected",
              desc: "Chat intelligently with AI-powered doctor matching and real-time messaging.",
              gradient: "from-violet-50 to-purple-50",
              border: "border-violet-100",
            },
            {
              icon: "🔍",
              title: "Smart Matching",
              desc: "Take our diagnostic quiz and get matched to the best specialist based on your symptoms.",
              gradient: "from-amber-50 to-orange-50",
              border: "border-amber-100",
            },
            {
              icon: "🧘",
              title: "Mental Wellness",
              desc: "Compassionate psychiatry and mental health support available when you need it most.",
              gradient: "from-rose-50 to-pink-50",
              border: "border-rose-100",
            },
            {
              icon: "📅",
              title: "Easy Booking",
              desc: "Schedule consultations with your preferred doctor in just a few clicks, any time.",
              gradient: "from-sky-50 to-cyan-50",
              border: "border-sky-100",
            },
          ].map((feat, i) => (
            <div
              key={i}
              className={`group relative overflow-hidden rounded-2xl border ${feat.border} bg-gradient-to-br ${feat.gradient} p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-slate-200/60`}
            >
              <div className="mb-5 text-3xl transition-transform duration-300 group-hover:scale-110">
                {feat.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{feat.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{feat.desc}</p>
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-400 to-teal-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-slate-200 bg-white py-8 px-6">
        <div className="mx-auto max-w-7xl text-center text-sm text-slate-400">
          <p>© 2026 HealthApp. All rights reserved.</p>
        </div>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }
      `}</style>
    </div>
  );
}