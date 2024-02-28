import {SignInForm} from "../_components/SignInForm";
import {Suspense} from "react";

export default async function Signin() {
  return (
      <Suspense>
        <SignInForm />
      </Suspense>
  );
}
