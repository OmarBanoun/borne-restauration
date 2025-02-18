import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import orderType from "../Menu/Menu";

const socket = io("https://maro.alwaysdata.net");

function RealTimeOrdering() {
	const [orders, setOrders] = useState(() => {
		const storedOrders = localStorage.getItem("orders");
		return storedOrders ? JSON.parse(storedOrders) : [];
	});

	const [readyOrders, setReadyOrders] = useState(() => {
		const storedReadyOrders = localStorage.getItem("readyOrders");
		return storedReadyOrders ? JSON.parse(storedReadyOrders) : [];
	});

  useEffect(() => {
    socket.on("order-confirmed", async (newOrder) => {
        console.log("Nouvelle commande reçue :", newOrder);
        
        try {
            setOrders(prevOrders => {
                const updatedOrders = [...prevOrders, newOrder];
                localStorage.setItem("orders", JSON.stringify(updatedOrders));
                return updatedOrders;
            });
        } catch (error) {
            console.error("Erreur lors de l'ajout de la commande:", error);
        }
    });

    return () => {
        socket.off("order-confirmed");
    };
}, []);

	const handleReadyClick = (order) => {
		setReadyOrders((prevReadyOrders) => {
			const updatedReadyOrders = [...prevReadyOrders, order];
			localStorage.setItem("readyOrders", JSON.stringify(updatedReadyOrders));
			return updatedReadyOrders;
		});
		setOrders((prevOrders) => {
			const updatedOrders = prevOrders.filter((o) => o !== order);
			localStorage.setItem("orders", JSON.stringify(updatedOrders));
			return updatedOrders;
		});
	};

	const handleServedClick = (order) => {
		setReadyOrders((prevReadyOrders) => {
			const updatedReadyOrders = prevReadyOrders.filter((o) => o !== order);
			localStorage.setItem("readyOrders", JSON.stringify(updatedReadyOrders));
			return updatedReadyOrders;
		});
	};

	return (
		<div>
			<div className="row">
				<div className="col-6">
					<h2 className="my-5 text-center">
						Commandes en Préparation{" "}
						<i
							class="fa-regular fa-hourglass-half pt-1 primary-color"
							style={{ marginLeft: "15px" }}
						></i>
					</h2>
					<ul
						className="d-flex flex-wrap"
						style={{ borderRight: "3px solid #a7a7a7", minHeight: "500px" }}
					>
						{orders.map((order) => (
							<li key={order._id} className="card my-2">
								<div className="card-body d-flex flex-column">
									<div className="mb-3">
										<h4 className="card-title">N°{order.orderNumber}</h4>
										{order.items &&
											order.items.map((item, itemIndex) => (
												<div key={itemIndex} className="d-flex flex-column">
													<h5 className="card-title">{item.nom}</h5>
													<p className="card-text">{item.type}</p>
													{item.options &&
														Object.entries(item.options).map(
															([stepName, options]) =>
																options &&
																options.length > 0 && (
																	<div key={stepName} className="mb-3">
																		<h6>{stepName}:</h6>
																		<div className="d-flex flex-wrap gap-2 justify-content-center">
																			{options.map((option, optionIndex) => (
																				<div
																					key={optionIndex}
																					className="list-style-none"
																				>
																					{option.nom}
																				</div>
																			))}
																		</div>
																	</div>
																)
														)}
													<hr />
												</div>
											))}
										<p>
											<strong>Type de commande :</strong>{" "}
											{order.orderType === "a_emporter"
												? "À emporter"
												: "Sur Place"}
										</p>
										<p>
											<strong>Total :</strong>{" "}
											{order.total.toFixed(2).replace(".", ",")}€
										</p>
									</div>
									<button
										className="btn btn-success d-flex justify-content-evenly align-items-center col-10 mx-auto mt-auto py-3"
										onClick={() => handleReadyClick(order)}
									>
										<b>Prêt</b> <i className="fas fa-check text-white pt-1"></i>
									</button>
								</div>
							</li>
						))}
					</ul>
				</div>

				<div className="col-6">
					<h2 className="my-5 text-center">
						Commandes Prêtes{" "}
						<i
							className="fas fa-square-check text-success pt-1"
							style={{ marginLeft: "15px" }}
						></i>
					</h2>
					<ul className="d-flex flex-wrap">
						{readyOrders.map((order) => (
							<li key={order._id} className="card my-2">
								<div className="card-body">
									<h4 className="card-title">N°{order.orderNumber}</h4>
									{order.items &&
										order.items.map((item, itemIndex) => (
											<div key={itemIndex} className="d-flex flex-column">
												<h5 className="card-title">{item.nom}</h5>
												<p className="card-text">{item.type}</p>
												{item.options &&
													Object.entries(item.options).map(
														([stepName, options]) =>
															options &&
															options.length > 0 && (
																<div key={stepName} className="mb-3">
																	<h6>{stepName}:</h6>
																	<div className="d-flex flex-wrap gap-2 justify-content-center">
																		{options.map((option, optionIndex) => (
																			<div
																				key={optionIndex}
																				className="list-style-none"
																			>
																				{option.nom}
																			</div>
																		))}
																	</div>
																</div>
															)
													)}
												<hr />
											</div>
										))}
									<p>
										<strong>Type de commande :</strong>{" "}
										{order.orderType === "a_emporter"
											? "À emporter"
											: "Sur Place"}
									</p>
									<p>
										<strong>Total :</strong>{" "}
										{order.total.toFixed(2).replace(".", ",")}€
									</p>
									<button
										className="btn btn-success d-flex justify-content-evenly align-items-center col-8 mx-auto mb-2"
										onClick={() => handleServedClick(order)}
									>
										<b>Servi</b>{" "}
										<i className="fas fa-check text-white pt-1"></i>
									</button>
								</div>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}

export default RealTimeOrdering;
