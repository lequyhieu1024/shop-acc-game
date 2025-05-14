import Banner from "./Banner";
import ExclusiveOffers from "./ExclusiveOffers";
import InfoCards from "./InforCard";
import LatestProducts from "./LatestProducts";
// import LuckyWheelToggle from "@/components/(client)/(common)/LuckyWheelToggle";
import NotiBannerPage from "./NotiBanner";
import NickChip from "@/app/(client)/(home)/NickChip";

export default function Home() {
  return (
    <div style={{ paddingTop: 10 }}>
      <NotiBannerPage />
      <Banner />
      <ExclusiveOffers />
      <LatestProducts />
      <NickChip />
      <InfoCards />
      {/* <LuckyWheelToggle /> */}
    </div>
  );
}
