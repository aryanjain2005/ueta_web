// // Option 1: Keep original simple form (WORKS)
// const LoginForm = () => (
//   <form method="post" action="/api/auth/login" className="space-y-6 text-left">
//     <div className="space-y-2">
//       <label htmlFor="user">Username or Email</label>
//       <input
//         type="text"
//         id="user"
//         name="user"
//         className="w-full h-12 px-4 rounded-2xl border-2 border-gray-200 focus:border-[#0046BE] focus:ring-4 focus:ring-blue-100/50 bg-white/80 backdrop-blur-sm transition-all duration-300"
//       />
//     </div>
//     <div className="space-y-2">
//       <label htmlFor="password">Password</label>
//       <input
//         type="password"
//         id="password"
//         name="password"
//         className="w-full h-12 px-4 rounded-2xl border-2 border-gray-200 focus:border-[#0046BE] focus:ring-4 focus:ring-blue-100/50 bg-white/80 backdrop-blur-sm transition-all duration-300"
//       />
//     </div>
//     <button
//       type="submit"
//       className="w-full h-12 bg-gradient-to-r from-[#0046BE] to-blue-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 text-base">
//       🐼 Login
//     </button>
//   </form>
// );

// export default LoginForm;
// src/components/LoginForm.tsx
"use client";

import { useState } from "react";

const LoginForm = () => {
  const [isPasswordFocus, setIsPasswordFocus] = useState(false);

  return (
    <>
      {/* Monkey avatar */}
      <div className="relative mt-20 flex items-center justify-center">
        <div
          className="monkey flex items-center justify-center"
          style={{
            backgroundImage: isPasswordFocus
              ? 'url("/media/monkey_pwd.gif")'
              : 'url("/media/monkey.gif")',
          }}>
          <img
            src="/media/monkey-hand.png"
            alt="Monkey hands"
            className={`transition-all duration-700 w-[170px] h-[170px] ${
              isPasswordFocus ? "mt-[0%]" : "mt-[110%]"
            }`}
          />
        </div>
      </div>

      {/* Form */}
      <form
        method="post"
        action="/api/auth/login"
        className="form mt-10 flex flex-col items-center space-y-5">
        <input
          type="email"
          id="email"
          name="user"
          placeholder="Email"
          autoComplete="off"
          className="monkey-input"
          onFocus={() => setIsPasswordFocus(false)}
        />

        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          className="monkey-input"
          onFocus={() => setIsPasswordFocus(true)}
          onBlur={() => setIsPasswordFocus(false)}
        />

        <div className="footerBtn mt-6 flex flex-col items-center space-y-6">
          <button className="btn login" type="submit">
            Login
          </button>
        </div>
      </form>
    </>
  );
};

export default LoginForm;
