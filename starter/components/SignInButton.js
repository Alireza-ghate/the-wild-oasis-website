/////////this component must be server component bcs we want the authenication flow on the server //////////////////
// since this is a server component we cant use onClick() to call sinIn function we have to use server actions
// server actions adds intractivity to server components

import { signInAction } from "@/app/_lib/action";

function SignInButton() {
  return (
    <form action={signInAction}>
      <button className="flex items-center gap-6 text-lg border border-primary-300 px-10 py-4 font-medium">
        <img
          src="https://authjs.dev/img/providers/google.svg"
          alt="Google logo"
          height="24"
          width="24"
        />
        <span>Continue with Google</span>
      </button>
    </form>
  );
}

export default SignInButton;
