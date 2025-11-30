import HeroSlider from "../Components/HeroSlider";
import AboutSection from "../Components/AboutSection"
import WhyChooseUs from "../Components/WhyChooseUs"
import FeaturedProducts from "../Components/FeaturedProducts"
import PromoBanner from "../Components/PromoBanner"
import ProductsSection from "../Components/ProductsSection"
import FinalCTA from "../Components/FinalCTA"
import Articles from "../Articles/page";
function HomePage(){
    return(
        <div>
            <HeroSlider />
            <Articles />
            
            <PromoBanner />
          
            <WhyChooseUs />
            <FinalCTA />
        </div>
    )
}
export default HomePage;