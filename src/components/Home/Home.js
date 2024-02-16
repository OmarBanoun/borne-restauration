import React, { useEffect } from 'react';
import './Home.css';
import { Link } from 'react-router-dom';
import { UseThemeSettings } from '../../components/Common/ThemeManager';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper';
import { Autoplay } from 'swiper';
import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';
const Home = () => {
    const { companyName, homeImgs } = UseThemeSettings();
    const autoplay = {
        delay: 5000, // Temps entre chaque slide (en millisecondes)
        disableOnInteraction: false, // Permet de continuer l'autoplay après une interaction
    };
    useEffect(() => {
        // Ajouter la classe quand le composant est monté
        document.getElementById('root').classList.add('max-height');
    
        // Retirer la classe quand le composant est démonté
        return () => {
            document.getElementById('root').classList.remove('max-height');
        };
    }, []);
    return (
        <div className="Home">
            <main>
                {/* Carrousel Swiper pour les images d'accueil */}
                <Swiper
                    spaceBetween={0}
                    slidesPerView={1}
                    modules={[Autoplay]}
                    autoplay={autoplay}
                    loop={true}
                    speed={1500}
                    onSlideChange={() => console.log('slide change')}
                    onSwiper={(swiper) => console.log(swiper)}
                >
                    {homeImgs.map((img, index) => (
                        <SwiperSlide key={index}>
                            <img src={`https://maro.alwaysdata.net/${img}`} className="bg-main" alt={`Slide ${index}`} />
                        </SwiperSlide>
                    ))}
                </Swiper>

                <h1>{companyName}</h1>
                <button type="button" className="btn btn-orange btn-lg btn-block col-6 col-lg-3 my-auto">
                    <Link to="/Order">Commander <i className="fa-solid fa-utensils"></i></Link>
                </button>
            </main>
        </div>
    );
};


export default Home;