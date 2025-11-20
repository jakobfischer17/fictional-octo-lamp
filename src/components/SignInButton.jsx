import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";

function SignInButton() {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginPopup(loginRequest).catch(e => {
      console.error("Login error:", e);
    });
  };

  return (
    <button onClick={handleLogin} className="auth-button sign-in">
      Sign In with Microsoft
    </button>
  );
}

export default SignInButton;
