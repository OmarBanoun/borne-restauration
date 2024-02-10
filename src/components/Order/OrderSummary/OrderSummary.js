// OrderSummary.jsx
import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
// import { Link } from 'react-router-dom';
import "./OrderSummary.css";

const OrderSummary = ({ orderItems, onEditItem, onRemoveItem, onFinalizeOrder }) => {
    console.log("Order Items dans OrderSummary:", orderItems);
    const [showModal, setShowModal] = useState(false);
    const [selectedDetail, setSelectedDetail] = useState({});

    const handleShowModal = (item, index) => {
        setSelectedDetail({ ...item, index });
        setShowModal(true);
    };
    
    const handleCloseModal = () => {
        setShowModal(false);
    };
    

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
                                {/* {item.categorie !== 'Dessert' && (
                                    <p className="card-text">Option : {item.option === 'seul' ? 'Seul' : 'En Menu'}</p>
                                )}
                                {item.drink && <p className="card-text">Boisson : {item.drink}</p>}
                                {item.garnitures && item.garnitures.length > 0 && (
                                    <p className="card-text">
                                        Garnitures : {item.garnitures.map(garniture => garniture.nom).join(', ')}
                                    </p>
                                )}
                                {item.sauces && item.sauces.length > 0 && (
                                    <p className="card-text">
                                        Sauces : {item.sauces.map(sauce => sauce.nom).join(', ')}
                                    </p>
                                )}
                                {item.supplements && item.supplements.length > 0 && (
                                    <p className="card-text">
                                        Supplements : {item.supplements.map(supplement => supplement.nom).join(', ')}
                                    </p>
                                )}
                                {item.pain && <p className="card-text">Pain : {item.pain}</p>} */}
                                <p className="card-text itemPrice mb-4">{(item.prix + (item.option === 'menu' ? 2 : 0)).toFixed(2).replace('.', ',')}€</p>
                                <button onClick={() => handleShowModal(item, index)} className="btn btn-warning text-white mb-4">Voir Détails</button>
                                {/* <button onClick={() => onEditItem(index)} className="btn btn-primary">Modifier</button>
                                <button onClick={() => onRemoveItem(index)} className="btn btn-danger ml">Supprimer</button> */}
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
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Détails de l'Article</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <img src={`https://maro.alwaysdata.net/${selectedDetail.imageUrl}`} alt={selectedDetail.nom} className="card-img-top img-top-detail img-fluid d-flex mx-auto" />
                    <h3 className='text-center'>{selectedDetail.nom}</h3>
                    {/*prix */}
                    <h3 className="card-text itemPrice text-center pt-1">{(selectedDetail.prix + (selectedDetail.option === 'menu' ? 2 : 0)).toFixed(2).replace('.', ',')}€</h3>
                    <hr />
                    {selectedDetail.categorie !== 'Dessert' && (
                        <div className='d-flex justify-content-between align-items-center mb-3'>
                            <h4>Option : {selectedDetail.option === 'seul' ? 'Seul' : 'En Menu'}</h4>
                            <Button variant="outline-primary">Modifier</Button>
                        </div>
                    )}
                    {selectedDetail.pain && (
                        <div className='d-flex justify-content-between align-items-center mb-3'>
                            <div className='d-flex align-items-center'>
                                <h4 className="me-3">Pain :</h4>
                                <img src={`https://maro.alwaysdata.net/${selectedDetail.painImg}`} alt={selectedDetail.pain} style={{ width: '50px', height: '50px' }} />
                            </div>
                            <Button variant="outline-primary">Modifier</Button>
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
                            <Button variant="outline-primary">Modifier</Button>
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
                            <Button variant="outline-primary">Modifier</Button>
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
                            <Button variant="outline-primary">Modifier</Button>
                        </div>
                    )}
                    {selectedDetail.drink && (
                        <div className='d-flex justify-content-between align-items-center mb-3'>
                            <div className='d-flex align-items-center'>
                                <h4 className="me-3">Boisson :</h4>
                                <img src={`https://maro.alwaysdata.net/${selectedDetail.drinkImg}`} alt={selectedDetail.drink} style={{ width: '50px', height: '50px' }} />
                            </div>
                            <Button variant="outline-primary">Modifier</Button>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer className='justify-content-between'>
                    <Button className='col-8' variant="danger" onClick={() => onRemoveItem(selectedDetail.index)}>
                        Supprimer
                    </Button>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Fermer
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default OrderSummary;
