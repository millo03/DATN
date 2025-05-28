import Banner from "./Banner";
import Trending_Products from "./Trending";
import Fres from "./Fres";
import Ourblog from "./Ourblog";
import List_Products from "./List_Products";

const IndexHome = () => {
  return (
    <div className="lg:mt-[20px] mt-[60px]">
      <Banner />
      <div className="max-w-[1440px] w-[95vw] mx-auto ">
        <div className="w-full">
          <Trending_Products />
        </div>
      </div>
      <Fres />
      <div className="max-w-[1440px] w-[95vw] mx-auto">
        <div className="w-full">
          <List_Products />
          <Ourblog />
        </div>
      </div>
      {/* <div className="max-w-[1440px] w-[95vw] mx-auto">
            
        </div> */}
    </div>
  );
};

export default IndexHome;
