import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { AppContext } from "../App";
import "./CSS/Product.css";

export default function Product() {
  const API_URL = import.meta.env.VITE_API_URL;
  const { cart, setCart, products, setProducts } = useContext(AppContext);
  const [allProducts, setAllProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/products/all`);
      setProducts(data.products);
      setAllProducts(data.products);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      setAllProducts(products);
    }
  }, [products]);

  const addToCart = (product) => {
    const found = cart.find((item) => item._id === product._id);
    if (!found) {
      product.qty = 1;
      setCart([...cart, product]);
    }
  };

  return (
    <div>
      <div className="carousel-container">
        <Carousel
          showThumbs={false}
          autoPlay
          infiniteLoop
          interval={3000}
          showStatus={false}
          showArrows={true}
        >
          <div>
            <img src="/images/sl1.jpg" alt="Slide 1" />
            <p className="legend">Welcome to Our Store</p>
          </div>
          <div>
            <img src="/images/sl2.jpg" alt="Slide 2" />
            <p className="legend">Exclusive Deals</p>
          </div>
          <div>
            <img src="/images/sl3.jpg" alt="Slide 3" />
            <p className="legend">New Arrivals</p>
          </div>
        </Carousel>
      </div>

      <div className="product-container">
        {allProducts.map((product) => (
          <div className="product-card" key={product._id}>
            <Link to={`/product/${product._id}`}>
              <img
                className="product-image"
                src={product.imgUrl}
                alt={product.productName}
              />
            </Link>
            <h3 className="product-title">{product.productName}</h3>
            <p className="product-description">{product.description}</p>
            <h4 className="product-price">₹{product.price}</h4>
            <div className="product-actions">
            <Link to={`/product/${product._id}`}>
              <button className="view-details-button">
                View Details
              </button>
            </Link>

            <Link to={`/product/${product._id}`}>
              <button className="view-details-button">
                Buy Now
              </button>
            </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
