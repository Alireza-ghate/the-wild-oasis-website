import Cabin from "@/app/_components/Cabin";
import Reservation from "@/app/_components/Reservation";
import Spinner from "@/app/_components/Spinner";
import { getCabin, getCabins } from "@/app/_lib/data-service";
import { Suspense } from "react";

export async function generateMetadata({ params }) {
  const { name } = await getCabin(params.cabinId);

  return { title: `Cabin ${name}` };
}

// make a dynamic route to static route:
export async function generateStaticParams() {
  // 1) get all the cabins(items) then read their IDs
  const cabins = await getCabins();
  const ids = cabins.map((cabin) => ({
    cabinId: String(cabin.id),
  }));
  // 2) this function must return an array of objects with property name of dynamic segment(as folder name)
  return ids;
}

export default async function Page({ params }) {
  // multiple data fetching: blocks next data fetching code
  const cabin = await getCabin(params.cabinId);

  /*
  const settings = await getSettings();
  const bookedDates = await getBookedDatesByCabinId(params.cabinId);*/

  // fix using promis.all(it is NOT perfect way):
  /*const [cabin, settings, bookedDates] = Promise.all([
    getCabin(params.cabinId),
    getSettings(),
    getBookedDatesByCabinId(params.cabinId),
  ]);*/

  ////////*** we need this cabin data in multiple places IF we had 1 lvl prop drilling it is ok to pass the data as prop BUT IF we had more deep prop drilling lvl we have to fetch that data in multiple places too then use request memoization ***///////
  return (
    <div className="max-w-6xl mx-auto mt-8">
      <Cabin cabin={cabin} />

      <div>
        <h2 className="text-5xl font-semibold text-center mb-10 text-accent-400">
          Reserve {cabin.name} today. Pay on arrival.
        </h2>
        <Suspense fallback={<Spinner />}>
          <Reservation cabin={cabin} />
        </Suspense>
      </div>
    </div>
  );
}
