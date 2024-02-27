import React from "react";
import './SelectDessert.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper';
import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';

const SelectDessert = ({ desserts, onSelectDessert, selectedDesserts, onNextClick }) => {
    const canProceed = selectedDesserts.length > 0;
    const itemsPerSlide = 9;
    const slides = [];
    for (let i = 0; i < desserts.length; i += itemsPerSlide) {
        slides.push(desserts.slice(i, i + itemsPerSlide));
    }

    return (
        <div className='container text-center'>
            <h2 className='text-center mt-5'>Selectionnez vos desserts</h2>
            <Swiper
            spaceBetween={50}
            slidesPerView={1}
            onSlideChange={() => console.log('slide change')}
            onSwiper={(swiper) => console.log(swiper)}
            modules={[Pagination]} 
            pagination={{ clickable: true }}
            >
            {slides.map((slideItems, index) => (
                <SwiperSlide key={index}>
                    <div className='row px-3'>
                        {slideItems.map((dessert) => {
                            const isSelected = selectedDesserts.includes(dessert);
                            const selectionClass = isSelected ? 'selected-class' : '';
                            return(
                                <div key={dessert.id} className={`col-4 mb-4 ${selectionClass}`} onClick={() => onSelectDessert(dessert)}>
                                <div>
                                    <img src={`https://maro.alwaysdata.net/${dessert.imageUrl}`} alt={dessert.nom} className="dessert-image img-fluid" />
                                    <h3 className='text-center itemName'>{dessert.nom}</h3>
                                    <p className="itemPrice orange">{dessert.prix.toFixed(2).replace('.', ',')}€</p>
                                </div>
                            </div>
                            );
                        })}
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
            <div className='mt-5'>
                <button className='btn btn-warning btn-lg col-4 text-white py-3' onClick={onNextClick} disabled={!canProceed}>Ajouter</button>
                {!canProceed && <p>Veuillez sélectionner au moins un dessert.</p>}
            </div>
        </div>
    );
};
export default SelectDessert;
