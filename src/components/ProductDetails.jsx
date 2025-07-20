import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { AppContext } from "../App";
import "./CSS/ProductDetails.css";

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const { id } = useParams();
  const { cart, setCart } = useContext(AppContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:8081/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };

    fetchProduct();
  }, [id]);

  const addToCart = () => {
    if (!selectedSize) {
      alert("Please select a size before adding to cart.");
      return;
    }

    const found = cart.find((item) => item._id === product._id);
    if (!found) {
      const itemToAdd = { ...product, qty: 1, size: selectedSize };
      setCart([...cart, itemToAdd]);
    } else {
      alert("Product already in cart.");
    }
  };

  if (!product) return <p>Loading product...</p>;

  return (
    <div className="product-details-container">
      <h2>{product.productName}</h2>
      <img src={product.imgUrl} alt={product.productName} />
      <p><strong>Category:</strong> {product.category}</p>
      <p><strong>Price:</strong> ₹{product.price}</p>
      <p><strong>Description:</strong> {product.description}</p>

      <div className="size-selector">
        <label htmlFor="size"><strong>Select Size:</strong></label>
        <select
          id="size"
          value={selectedSize}
          onChange={(e) => setSelectedSize(e.target.value)}
        >
          <option value="">-- Select Size --</option>
          <option value="S">Small (S)</option>
          <option value="M">Medium (M)</option>
          <option value="L">Large (L)</option>
          <option value="XL">Extra Large (XL)</option>
        </select>
      </div>

      <button className="add-to-cart-button" onClick={addToCart}>
        Add to Cart
      </button>
    </div>
  );
};

export default ProductDetails;
