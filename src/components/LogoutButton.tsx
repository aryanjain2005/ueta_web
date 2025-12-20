import React from "react";
// import { useAuth } from "@components/AuthProvider";

const LogoutButton = () => {
  // const { logout } = useAuth();

  return (
    <button
      //do nothing on click for now
      onClick={() => {}}
      className="font-semibold cursor-pointer bg-transparent border-none p-0 hover:underline"
      aria-label="Logout">
      Log out
    </button>
  );
};

export default LogoutButton;
