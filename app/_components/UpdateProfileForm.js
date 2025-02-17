"use client";

import { updateGuestAction } from "../_lib/action";
import SubmitButton from "./SubmitButton";

function UpdateProfileForm({ children, guest }) {
  const { fullName, email, nationalID, nationality, countryFlag } = guest;

  return (
    <form
      action={updateGuestAction}
      className="bg-primary-900 py-8 px-12 text-lg flex gap-6 flex-col"
    >
      <div className="space-y-2">
        <label>Full name</label>
        <input
          name="fullName"
          defaultValue={fullName}
          disabled
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
        />
      </div>

      <div className="space-y-2">
        <label>Email address</label>
        <input
          name="email"
          defaultValue={email}
          disabled
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="nationality">Where are you from?</label>
          <img src={countryFlag} alt={nationality} className="h-5 rounded-sm" />
        </div>

        {/* bcs of fetching data this is a server component */}
        {/* <SelectCountry
          name="nationality"
          id="nationality"
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
          defaultCountry={nationality}
        /> */}
        {children}
      </div>

      <div className="space-y-2">
        <label htmlFor="nationalID">National ID number</label>
        <input
          name="nationalID"
          defaultValue={nationalID}
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
        />
      </div>

      <div className="flex justify-end items-center gap-6">
        <SubmitButton pendingLable="Updating profile...">
          Update profile
        </SubmitButton>
      </div>
    </form>
  );
}

// function Button() {
//   // when asyncrnous task is running pendings === true and when is done pending === false
//   const { pending } = useFormStatus();

//   return (
//     <button
//       disabled={pending}
//       className="flex gap-4 items-center bg-accent-500 px-8 py-4 text-primary-800 font-semibold hover:bg-accent-600 transition-all disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300"
//     >
//       Update profile{pending && <SpinnerMini />}
//     </button>
//   );
// }

export default UpdateProfileForm;
