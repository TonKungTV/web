import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import ProductItem from "./ProductItem";
import './Home.css';
import './style.css'






export default function ProductPage() {
  const [productTypes, setProductTypes] = useState([]);
  const [productTypeId, setProductTypeId] = useState(0);
  const [products, setProducts] = useState([]);
  const [money, setMoney] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        "http://localhost:3000/api/product_types",
        {
          medthod: "GET",
          headers: {
            Accept: "application/json",
            'Content-Type': 'application/json',
            Authorization: "Bearer " + localStorage.getItem("access_token")

          }
        }
      );
      console.log("Bearer " + localStorage.getItem("access_token"));
      let json = await response.json();
      setProductTypes(json.data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        "http://localhost:3000/api/products/type/" + productTypeId,
        {
          medthod: "GET",
          headers: {
            Accept: "application/json",
            'Content-Type': 'application/json',
            Authorization: "Bearer " + localStorage.getItem("access_token")
          }
        }
      );
      const json = await response.json();
      setProducts(json.data);
    }
    fetchData();
  }, [productTypeId]);

  useEffect(() => {
    async function fetchMoney() {
      try {
        const response = await fetch(
          "http://localhost:3000/api/money",
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("access_token")
            }
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch money data");
        }
        const json = await response.json();
        setMoney(json.data);
      } catch (error) {
        console.error("Error fetching money data:", error);
      }
    }
    fetchMoney();
  }, []);


  if (localStorage.getItem("access_token")) {
    return (
      <>
        <header>
          <div className="inheader">
            <Link className="homepagefont" to={`/home/`}>หน้าแรก</Link>
            <Link className="homepagefont" target="" to={`/productpage/`}>สินค้า</Link>
            <Link className="homepagefont" target="" to={`/addmoney/`}>เติมเงิน</Link>
            <Link className="fontheader" to={`#`}>ติดต่อ</Link>
            <p className="homepagefont">ยอดเงิน: ${money}</p>
          </div>
        </header>
        <div className="img">
          <div className="content">
            <select value={productTypeId} onChange={(e) => setProductTypeId(e.target.value)}>
              <option value={0}>ทุกประเภทสินค้า</option>
              {
                productTypes.map(item => (
                  <option key={item.product_type_id} value={item.product_type_id}>{item.product_type_name}</option>
                ))
              }
            </select>
            <Link to={"/product/add"} className="btn btn-outline-primary me-3">เพิ่ม</Link>
            <div className="container mt-3">
              {
                products.map(item => (
                  <ProductItem key={item.product_id} data={item} />
                ))
              }
            </div>
          </div>
        </div>
        <footer></footer>
      </>
    );
  } else {
    console.error();
    return <Navigate to="/" replace />;
  }
}