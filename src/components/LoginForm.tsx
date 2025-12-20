// src/components/LoginForm.tsx
const LoginForm = () => (
  <form method="post" action="/api/auth/login" className="space-y-3 text-left">
    <div className="space-y-2">
      <label htmlFor="user">User:</label>
      <input type="text" id="user" name="user" required className="input" />
    </div>
    <div className="space-y-2">
      <label htmlFor="password">Password:</label>
      <input
        type="password"
        id="password"
        name="password"
        required
        className="input"
      />
    </div>
    <button type="submit" className="button">
      Login
    </button>
  </form>
);

export default LoginForm;
