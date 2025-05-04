import Banner from "./Banner";
import ExclusiveOffers from "./ExclusiveOffers";
import InfoCards from "./InforCard";
import LatestProducts from "./LatestProducts";
// import LuckyWheelToggle from "@/components/(client)/(common)/LuckyWheelToggle";
import NotiBannerPage from "./NotiBanner";

export default function Home() {
  return (
    <div style={{ paddingTop: 10 }}>
      <NotiBannerPage />
      <Banner />
      <ExclusiveOffers />
      <LatestProducts />
      <ExclusiveOffers />
      {/*<GetDiamondsHot />*/}
      {/*<RobloxServices />*/}
      {/*<NickChip />*/}
      <InfoCards />
      {/* <LuckyWheelToggle /> */}
    </div>
  );
}
