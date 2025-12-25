import {SignIn} from "@clerk/clerk-react"
import type { JSX } from "react"

function Login(): JSX.Element {
  return (
    <div className="flex justify-center h-screen items-center bg-black">
      <SignIn signUpUrl="/signup" />
    </div>
  );
}

export default Login