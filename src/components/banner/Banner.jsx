import { useLocation } from "react-router-dom";
import './banner.css'
import FilterSearch from "../filter&search/Filter&Search";

function Banner() {
    const location = useLocation();

    return (
        <div className="banner">
            {location.pathname === '/' ? (
                <img
                    src='/assets/images/hero.jpg'
                    alt="Banner"
                    className="banner-background image"
                />
            ) : location.pathname === '/video' ? (
                <video
                    src="/assets/videos/hero.mp4"
                    autoPlay
                    loop
                    muted
                    className="banner-background video"
                />
            ) : (
                <img
                    src='/assets/images/hero.jpg'
                    alt="Banner"
                    className="banner-background image"
                />
            )}

            <FilterSearch />

        </div>
    );
}

export default Banner;