import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import App from './App';
import Home from './pages/home';
import CartPage from './pages/cartPage'
import OrdersPage from './pages/ordersPage';
import {configureStore} from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { cartReducer, orderReducer, productReducer, userReducer } from './reducers';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import CheckoutPage from './pages/checkoutPage';
import ProductDetailsPage from './pages/productDetailsPage';
import LoginSignupPage from './pages/loginSignupPage';
import OrderSuccessPage from './pages/orderSuccessPage';
import NoPage from './pages/404';


const store = configureStore(
  {reducer:{
      product: productReducer,
      cart: cartReducer,
      order: orderReducer,
      user: userReducer
  }}
)


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="myorders" element={<OrdersPage />} />
        <Route path="login" element={<LoginSignupPage />} />
        <Route path="ordersuccess/:orderid" element={<OrderSuccessPage />} />
        <Route path="product/:productId" element={<ProductDetailsPage />} />
        <Route path="*" element={<NoPage />} />

      </Route>
    </Routes>
  </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
