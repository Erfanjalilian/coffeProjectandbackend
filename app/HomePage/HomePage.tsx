import { Suspense } from 'react';
import HeroSlider from "../Components/AHeroSlider";
import AboutSection from "../Components/AboutSection"
import WhyChooseUs from "../Components/WhyChooseUs"
import FeaturedProducts from "../Components/FeaturedProducts"
import PromoBanner from "../Components/PromoBanner"
import ProductsSection from "../Components/ProductsSection"
import FinalCTA from "../Components/FinalCTA"
import Articles from "../Components/Articles";

// Optional: Page-level loading fallback
function ArticlesFallback() {
    return <div className="h-96 bg-blue-50 animate-pulse"></div>;
}


function HomePage() {
    return (
        <div>
            <PromoBanner />
            <HeroSlider />
            
            {/* You can also add page-level Suspense if needed */}
            <Suspense fallback={<ArticlesFallback />}>
                <Articles />
            </Suspense>
            
            <WhyChooseUs />
            <FinalCTA />
        </div>
    )
}

export default HomePage;