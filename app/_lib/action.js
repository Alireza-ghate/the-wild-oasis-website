"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { getBookings } from "./data-service";
import { redirect } from "next/navigation";

// these async functions are called SERVER ACTIONs
// this server action function will always call on the server never leaks on client
export async function signInAction() {
  // soon as user secsessfully logged in they will redirect to "/account"
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

export async function updateGuestAction(formData) {
  // job that we do here is a back-end development
  // 1) user who invokes the server action must be autherized(allowed) to do the action that server action suppose to do
  const session = await auth();
  // its a commen practice to not use try-catch block inside the server actions
  if (!session) throw new Error("You must be logged in");
  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");

  // 2) always treat all the input fields as unsafe
  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
    throw new Error("Please provide a vaild number");
  const updatedData = { nationalID, nationality, countryFlag };

  const { error } = await supabase
    .from("guests")
    .update(updatedData)
    .eq("id", session.user.guestId);

  if (error) throw new Error("Guest could not be updated");

  revalidatePath("/account/profile");
}

export async function deleteBookingAction(bookingId) {
  // 1) make sure user authenticated: (if user logged in then he can delete the booking if there is not any user he can not do anything)
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  ////// all the users can delete all the reservations even other ppl reservations
  // i want the logged in user ONLY delete their own reservations
  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingsIds = guestBookings.map((booking) => booking.id);
  if (!guestBookingsIds.includes(bookingId))
    throw new Error("You are not allowed to delete this booking");
  // 2) delete the reservation:
  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) {
    throw new Error("Booking could not be deleted");
  }

  // 3) revalidate (usually at the end of server action)
  // all the data related to this path will be revalidate IF WE HAD MULTIPLE DATA FETCHING ALL OF THEM ALSO WILL REVALIDATES
  revalidatePath("/account/reservations");
}

export async function updateReservationAction(formData) {
  const bookingId = Number(formData.get("bookingId"));

  const updatedData = {
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
  };
  // 1 making sure the user has been login
  const session = await auth();
  if (!session) throw new Error("You must be logged in");
  // 2 user able to edit only its bookings not all the bookings
  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingsIds = guestBookings.map((booking) => booking.id);
  if (!guestBookingsIds.includes(bookingId))
    throw new Error("You are not allowed to update this booking");

  const { error } = await supabase
    .from("bookings")
    .update(updatedData)
    .eq("id", bookingId)
    .select()
    .single();

  if (error) {
    throw new Error("Booking could not be updated");
  }

  revalidatePath("/account/reservations");
  revalidatePath(`/account/reservations/edit/${bookingId}`);
  // after updating the booking redirect user to this path
  redirect("/account/reservations");
}

export async function creatBookingAction(bookingData, formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");
  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    // if we had lots of data in formData we dont need to use get method to get data we use "Object.entries(formData.entries()) which returns an obj that contains all data that was in formData"
    numGuests: Number(formData.get("numGuests")),
    // users able to only write 1000 chars in observation field by adding ".slice(0, 1000)"
    observations: formData.get("observations").slice(0, 1000),
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: "unconfirmed",
  };

  const { error } = await supabase.from("bookings").insert([newBooking]);

  if (error) {
    throw new Error("Booking could not be created");
  }

  revalidatePath(`/cabins/${bookingData.cabinId}`);
  redirect("/cabins/thankyou");
}
