import { Suspense } from "react";
import CabinList from "../_components/CabinList";
import Spinner from "../_components/Spinner";
import Filter from "../_components/Filter";
import ReservationReminder from "../_components/ReservationReminder";

export const metadata = {
  title: "Cabins",
};
// opt-out caching
// revalidate === 0 => alwyas revalidates the data so make the page dynamic
// revalidate !== 0 => revalidates the data AFTER GIVEN TIME using ISR still regenerates a static page but fresh data will fetch after that time we specified
// (revalidate whole route)
// export const revalidate = 3600;

// whenever the searchParams changes the Page server componenet will re-render(when ever we click on filter btns a navigation will happns and then url chages so searchParams also changes)
export default function Page({ searchParams }) {
  const filter = searchParams?.capacity ?? "all";

  return (
    <div>
      <h1 className="text-4xl mb-5 text-accent-400 font-medium">
        Our Luxury Cabins
      </h1>
      <p className="text-primary-200 text-lg mb-10">
        Cozy yet luxurious cabins, located right in the heart of the Italian
        Dolomites. Imagine waking up to beautiful mountain views, spending your
        days exploring the dark forests around, or just relaxing in your private
        hot tub under the stars. Enjoy nature&apos;s beauty in your own little
        home away from home. The perfect spot for a peaceful, calm vacation.
        Welcome to paradise.
      </p>
      <div className="flex justify-end mb-8">
        <Filter />
      </div>
      <Suspense fallback={<Spinner />} key={filter}>
        <CabinList filter={filter} />
        <ReservationReminder />
      </Suspense>
    </div>
  );
}
