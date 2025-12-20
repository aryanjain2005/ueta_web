import { useState } from "react";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [img, setImg] = useState("");
  const [role, setRole] = useState("user");
  const [type, setType] = useState("standard");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          img,
          role,
          type,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }
      setName("");
      setEmail("");
      setPassword("");
      setImg("");
      setRole("user");
      setType("standard");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full px-4 py-4">
      <p className="text-3xl font-bold">Singup</p>
      <div>
        <label>Name:</label>
        <input
          className="ml-2 px-2 py-1 border border-gray-300 rounded"
          type="text"
          value={name}
          onChange={(e) => setName((e.target as any).value)}
          required
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          className="ml-2 px-2 py-1 border border-gray-300 rounded"
          type="email"
          value={email}
          onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
          required
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          className="ml-2 px-2 py-1 border border-gray-300 rounded"
          type="password"
          value={password}
          onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
          required
        />
      </div>
      <div>
        <label>Image URL:</label>
        <input
          className="ml-2 px-2 py-1 border border-gray-300 rounded"
          type="text"
          value={img}
          onChange={(e) => setImg((e.target as HTMLInputElement).value)}
          required
        />
      </div>
      <div>
        <label>Role:</label>
        <select value={role} onChange={(e) => setRole((e.target as any).value)}>
          <option value="user">User</option>
          <option value="dealer">Dealer</option>
          <option value="distributor">Distributor</option>
        </select>
      </div>
      <div>
        <label>Type:</label>
        <select value={type} onChange={(e) => setType((e.target as any).value)}>
          <option value="standard">Standard</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-700 rounded-sm text-white font-bold ">
        Sign Up
      </button>
    </form>
  );
};

export default Signup;
