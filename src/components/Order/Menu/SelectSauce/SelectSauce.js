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
    const itemsPerSlide = 9;
    const slides = [];
    for (let i = 0; i < sauces.length; i += itemsPerSlide) {
        slides.push(sauces.slice(i, i + itemsPerSlide));
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
                        const isSelected = selectedSauces.includes(sauce);
                        const selectionClass = isSelected ? 'selected-class' : ''; // Ajoutez une classe pour le style de sélection
                        return (
                            <div key={sauce.id} className={`col-4 mb-4 my-auto ${selectionClass}`} onClick={() => onSelectSauce(sauce)}>
                                <div className="">
                                    <img src={`https://maro.alwaysdata.net/${sauce.imageUrl }`} alt={sauce.nom} className="sauce-image img-fluid" />
                                    <h3 className='text-center itemName'>{sauce.nom}</h3>
                                    {/* {isSelected && <span className="selection-indicator orange">✔</span>} */}
                                </div>
                            </div>
                        );
                    })}
                    <div className="text-center">
                        <img src={handImg} alt="hand-img" className="hand-img" />
                    </div>
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



