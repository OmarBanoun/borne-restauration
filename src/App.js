// import logo from './logo.svg';
import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from "./components/Common/Header/Header";
import Home from './components/Home/Home';
import Order from './components/Order/Order';
import OrderSummaryPage from './components/Order/Confirmation/OrderSummaryPage';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaiementForm from './components/Order/PaiementForm/PaiementForm';
import Admin from './admin/AdminDashboard';
import CreateCategory from './admin/Categories/CreateCategoryPage';
import CreateArticle from './admin/Articles/CreateArticlePage';
import EditArticle from './admin/Articles/EditArticle';
import EditCategory from './admin/Categories/EditCategory';
import CreateSupplement from './admin/Supplements/CreateSupplement';
import EditSupplement from './admin/Supplements/EditSupplement';
import CreateSecondaryArticle from './admin/SecondaryArticle/CreateSecondaryArticle';
import EditSecondaryArticle from './admin/SecondaryArticle/EditSecondaryArticle';
import CreateStepPage from './admin/Step/CreateStepPage';
import EditStep from './admin/Step/EditStep';
import LoginPage from './admin/loginForm';
import PrivateRoute from './admin/PrivateRoute';
import { AuthProvider } from './admin/AuthContext';
import RealTimeOrdering from './components/Order/RealTimeOrdering/RealTimeOrdering';
import { UseThemeSettings } from './components/Common/ThemeManager';
// import StepsManager from './admin/Step/StepPage';
import { useInactivityAlert } from './components/Common/InactivityAlert';
import VueComptoir from './VueComptoir/VueComptoir';

const stripePromise = loadStripe('pk_test_51Mbm5lB8C8ofx6bDkKoz0v3ywChiFZ0dQcCeugOjSpiKqLjE3cjcQWudzXvWER6omH7yDDhoReNTC8jvmZhdMM9S00CyxoCFLd');

function App() {
  UseThemeSettings();
  return (
    <AuthProvider>
    <Router>
      <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route 
          path="/admin/*" 
          element={
            <PrivateRoute>
            <Admin />
          </PrivateRoute>
          } 
      />
      <Route path="/admin/create-category" element={<CreateCategory />} />
      <Route path="/admin/create-article" element={<CreateArticle />} />
      <Route path='/admin/edit-article/:id' element={<EditArticle />} />
      <Route path='/admin/edit-category/:id' element={<EditCategory />} />
      <Route path='/admin/create-secondary-article/:type' element={<CreateSecondaryArticle />} />
      <Route path="/admin/edit-secondary-article/:type/:id" element={<EditSecondaryArticle />} />
      <Route path='/admin/create-supplement' element={<CreateSupplement />} />
      <Route path='/admin/edit-supplement/:id' element={<EditSupplement />} />
      {/* <Route path='/admin/step' element={<StepsManager />} /> */}
      <Route path='/admin/create-step' element={<CreateStepPage />} />
      <Route path='/admin/edit-step/:id' element={<EditStep />} />
      {/* <Route path='/admin/orders' element={<OrdersPage />} /> */}
      <Route path="/real-time-ordering" element={<RealTimeOrdering />} />
      <Route path="/vuecomptoir" element={<VueComptoir />} />
        <Route path="/" element={<LayoutWithHeader />}>
          <Route index element={<Home />} />
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
        </Route>
      </Routes>
    </Router>
    </AuthProvider>
  );
  }
  function LayoutWithHeader() {
    return (
      <div className="scale-container">
        <div className="app-container">
          <Header />
          <Outlet />
        </div>
      </div>
    );
  }

export default App;
