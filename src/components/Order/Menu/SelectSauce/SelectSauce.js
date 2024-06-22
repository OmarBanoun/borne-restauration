import React from "react";
import '../Menu.css';
import '../SelectSauce/SelectSauce.css'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper';
import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';
import handImg from "../../../../assets/hand.png";
const SelectSauce = ({ sauces, onSelectSauce, selectedSauces, onNextClick }) => {
    const canProceed = selectedSauces.length > 0;
    const itemsPerSlide = 8;
    const slides = [];
    for (let i = 0; i < sauces.length; i += itemsPerSlide) {
        const slideItems = sauces.slice(i, i + itemsPerSlide);
        // Ajouter l'image spéciale à la 9ème position de la première slide
        if (i === 0 && sauces.length > 8) {
            slideItems.splice(8, 0, { id: 'hand-img', imageUrl: handImg, nom: 'Hand Image', prix: 0 });
        }
        slides.push(slideItems);
    }
    return (
        <div className='container text-center select-sauce'>
            <h2 className='mb-4'>Choisissez vos sauces (2 max) : </h2>
            <Swiper
            slidesPerView={1}
            onSlideChange={() => console.log('slide change')}
            onSwiper={(swiper) => console.log(swiper)}
            modules={[Pagination]} 
            pagination={{ clickable: true }}
            >
            {slides.map((slideItems, index) => (
                <SwiperSlide key={index}>
                    <div className='row'>
                    {slideItems.map((sauce) => {
                        if (sauce.id === 'hand-img') {
                            return (
                                <div key={sauce.id} className='col-4 mb-4 pt-5'>
                                    <img src={sauce.imageUrl} alt={sauce.nom} className="hand-img img-fluid" />
                                </div>
                            );
                        }
                        const isSelected = selectedSauces.includes(sauce);
                        const selectionClass = isSelected ? 'selected-class' : '';
                        return (
                            <div key={sauce.id} className={`col-4 mb-4 my-auto ${selectionClass}`} onClick={() => onSelectSauce(sauce)}>
                                <div className="">
                                    <img src={`https://maro.alwaysdata.net/${sauce.imageUrl }`} alt={sauce.nom} className="categoryImage img-fluid" />
                                    <h3 className='text-center itemName'>{sauce.nom}</h3>
                                    {/* {isSelected && <span className="selection-indicator orange">✔</span>} */}
                                </div>
                            </div>
                        );
                    })}
                    </div>
            </SwiperSlide>
            ))}
            </Swiper>
            <div className='mt-5'>
                <button className='btn btn-warning py-3 btn-lg col-4 text-white mb-3' onClick={onNextClick} disabled={!canProceed}>Suivant</button>
            </div>
        </div>
    );
};
export default SelectSauce;



