import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import orderType from '../Menu/Menu';

const socket = io('https://maro.alwaysdata.net');

function RealTimeOrdering() {
    const [orders, setOrders] = useState(() => {
        const storedOrders = localStorage.getItem('orders');
        return storedOrders ? JSON.parse(storedOrders) : [];
    });

    const [readyOrders, setReadyOrders] = useState(() => {
    const storedReadyOrders = localStorage.getItem('readyOrders');
    return storedReadyOrders ? JSON.parse(storedReadyOrders) : [];
    });

    useEffect(() => {
    socket.on('order-confirmed', (newOrder) => {
        const orderArray = Array.isArray(newOrder) ? newOrder : [newOrder];
        setOrders(prevOrders => {
        const updatedOrders = [...prevOrders, ...orderArray];
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
        return updatedOrders;
        });
    });

    return () => {
        socket.off('order-confirmed');
    };
    }, []);

    const handleReadyClick = (order) => {
    setReadyOrders(prevReadyOrders => {
        const updatedReadyOrders = [...prevReadyOrders, order];
        localStorage.setItem('readyOrders', JSON.stringify(updatedReadyOrders));
        return updatedReadyOrders;
    });
    setOrders(prevOrders => {
        const updatedOrders = prevOrders.filter((o) => o !== order);
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
        return updatedOrders;
    });
    };

    const handleServedClick = (order) => {
    setReadyOrders(prevReadyOrders => {
        const updatedReadyOrders = prevReadyOrders.filter((o) => o !== order);
        localStorage.setItem('readyOrders', JSON.stringify(updatedReadyOrders));
        return updatedReadyOrders;
    });
    };

  return (
    <div>
      <div className='row'>
        <div className='col-6'>
          <h2 className='my-5 text-center'>Commandes Confirmées <i class="fa-regular fa-hourglass-half pt-1 primary-color" style={{ marginLeft: '15px' }}></i></h2>
          <ul className='d-flex flex-wrap' style={{ borderRight: '3px solid #a7a7a7', minHeight: '500px' }}>
            {orders.map((order) => (
              <li key={order.id} className="card my-2"> {/* Use order.id as unique key */}
                <div className="card-body d-flex flex-column">
                <div className='mb-3'>
                  <h4 className='card-title'>N°{order.orderNumber}</h4>
                  {order.orderItems && order.orderItems.map((item, itemIndex) => (
                    <div key={itemIndex} className='d-flex flex-column'> {/* Use itemIndex as key for orderItems */}
                      <h5 className="card-title">{item.nom}</h5>
                      <p className="card-text">{item.option}</p>
                      {item.pain && (
                        <div className='mb-3'>
                          <h6>Pain:</h6>
                          <p className="card-text">{item.pain}</p>
                        </div>
                      )}
                      {item.garnitures && item.garnitures.length > 0 && (
                        <div className='mb-3'>
                          <h6>Garnitures:</h6>
                          {item.garnitures.map((garniture, garnitureIndex) => (
                            <div className='list-style-none' key={garnitureIndex}>{garniture.nom}</div>
                          ))}
                        </div>
                      )}
                      {item.sauces && item.sauces.length > 0 && (
                        <div className='mb-3'>
                          <h6>Sauces:</h6>
                          {item.sauces.map((sauce, sauceIndex) => (
                            <div key={sauceIndex}>{sauce.nom}</div>
                          ))}
                        </div>
                      )}
                      {item.drink && (
                        <div className='mb-3'>
                          <h6>Boisson:</h6>
                          <p className="card-text">{item.drink}</p>
                        </div>
                      )}
                      <hr />
                      <p className="card-text">{orderType === 'a_emporter' ? 'À emporter' : 'Sur Place'}</p>
                    </div>
                  ))}
                </div>
                <button className="btn btn-success d-flex justify-content-evenly align-items-center col-10 mx-auto mt-auto py-3" onClick={() => handleReadyClick(order)}><b>Prêt</b> <i className="fas fa-check text-white pt-1"></i></button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className='col-6'>
          <h2 className='my-5 text-center'>Commandes Prêtes <i className="fas fa-square-check text-success pt-1" style={{ marginLeft: '15px' }}></i></h2>
          <ul className='d-flex flex-wrap'>
            {readyOrders.map((order) => (
              <li key={order.id} className="card my-2"> {/* Use order.id as unique key */}
                <div className="card-body">
                  <h4 className='card-title'>N°{order.orderNumber}</h4>
                  {order.orderItems.map((item, itemIndex) => (
                    <div key={itemIndex}> {/* Use itemIndex as key for orderItems */}
                      <h5 className="card-title">{item.nom}</h5>
                      <p className="card-text">{item.option}</p>
                      <button className="btn btn-success d-flex justify-content-evenly align-items-center col-8 mx-auto mb-2" onClick={() => handleServedClick(order)} ><b>Servi</b> <i className="fas fa-check text-white pt-1"></i></button>
                    </div>
                  ))}
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

