"use client";

import ReservationCard from "./ReservationCard";
import { deleteBookingAction } from "../_lib/action";
import { useOptimistic } from "react";

function ReservationList({ bookings }) {
  const [optimisticBookings, optimisticDelete] = useOptimistic(
    bookings,
    (curBookings, bookingId) => {
      //in the begining before asyncrounus fn in server action runs optimisticeState === curState but after asyncronous fn runs we return next optimistic state
      // delete optimistic
      return curBookings.filter((booking) => booking.id !== bookingId);
      // add optimistic
      // [...curBookings, newBooking]
    }
  );

  async function handleDelete(bookingId) {
    // before invoking the server action we call this fn
    optimisticDelete(bookingId);
    // invoking server action
    await deleteBookingAction(bookingId);
  }

  return (
    <ul className="space-y-6">
      {optimisticBookings.map((booking) => (
        <ReservationCard
          booking={booking}
          key={booking.id}
          onDelete={handleDelete}
        />
      ))}
    </ul>
  );
}

export default ReservationList;
