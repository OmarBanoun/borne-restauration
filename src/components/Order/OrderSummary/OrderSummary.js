// OrderSummary.jsx
import React, { useState, useEffect } from "react";
import { calculateTotal, calculateItemPrice } from "../../utils";
import { Modal, Button } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";
import { Delete } from "@mui/icons-material";
import Swal from "sweetalert2";
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";
// import { Link } from 'react-router-dom';
import "./OrderSummary.css";

const OrderSummary = ({
    orderItems,
    onEditItem,
    onRemoveItem,
    onFinalizeOrder,
    steps,
}) => {
    console.log("Order Items dans OrderSummary:", orderItems);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedDetail, setSelectedDetail] = useState({});
    const [editingCategory, setEditingCategory] = useState(null);
    const [cancelOrder, setCancelOrder] = useState(null);
    const [swiperHeight, setSwiperHeight] = useState("auto");

    const handleShowDetailsModal = (item, index) => {
        setSelectedDetail({
            ...item,
            index,
            options: item.options || {},
        });
        setShowDetailsModal(true);
        setEditingCategory(null);
        setCancelOrder(item, index);
    };

    const handleCloseDetailsModal = () => {
        setShowDetailsModal(false);
    };

    const handleOptionSelect = (stepName, selectedOption) => {
        setSelectedDetail((prevState) => {
            const currentStepOptions = prevState.options[stepName] || [];
            const step = steps.find((s) => s.nom === stepName);

            let updatedOptions;
            if (currentStepOptions.some((opt) => opt._id === selectedOption._id)) {
                updatedOptions = {
                    ...prevState.options,
                    [stepName]: currentStepOptions.filter(
                        (opt) => opt._id !== selectedOption._id
                    ),
                };
            } else {
                if (step.maxOptions && step.maxOptions > 0) {
                    if (currentStepOptions.length >= step.maxOptions) {
                        Swal.fire({
                            title: "Maximum atteint !",
                            text: `Vous ne pouvez sélectionner que ${step.maxOptions} option(s)`,
                            icon: "warning",
                        });
                        return prevState;
                    }
                }

                if (step.type === "single" || step.maxOptions === 1) {
                    updatedOptions = {
                        ...prevState.options,
                        [stepName]: [selectedOption],
                    };
                } else {
                    updatedOptions = {
                        ...prevState.options,
                        [stepName]: [...currentStepOptions, selectedOption],
                    };
                }
            }

            const updatedItem = {
                ...prevState,
                options: updatedOptions,
                prix: calculateItemPrice({ ...prevState, options: updatedOptions })
            };
            console.log("Item mis à jour dans OrderSummary:", updatedItem);
            return updatedItem;
        });
    };

    const handleCancelOrder = (item, index) => {
        setCancelOrder(item, index);
    };

    return (
        <div className="summary-section mb-0">
            <div className="order-product d-flex flex-row col-8">
                {orderItems.map((item, index) => (
                    <div key={index} className="my-auto">
                        <div className="card">
                            <div className="d-flex justify-content-end">
                                <button
                                    onClick={() => onRemoveItem(index)}
                                    className="d-flex btn text-danger"
                                >
                                    <strong>❌</strong>
                                </button>
                            </div>
                            <img
                                src={`https://maro.alwaysdata.net/${item.imageUrl}`}
                                alt={item.nom}
                                className="card-img-top img-fluid"
                            />
                            <div className="card-body">
                                <h5 className="card-title">{item.nom}</h5>
                                <p className="card-text itemPrice mb-4">
                                    {item.prix !== undefined
                                        ? item.prix.toFixed(2).replace(".", ",")
                                        : "0,00"}€
                                </p>
                                <button
                                    onClick={() => handleShowDetailsModal(item, index)}
                                    className="btn btn-warning text-white mb-4"
                                >
                                    Voir Détails
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="order-price my-auto text-center col-4">
                <div className="border-button">
                    <button
                        onClick={onFinalizeOrder}
                        type="button"
                        className="btn btn-warning btn-lg btn-block my-auto finish_button"
                    >
                        <div className="text-white td-none px-3">Finaliser ma commande</div>
                    </button>
                </div>
            </div>
            <Modal show={showDetailsModal} onHide={handleCloseDetailsModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Détails de l'Article</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {editingCategory ? (
                        <Swiper
                            style={{ height: swiperHeight }}
                            slidesPerView={1}
                            modules={[Pagination]}
                            pagination={{ clickable: true }}
                            className="mySwiper"
                        >
                            {Array.from(
                                {
                                    length: Math.ceil(
                                        steps.find((s) => s.nom === editingCategory)?.options
                                            .length / 9 || 0
                                    ),
                                },
                                (_, slideIndex) => (
                                    <SwiperSlide key={slideIndex}>
                                        <div className="container">
                                            <div className="row">
                                                {steps
                                                    .find((s) => s.nom === editingCategory)
                                                    ?.options.slice(slideIndex * 9, (slideIndex + 1) * 9)
                                                    .map((option, index) => (
                                                        <div
                                                            key={index}
                                                            className={`col-4 ${
                                                                selectedDetail.options[editingCategory]?.some(
                                                                    (opt) => opt._id === option._id
                                                                )
                                                                    ? "selected-class"
                                                                    : ""
                                                            }`}
                                                            onClick={() =>
                                                                handleOptionSelect(editingCategory, option)
                                                            }
                                                        >
                                                            <img
                                                                src={`https://maro.alwaysdata.net/${option.imageUrl}`}
                                                                alt={option.nom}
                                                                className="img-fluid img-detail"
                                                            />
                                                            <div className="text-center itemName">
                                                                {option.nom}
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                )
                            )}
                        </Swiper>
                    ) : (
                        <>
                            <img
                                src={`https://maro.alwaysdata.net/${selectedDetail.imageUrl}`}
                                alt={selectedDetail.nom}
                                className="card-img-top img-top-detail img-fluid d-flex mx-auto"
                            />
                            <h3 className="text-center">{selectedDetail.nom}</h3>
                            <h3 className="card-text itemPrice text-center pt-1">
                                {selectedDetail.prix !== undefined ? selectedDetail.prix.toFixed(2).replace(".", ",") : "0,00"}€
                            </h3>
                            <hr />
                            {steps.map(
                                (step) =>
                                    selectedDetail.options &&
                                    selectedDetail.options[step.nom]?.length > 0 && (
                                        <div
                                            key={step.nom}
                                            className="d-flex justify-content-between align-items-center mb-3"
                                        >
                                            <div className="d-flex align-items-center">
                                                <h4 className="me-3">{step.nom} :</h4>
                                                <div style={{ display: "flex", gap: "10px" }}>
                                                    {selectedDetail.options[step.nom].map(
                                                        (option, index) => (
                                                            <img
                                                                key={index}
                                                                src={`https://maro.alwaysdata.net/${option.imageUrl}`}
                                                                alt={option.nom}
                                                                style={{ width: "50px", height: "50px" }}
                                                            />
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                            <Button
                                                variant="outline-primary"
                                                onClick={() => setEditingCategory(step.nom)}
                                            >
                                                Modifier
                                            </Button>
                                        </div>
                                    )
                            )}
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer className="justify-content-between">
                    {editingCategory ? (
                        <>
                            <Button
                                className="btn-warning text-white col-8"
                                onClick={() => {
                                    onEditItem(selectedDetail);
                                    setEditingCategory(null);
                                }}
                            >
                                Sauvegarder
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() =>
                                    handleCancelOrder(selectedDetail, selectedDetail.index)
                                }
                            >
                                Annuler
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                className="col-8 btn-warning text-white"
                                onClick={handleCloseDetailsModal}
                            >
                                Retour à la commande
                            </Button>
                            <Button
                                variant="danger"
                                className="col-2"
                                onClick={() => {
                                    onRemoveItem(selectedDetail.index);
                                    handleCloseDetailsModal();
                                }}
                            >
                                <Delete color="white" />
                            </Button>
                        </>
                    )}
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default OrderSummary;
