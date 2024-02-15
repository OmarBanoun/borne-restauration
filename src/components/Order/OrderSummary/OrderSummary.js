// OrderSummary.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper';
import { Delete } from '@mui/icons-material';
import Swal from 'sweetalert2';
import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';
// import { Link } from 'react-router-dom';
import "./OrderSummary.css";

const OrderSummary = ({ orderItems, onEditItem, onRemoveItem, onFinalizeOrder, pains, garnitures, sauces, supplements, drinks }) => {
    console.log("Order Items dans OrderSummary:", orderItems);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedDetail, setSelectedDetail] = useState({});
    const [editingCategory, setEditingCategory] = useState(null);
    const [cancelOrder, setCancelOrder] = useState(null);
    const [swiperHeight, setSwiperHeight] = useState('auto');

    const handleShowDetailsModal = (item, index) => {
        setSelectedDetail({ ...item, index });
        setShowDetailsModal(true);
        setEditingCategory(null);
        setCancelOrder(item, index);
    };
    const handleCloseDetailsModal = () => {
        setShowDetailsModal(false);
    };

    // réafficher la commande comme elle était quand on clique sur le bouton "annuler"
    const handleCancelOrder = (item, index) => {
        setSelectedDetail({ ...orderItems[index], index, painImg: orderItems[index].painImg || '', garnitures: orderItems[index].garnitures || [], sauces: orderItems[index].sauces || [], supplements: orderItems[index].supplements || [], drinkImg: orderItems[index].drinkImg || '' });
        setEditingCategory(null);
    }

    const handleSelectPain = (pain) => {
        setSelectedDetail(prevState => ({
            ...prevState,
            pain: pain.nom, // Mettez à jour le nom du pain sélectionné
            painImg: pain.imageUrl // Mettez à jour l'image du pain sélectionné si nécessaire
        }));
    };
    const handleSelectGarniture = (selectedGarniture) => {
        let updatedGarnitures;
        if (selectedDetail.garnitures.some(g => g.nom === selectedGarniture.nom)) {
            // Retirer la garniture si elle est déjà sélectionnée
            updatedGarnitures = selectedDetail.garnitures.filter(g => g.nom !== selectedGarniture.nom);
        } else {
            // Ajouter la garniture si elle n'est pas encore sélectionnée
            updatedGarnitures = [...selectedDetail.garnitures, selectedGarniture];
        }
        setSelectedDetail({ ...selectedDetail, garnitures: updatedGarnitures });
    };

    const handleSelectSauce = (selectedSauce) => {
        const currentSauces = selectedDetail.sauces || [];
    
        if (currentSauces.some(sauce => sauce.nom === selectedSauce.nom)) {
            // Si la sauce sélectionnée est déjà dans le tableau, la retirer (désélectionner)
            const updatedSauces = currentSauces.filter(sauce => sauce.nom !== selectedSauce.nom);
            setSelectedDetail({ ...selectedDetail, sauces: updatedSauces });
        } else if (currentSauces.length < 2) {
            // Ajouter la nouvelle sauce si moins de 2 sont déjà sélectionnées
            const updatedSauces = [...currentSauces, selectedSauce];
            setSelectedDetail({ ...selectedDetail, sauces: updatedSauces });
        } else {
            Swal.fire({
                icon: 'warning',
                title: '2 sauces maximum !',
                text: "Vous pouvez sélectionner jusqu'à 2 sauces maximum."
            });
        }
    };

    const handleSelectDrink = (drink) => {
        setSelectedDetail(prevState => ({
            ...prevState,
            drink: drink.nom, // Mettez à jour le nom du pain sélectionné
            drinkImg: drink.imageUrl // Mettez à jour l'image du pain sélectionné si nécessaire
        }));
    };

    const handleSelectSupplement = (selectedSupplement) => {
        let updatedSupplements;
        if (selectedDetail.supplements.some(g => g.nom === selectedSupplement.nom)) {
            // Retirer la garniture si elle est déjà sélectionnée
            updatedSupplements = selectedDetail.supplements.filter(s => s.nom !== selectedSupplement.nom);
        } else {
            // Ajouter la garniture si elle n'est pas encore sélectionnée
            updatedSupplements = [...selectedDetail.supplements, selectedSupplement];
        }
        setSelectedDetail({ ...selectedDetail, supplements: updatedSupplements });
    }

    useEffect(() => {
        const height = sauces.length > 9 ? '560px' : 'auto'; // Exemple de condition
        setSwiperHeight(height);
    }, [sauces]);
    

    return (
        <div className='summary-section mb-0'>
            <div className='order-product d-flex flex-row col-8'>
                {orderItems.map((item, index) => (
                    <div key={index} className="my-auto">
                        <div className="card">
                        <div className='d-flex justify-content-end'>
                            <button onClick={() => onRemoveItem(index)} className="d-flex btn text-danger"><strong>❌</strong></button>
                        </div>
                            <img src={`https://maro.alwaysdata.net/${item.imageUrl}`} alt={item.nom} className="card-img-top img-fluid" />
                            <div className="card-body">
                                <h5 className="card-title">{item.nom}</h5>
                                <p className="card-text itemPrice mb-4">{(item.prix + (item.option === 'menu' ? 2 : 0) + (item.supplements ? item.supplements.reduce((total, supplement) => total + supplement.prix, 0) : 0)).toFixed(2).replace('.', ',')}€</p>
                                <button onClick={() => handleShowDetailsModal(item, index)} className="btn btn-warning text-white mb-4">Voir Détails</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className='order-price my-auto text-center col-4'>
                <div className='border-button'>
                <button onClick={onFinalizeOrder} type="button" className="btn btn-warning btn-lg btn-block my-auto finish_button">
                    <div className='text-white td-none px-3'>Finaliser ma commande</div>
                </button>
                </div>
            </div>
            <Modal show={showDetailsModal} onHide={handleCloseDetailsModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Détails de l'Article</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                {editingCategory === 'pain' && (
                <Swiper
                style={{ height: swiperHeight }}
                slidesPerView={1}
                modules={[Pagination]}
                pagination={{ clickable: true }}
                className="mySwiper"
            >
                {Array.from({ length: Math.ceil(pains.length / 9) }, (_, slideIndex) => (
                    <SwiperSlide key={slideIndex}>
                        <div className="container">
                            <div className="row">
                                {pains.slice(slideIndex * 9, (slideIndex + 1) * 9).map((pain, painIndex) => (
                                    <div key={painIndex} className={`col-4 ${selectedDetail.pain === pain.nom ? 'selected-class' : ''}`} style={{ marginBottom: "20px" }} onClick={() => handleSelectPain(pain)}>
                                        <img src={`https://maro.alwaysdata.net/${pain.imageUrl}`} alt={pain.nom} className="img-fluid img-detail" />
                                        <div className="text-center itemName">{pain.nom}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            )}
                {editingCategory === 'garnitures' && (
                <Swiper
                style={{ height: swiperHeight }}
                slidesPerView={1}
                modules={[Pagination]}
                pagination={{ clickable: true }}
                className="mySwiper"
            >
                {Array.from({ length: Math.ceil(garnitures.length / 9) }, (_, slideIndex) => (
                    <SwiperSlide key={slideIndex}>
                        <div className="container">
                            <div className="row">
                                {garnitures.slice(slideIndex * 9, (slideIndex + 1) * 9).map((garniture, garnitureIndex) => (
                                    <div key={garnitureIndex} className={`col-4 ${selectedDetail.garnitures.some(g => g.nom === garniture.nom) ? 'selected-class' : ''}`} style={{ marginBottom: "20px" }} onClick={() => handleSelectGarniture(garniture)}>
                                        <img src={`https://maro.alwaysdata.net/${garniture.imageUrl}`} alt={garniture.nom} className="img-fluid img-detail" />
                                        <div className="text-center itemName">{garniture.nom}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
                </Swiper>
                )}
                {editingCategory === 'sauces' && (
                    <Swiper
                    style={{ height: swiperHeight }}
                    slidesPerView={1}
                    modules={[Pagination]}
                    pagination={{ clickable: true }}
                    className="mySwiper"
                >
                    {Array.from({ length: Math.ceil(sauces.length / 9) }, (_, slideIndex) => (
                        <SwiperSlide key={slideIndex}>
                            <div className="container">
                                <div className="row">
                                    {sauces.slice(slideIndex * 9, (slideIndex + 1) * 9).map((sauce, sauceIndex) => (
                                        <div key={sauceIndex} className={`col-4 ${selectedDetail.sauces.some(s => s.nom === sauce.nom) ? 'selected-class' : ''}`} style={{ marginBottom: "20px" }} onClick={() => handleSelectSauce(sauce)}>
                                            <img src={`https://maro.alwaysdata.net/${sauce.imageUrl}`} alt={sauce.nom} className="img-fluid img-detail" />
                                            <div className="text-center itemName">{sauce.nom}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
                )}
                {editingCategory === 'supplements' && (
                <Swiper
                style={{ height: swiperHeight }}
                slidesPerView={1}
                modules={[Pagination]}
                pagination={{ clickable: true }}
                className="mySwiper"
                >
                {Array.from({ length: Math.ceil(supplements.length / 9) }, (_, slideIndex) => (
                    <SwiperSlide key={slideIndex}>
                        <div className="container">
                            <div className="row">
                                {supplements.slice(slideIndex * 9, (slideIndex + 1) * 9).map((supplement, supplementIndex) => (
                                    <div key={supplementIndex} className={`col-4 ${selectedDetail.supplements.some(g => g.nom === supplement.nom) ? 'selected-class' : ''}`} style={{ marginBottom: "20px" }} onClick={() => handleSelectSupplement(supplement)}>
                                        <img src={`https://maro.alwaysdata.net/${supplement.imageUrl}`} alt={supplement.nom} className="img-fluid img-detail" />
                                        <div className="text-center itemName">{supplement.nom}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
                </Swiper>
                )}
                {editingCategory === 'option' && (
                    // Affichez les options de modification pour "Option"
                    <><p>Option</p></>
                )}
                {editingCategory === 'drinks' && (
                <Swiper
                style={{ height: swiperHeight }}
                slidesPerView={1}
                modules={[Pagination]}
                pagination={{ clickable: true }}
                className="mySwiper"
            >
                {Array.from({ length: Math.ceil(drinks.length / 9) }, (_, slideIndex) => (
                    <SwiperSlide key={slideIndex}>
                        <div className="container">
                            <div className="row">
                                {drinks.slice(slideIndex * 9, (slideIndex + 1) * 9).map((drink, drinkIndex) => (
                                    <div key={drinkIndex} className={`col-4 ${selectedDetail.drink === drink.nom ? 'selected-class' : ''}`} style={{ marginBottom: "20px" }} onClick={() => handleSelectDrink(drink)}>
                                        <img src={`https://maro.alwaysdata.net/${drink.imageUrl}`} alt={drink.nom} className="img-fluid img-detail" />
                                        <div className="text-center itemName">{drink.nom}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
                )}
                {!editingCategory && (
                    <>
                    <img src={`https://maro.alwaysdata.net/${selectedDetail.imageUrl}`} alt={selectedDetail.nom} className="card-img-top img-top-detail img-fluid d-flex mx-auto" />
                    <h3 className='text-center'>{selectedDetail.nom}</h3>
                    {/*prix */}
                    <h3 className="card-text itemPrice text-center pt-1">{(selectedDetail.prix + (selectedDetail.option === 'menu' ? 2 : 0) + (selectedDetail.supplements ? selectedDetail.supplements.reduce((total, supplement) => total + supplement.prix, 0) : 0)).toFixed(2).replace('.', ',')}€</h3>
                    <hr />
                    {selectedDetail.categorie !== 'Dessert' && (
                        <div className='d-flex justify-content-between align-items-center mb-3'>
                            {/* <h4>Option : {selectedDetail.option === 'seul' ? 'Seul' : 'En Menu'}</h4> */}
                            <h4>Option : {selectedDetail.option === 'seul' ? `${selectedDetail.nom} seul` : `${selectedDetail.nom} En Menu`}</h4>
                            <Button variant="outline-primary" onClick={() => setEditingCategory('option')}>Modifier</Button>
                        </div>
                    )}
                    {selectedDetail.pain && (
                        <div className='d-flex justify-content-between align-items-center mb-3'>
                            <div className='d-flex align-items-center'>
                                <h4 className="me-3">Pain :</h4>
                                <img src={`https://maro.alwaysdata.net/${selectedDetail.painImg}`} alt={selectedDetail.pain} style={{ width: '50px', height: '50px' }} />
                            </div>
                            <Button variant="outline-primary" onClick={() => setEditingCategory('pain')}>Modifier</Button>
                        </div>
                    )}
                    {selectedDetail.garnitures && selectedDetail.garnitures.length > 0 && (
                        <div className='d-flex justify-content-between align-items-center mb-3'>
                            <div className='d-flex align-items-center'>
                                <h4 className="me-3">Garnitures :</h4>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {selectedDetail.garnitures.map((garniture, index) => (
                                        <img key={index} src={`https://maro.alwaysdata.net/${garniture.imageUrl}`} alt={garniture.nom} style={{ width: '50px', height: '50px' }} />
                                    ))}
                                </div>
                            </div>
                            <Button variant="outline-primary" onClick={() => setEditingCategory('garnitures')}>Modifier</Button>
                        </div>
                    )}
                    {selectedDetail.sauces && selectedDetail.sauces.length > 0 && (
                        <div className='d-flex justify-content-between align-items-center mb-3'>
                            <div className='d-flex align-items-center'>
                                <h4 className="me-3">Sauces :</h4>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {selectedDetail.sauces.map((sauce, index) => (
                                        <img key={index} src={`https://maro.alwaysdata.net/${sauce.imageUrl}`} alt={sauce.nom} style={{ width: '50px', height: '50px' }} />
                                    ))}
                                </div>
                            </div>
                            <Button variant="outline-primary" onClick={() => setEditingCategory('sauces')}>Modifier</Button>
                        </div>
                    )}
                    {selectedDetail.supplements && selectedDetail.supplements.length > 0 && (
                        <div className='d-flex justify-content-between align-items-center mb-3'>
                            <div className='d-flex align-items-center'>
                                <h4 className="me-3">Suppléments :</h4>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {selectedDetail.supplements.map((supplement, index) => (
                                        <img key={index} src={`https://maro.alwaysdata.net/${supplement.imageUrl}`} alt={supplement.nom} style={{ width: '50px', height: '50px' }} />
                                    ))}
                                </div>
                            </div>
                            <Button variant="outline-primary" onClick={() => setEditingCategory('supplements')}>Modifier</Button>
                        </div>
                    )}
                    {selectedDetail.drink && (
                        <div className='d-flex justify-content-between align-items-center mb-3'>
                            <div className='d-flex align-items-center'>
                                <h4 className="me-3">Boisson :</h4>
                                <img src={`https://maro.alwaysdata.net/${selectedDetail.drinkImg}`} alt={selectedDetail.drink} style={{ width: '50px', height: '50px' }} />
                            </div>
                            <Button variant="outline-primary" onClick={() => setEditingCategory('drinks')}>Modifier</Button>
                        </div>
                    )}
                    </>
                )}
                </Modal.Body>
                <Modal.Footer className='justify-content-between'>
                {editingCategory ? (
                    <>
                    {/* <Button variant="secondary" onClick={() => {{handleCancel}; setEditingCategory(null);}}>Annuler</Button> */}
                    <Button className='btn-warning text-white col-8' onClick={() => {
                        onEditItem(selectedDetail); // Supposons que cette fonction attend `selectedDetail` comme argument
                        setEditingCategory(null); // Réinitialise l'état pour sortir du mode d'édition
                    }}>Sauvegarder</Button>
                    <Button variant="secondary" onClick={() => handleCancelOrder(selectedDetail, selectedDetail.index)}>Annuler</Button>
                    </>
                ) : (
                <>
                <Button className='col-8 btn-warning text-white' onClick={handleCloseDetailsModal}>
                    Retour à la commande
                </Button>
                <Button variant="danger" className='col-2' onClick={() => {
                    onRemoveItem(selectedDetail.index); // Supposons que cela déclenche la suppression
                    handleCloseDetailsModal(); // Fermez la modal ici si handleRemoveItem ne retourne pas de promesse
                }}>
                    <Delete color='white' />
                </Button>
                    </>
                    )}
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default OrderSummary;
