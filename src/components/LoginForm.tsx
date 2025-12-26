// Option 1: Keep original simple form (WORKS)
const LoginForm = () => (
  <form method="post" action="/api/auth/login" className="space-y-6 text-left">
    <div className="space-y-2">
      <label htmlFor="user">Username or Email</label>
      <input
        type="text"
        id="user"
        name="user"
        className="w-full h-12 px-4 rounded-2xl border-2 border-gray-200 focus:border-[#0046BE] focus:ring-4 focus:ring-blue-100/50 bg-white/80 backdrop-blur-sm transition-all duration-300"
      />
    </div>
    <div className="space-y-2">
      <label htmlFor="password">Password</label>
      <input
        type="password"
        id="password"
        name="password"
        className="w-full h-12 px-4 rounded-2xl border-2 border-gray-200 focus:border-[#0046BE] focus:ring-4 focus:ring-blue-100/50 bg-white/80 backdrop-blur-sm transition-all duration-300"
      />
    </div>
    <button
      type="submit"
      className="w-full h-12 bg-gradient-to-r from-[#0046BE] to-blue-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 text-base">
      🐼 Login
    </button>
  </form>
);

export default LoginForm;
