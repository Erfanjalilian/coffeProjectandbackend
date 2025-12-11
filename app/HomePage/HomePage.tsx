import HeroSlider from "../Components/AHeroSlider";
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
            <br/><br/><br/>
            <PromoBanner />
            
            <HeroSlider />
            <Articles />
            
            
          
            <WhyChooseUs />
            <FinalCTA />
            
        </div>
    )
}
export default HomePage;