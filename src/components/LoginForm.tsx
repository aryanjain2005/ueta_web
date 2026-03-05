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
