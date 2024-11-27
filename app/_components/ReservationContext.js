"use client";

import { createContext, useContext, useState } from "react";
// 1: create the context
const reservationContext = createContext();

const initialState = { from: undefined, to: undefined };

// 2: create the provider component which holds the state and provide the context value (must be client components)
function ReservationProvider({ children }) {
  const [range, setRange] = useState(initialState);
  const resetRange = () => setRange(initialState);

  return (
    <reservationContext.Provider value={{ range, setRange, resetRange }}>
      {children}
    </reservationContext.Provider>
  );
}

// 3: create the custome hook
function useReservation() {
  const context = useContext(reservationContext);
  if (context === undefined)
    throw new Error("context was used outside the provider");

  return context;
}

export { ReservationProvider, useReservation };
