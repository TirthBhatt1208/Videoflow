import { SignUp } from "@clerk/clerk-react";
import type { JSX } from "react";

function Signup(): JSX.Element {
  return (
    <div className="flex justify-center items-center min-h-screen bg-black overflow-auto">
      <SignUp signInUrl="/login" />
    </div>
  );
}

export default Signup;
