import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../App";
import "./CSS/Orders.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(3);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState("");
  const { user } = useContext(AppContext);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchOrders = async () => {
    try {
      const url = `${API_URL}/api/orders/all?page=${page}&limit=${limit}&status=${status}`;
      const result = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setOrders(result.data.orders);
      setTotalPages(result.data.total);
    } catch (err) {
      console.log("Error fetching orders:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [status, page]);

  const updateOrder = async (status, id) => {
    try {
      const url = `${API_URL}/api/orders/${id}`;
      await axios.patch(url, { status });
      fetchOrders();
    } catch (err) {
      console.log(err);
      setError("Something went wrong");
    }
  };

  return (
    <div className="orders-container">
      <h2 className="orders-title">Order Management</h2>

      <div className="orders-filter">
        <select
          className="orders-select"
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All</option>
          <option value="Pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <ul className="orders-list">
        {orders &&
          orders.map((order) => (
            <li key={order._id} className="order-item">
              <div>
                <strong>Order ID:</strong> {order._id}
              </div>
              <div>
                <strong>Customer:</strong> {order.shippingName}
              </div>
              <div>
                <strong>Address:</strong> {order.shippingAddress}
              </div>
              <div>
                <strong>Value:</strong> ₹{order.orderValue}
              </div>
              <div>
                <strong>Status:</strong> {order.status}
              </div>

              {/* 📦 Show Items with Size */}
              <div className="order-item">
                <div>
                  <strong>Items:</strong>
                </div>
                <ul>
                  {order.items.map((item, index) => (
                    <li key={index}>
                      <span className="item-name">{item.productName}</span>
                      <span className="item-quantity">{item.qty} pcs</span>
                      <span className="item-size">Size: {item.size}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {order.status === "Pending" && (
                <div className="order-actions">
                  <button
                    className="cancel-button"
                    onClick={() => updateOrder("cancelled", order._id)}
                  >
                    Cancel
                  </button>
                  <button
                    className="complete-button"
                    onClick={() => updateOrder("completed", order._id)}
                  >
                    Complete
                  </button>
                </div>
              )}
            </li>
          ))}
      </ul>

      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="pagination-button"
        >
          Previous
        </button>
        <span className="pagination-info">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="pagination-button"
        >
          Next
        </button>
      </div>

      {error && <p className="orders-error">{error}</p>}
    </div>
  );
}
