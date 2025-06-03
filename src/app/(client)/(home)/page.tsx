import Banner from "./Banner";
// import ExclusiveOffers from "./ExclusiveOffers";
import InfoCards from "./InforCard";
// import LuckyWheelToggle from "@/components/(client)/(common)/LuckyWheelToggle";
import NotiBannerPage from "./NotiBanner";
import CategoryList from "./LatestProducts";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div style={{ paddingTop: 10 }}>
        <NotiBannerPage />
        <Banner />
        {/*<ExclusiveOffers />*/}
        <CategoryList />
        {/*<NickChip />*/}
        <InfoCards />
      </div>
    </div>
  );
}
