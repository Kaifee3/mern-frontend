import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../App";
import "./CSS/Order.css";

export default function Order() {
  const API_URL = import.meta.env.VITE_API_URL;
  const { user } = useContext(AppContext);
  const [error, setError] = useState();
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const url = `${API_URL}/api/orders/user/${user.email}`;
      const result = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setOrders(result.data);
    } catch (err) {
      console.log(err);
      setError("Something went wrong");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="order-container">
      <h3 className="order-title">My Orders</h3>
      {orders.length === 0 && <p>No orders found.</p>}
      {orders &&
        orders.map((order) => (
          <div className="order-card" key={order._id}>
            <p className="order-info">
              <strong>Order ID:</strong> {order._id}
            </p>
            <p className="order-info">
              <strong>Order Value:</strong> ₹{order.orderValue}
            </p>
            <p className="order-info order-status">
              <strong>Status:</strong> {order.status}
            </p>

            <table className="order-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Image</th>
                  <th>Price (₹)</th>
                  <th>Quantity</th>
                  <th>Total (₹)</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.productName}</td>
                    <td>
                      <img
                        className="order-product-image"
                        src={item.imgUrl}
                        alt={item.productName}
                      />
                    </td>
                    <td>{item.price}</td>
                    <td>{item.qty}</td>
                    <td>{item.qty * item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <hr />
          </div>
        ))}
    </div>
  );
}
