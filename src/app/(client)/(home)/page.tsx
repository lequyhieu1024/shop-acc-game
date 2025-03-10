import Banner from "./Banner";
import ExclusiveOffers from "./ExclusiveOffers";
import GetDiamondsHot from "./GetDiamondsHot";
import InfoCards from "./InforCard";
import LatestProducts from "./LatestProducts";
import NickChip from "./NickChip";
import RobloxServices from "./RobloxServices ";
import LuckyWheelToggle from "@/components/(client)/(common)/LuckyWheelToggle";

export default function Home() {
  return (
    <>
      <Banner />
      <ExclusiveOffers />
      <LatestProducts />
      <GetDiamondsHot />
      <RobloxServices />
      <NickChip />
      <InfoCards />
      <LuckyWheelToggle />
    </>
  );
}
