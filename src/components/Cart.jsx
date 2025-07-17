import React, { useState } from "react";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../App";
import axios from "axios";
import "./Cart.css";
export default function Cart() {
  const { user, cart, setCart } = useContext(AppContext);
  const [orderValue, setOrderValue] = useState(0);
  const [error, setError] = useState();
  const Navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const increment = (id, qty) => {
    const updatedCart = cart.map((product) =>
      product._id === id ? { ...product, qty: qty + 1 } : product
    );
    setCart(updatedCart);
  };

  const decrement = (id, qty) => {
    const updatedCart = cart.map((product) =>
      product._id === id ? { ...product, qty: qty - 1 } : product
    );
    setCart(updatedCart);
  };

  useEffect(() => {
    setOrderValue(
      cart.reduce((sum, value) => {
        return sum + value.qty * value.price;
      }, 0)
    );
  }, [cart]);

  const placeOrder = async () => {
    try {
      const url = `${API_URL}/api/orders`;
      const newOrder = {
        userId: user._id,
        email: user.email,
        orderValue,
        items: cart,
      };
      const result = await axios.post(url, newOrder);
      setCart([]);
      Navigate("/order");
    } catch (err) {
      console.log(err);
      setError("Something went wrong");
    }
  };

  return (
    <div className="cart-container">
      <h2 className="cart-title">My Cart</h2>
      <p className="cart-error">{error}</p>
      {cart &&
        cart.map(
          (value) =>
            value.qty > 0 && (
              <li className="cart-item" key={value._id}>
                <img src={value.imgUrl} alt={value.productName} />
                <div className="cart-item-details">
                  <span className="cart-item-name">{value.productName}</span>
                  <span className="cart-item-price">₹{value.price}</span>
                  <span className="cart-qty-controls">
                    <button onClick={() => decrement(value._id, value.qty)}>
                      -
                    </button>
                    {value.qty}
                    <button onClick={() => increment(value._id, value.qty)}>
                      +
                    </button>
                  </span>
                  <span className="cart-item-total">
                    Total: ₹{value.price * value.qty}
                  </span>
                </div>
              </li>
            )
        )}
      <h5 className="order-summary">Order Value: ₹{orderValue}</h5>
      {user?.token ? (
        <button className="place-order-btn" onClick={placeOrder}>
          Place Order
        </button>
      ) : (
        <button className="login-btn" onClick={() => Navigate("/login")}>
          Login to Order
        </button>
      )}
    </div>
  );
}
