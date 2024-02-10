import React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper';
import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';

const SelectSupplements = ({ supplements, onSelectSupplement, selectedSupplements, onNextClick }) => {
    const canProceed = selectedSupplements.length > 0;
    const itemsPerSlide = 9;
    const slides = [];
    for (let i = 0; i < supplements.length; i += itemsPerSlide) {
        slides.push(supplements.slice(i, i + itemsPerSlide));
    }

    return (
        <div className='container'>
            <h2 className='text-center mt-5'>Selectionnez vos suppléments</h2>
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
                    <div className='row px-3 mt-3'>
                        {slideItems.map((supplement) => {
                            const isSelected = selectedSupplements.some(s => s.id === supplement.id);
                            const selectionClass = isSelected ? 'selected-class' : '';
                            return(
                                <div key={supplement.id} className={`col-md-4 mb-4 ${selectionClass}`} onClick={() => onSelectSupplement(supplement)}>
                                <div>
                                    <img src={`https://maro.alwaysdata.net/${supplement.imageUrl}`} alt={supplement.nom} className="dessert-image img-fluid" />
                                    <h3 className='text-center itemName'>{supplement.nom}</h3>
                                    <p className="itemPrice orange text-center">+{supplement.prix.toFixed(2).replace('.', ',')}€</p>
                                </div>
                            </div>
                            );
                        })}
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
            <div className='mt-5 d-flex justify-content-around'>
                    <button className='btn btn-warning btn-lg col-4 text-white py-3' onClick={onNextClick} disabled={!canProceed}>Ajouter</button>
                    {/* {!canProceed && <p>Veuillez sélectionner au moins un supplément.</p>}                     */}
                <button className="btn btn-danger btn-lg col-4 text-white py3" onClick={onNextClick}>Non, merci</button>
            </div>
        </div>
    );
};
export default SelectSupplements;
