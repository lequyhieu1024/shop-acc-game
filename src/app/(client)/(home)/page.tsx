import Banner from "./Banner";
import ExclusiveOffers from "./ExclusiveOffers";
import InfoCards from "./InforCard";
import LatestProducts from "./LatestProducts";
import LuckyWheelToggle from "@/components/(client)/(common)/LuckyWheelToggle";

export default function Home() {
  return (
    <>
      <Banner />
        <ExclusiveOffers />
        <LatestProducts />
        <ExclusiveOffers />
      {/*<GetDiamondsHot />*/}
      {/*<RobloxServices />*/}
      {/*<NickChip />*/}
      <InfoCards />
      <LuckyWheelToggle />
    </>
  );
}
