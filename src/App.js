// import logo from './logo.svg';
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from "./components/Common/Header/Header";
import Home from './components/Home/Home';
import Order from './components/Order/Order';
import OrderSummaryPage from './components/Order/Confirmation/OrderSummaryPage';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaiementForm from './components/Order/PaiementForm/PaiementForm';

const stripePromise = loadStripe('pk_test_51Mbm5lB8C8ofx6bDkKoz0v3ywChiFZ0dQcCeugOjSpiKqLjE3cjcQWudzXvWER6omH7yDDhoReNTC8jvmZhdMM9S00CyxoCFLd');

function App() {
  return (
    <Router>
    <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Order" element={
        <Elements stripe={stripePromise}>
        <Order />
        </Elements>
        } />
        <Route path="/order-summary" element={
        <Elements stripe={stripePromise}>
        <OrderSummaryPage />
        </Elements>
        } />
        <Route path="/paiement" element={
        <Elements stripe={stripePromise}>
        <PaiementForm />
        </Elements>
        } />
      </Routes>
    </Router>
  );
  }

export default App;
