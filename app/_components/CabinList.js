import { unstable_noStore as noStore } from "next/cache";
import { getCabins } from "../_lib/data-service";
import CabinCard from "./CabinCard";

export default async function CabinList({ filter }) {
  // because we are not using Fetch API in this component we cant revalidate the indivisual api request BUT we can use noStore() to opt-out the component itself
  // this page has non-cache data request => whole page rerenders as dynamic page
  // (revalidate only this component alone ===> if we use partial pre rendering (PPR) in future just this component will render as dynamic not the whole page)
  noStore();
  const cabins = await getCabins();

  if (!cabins.length) return null;

  let displayedCabins;
  if (filter === "all") displayedCabins = cabins;
  if (filter === "small")
    displayedCabins = cabins.filter((cabin) => cabin.maxCapacity <= 3);
  if (filter === "medium")
    displayedCabins = cabins.filter(
      (cabin) => cabin.maxCapacity <= 7 && cabin.maxCapacity > 3
    );
  if (filter === "large")
    displayedCabins = cabins.filter((cabin) => cabin.maxCapacity >= 8);

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14">
      {displayedCabins.map((cabin) => (
        <CabinCard cabin={cabin} key={cabin.id} />
      ))}
    </div>
  );
}
