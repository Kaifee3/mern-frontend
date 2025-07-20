import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./CSS/Products.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState();
  const frmRef = useRef();
  const [form, setForm] = useState({
    productName: "",
    description: "",
    price: "",
    imgUrl: "",
  });
  const [page, setPage] = useState(1);
  const [searchVal, setSearchVal] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(2);
  const [editId, setEditId] = useState();

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchProducts = async (customPage = page, customSearch = searchVal) => {
    try {
      setError("Loading...");
      const url = `${API_URL}/api/products/?page=${customPage}&limit=${limit}&search=${customSearch}`;
      const result = await axios.get(url);
      setProducts(result.data.products);
      setTotalPages(result.data.total);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/products/${id}`);
      setError("Product deleted successfully");
      fetchProducts();
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const frm = frmRef.current;
    if (!frm.checkValidity()) {
      frm.reportValidity();
      return;
    }
    try {
      await axios.post(`${API_URL}/api/products`, form);
      setError("Product added successfully");
      resetForm();
      setPage(1); 
      fetchProducts(1);
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }
  };

  const handleEdit = (product) => {
    setEditId(product._id);
    setForm({
      productName: product.productName,
      description: product.description,
      price: product.price,
      imgUrl: product.imgUrl,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const frm = frmRef.current;
    if (!frm.checkValidity()) {
      frm.reportValidity();
      return;
    }
    try {
      await axios.patch(`${API_URL}/api/products/${editId}`, form);
      setError("Product updated successfully");
      resetForm();
      setEditId();
      fetchProducts();
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }
  };

  const handleCancel = () => {
    setEditId();
    resetForm();
  };

  const handleSearch = () => {
    setPage(1);
    fetchProducts(1, searchVal);
  };

  const resetForm = () => {
    setForm({
      productName: "",
      description: "",
      price: "",
      imgUrl: "",
    });
  };

  return (
    <div className="product-container">
      <h2>Product Management</h2>
      {error && <p className="error">{error}</p>}

      {/* Form */}
      <form ref={frmRef} className="product-form">
        <input
          name="productName"
          value={form.productName}
          type="text"
          placeholder="Product Name"
          onChange={handleChange}
          required
        />
        <input
          name="description"
          value={form.description}
          type="text"
          placeholder="Description"
          onChange={handleChange}
          required
        />
        <input
          name="price"
          value={form.price}
          type="number"
          placeholder="Price"
          onChange={handleChange}
          required
        />
        <input
          name="imgUrl"
          value={form.imgUrl}
          type="text"
          placeholder="Image URL"
          onChange={handleChange}
          required
        />
        {editId ? (
          <>
            <button type="submit" onClick={handleUpdate}>Update</button>
            <button type="button" onClick={handleCancel}>Cancel</button>
          </>
        ) : (
          <button type="submit" onClick={handleAdd}>Add</button>
        )}
      </form>

      {/* Search Box */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search Products..."
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Product Table */}
      <table className="product-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Image</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((value) => (
            <tr key={value._id}>
              <td>{value.productName}</td>
              <td>{value.description}</td>
              <td>₹{value.price}</td>
              <td>
                <img src={value.imgUrl} alt={value.productName} width="50" />
              </td>
              <td className="action-buttons">
                <button className="edit-btn" onClick={() => handleEdit(value)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(value._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button disabled={page === 1}  onClick={() => setPage(page - 1)}>Previous</button>
        <span>Page {page} of {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}
