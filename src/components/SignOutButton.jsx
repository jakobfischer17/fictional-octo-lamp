import { useMsal } from "@azure/msal-react";

function SignOutButton() {
  const { instance } = useMsal();

  const handleLogout = () => {
    instance.logoutPopup().catch(e => {
      console.error("Logout error:", e);
    });
  };

  return (
    <button onClick={handleLogout} className="auth-button sign-out">
      Sign Out
    </button>
  );
}

export default SignOutButton;
