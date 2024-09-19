import React from "react";
import './bgitem.css'
import { Link } from "react-router-dom";

export default function ProductItem(props) {
    const handleBuy = async () => {
        try {
            if (props.data.stock <= 0) {
                throw new Error("สินค้าหมดในสต็อก");
            }
    
            const response = await fetch(
                "http://localhost:3000/api/buy-product",
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + localStorage.getItem("access_token")
                    },
                    body: JSON.stringify({ productId: props.data.product_id, price: props.data.price })
                }
            );
            if (!response.ok) {
                throw new Error("Failed to buy product");
            }
            
            const moneyResponse = await fetch("http://localhost:3000/api/money", {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("access_token")
                }
            });
            const moneyJson = await moneyResponse.json();
            const reMoney = moneyJson.data;
            
            alert(`ซื้อสินค้าสำเร็จ ยอดคงเหลือ ${reMoney} บาท`);
            
            window.location.reload();
        } catch (error) {
            console.error("Error buying product:", error);
            
            if (error.message === "สินค้าหมดในสต็อก") {
                alert("ไม่มีสินค้าในสต็อก");
            } else {
                alert("เงินในบัญชีมีไม่เพียงพอ");
            }
        }
    };
    
    
    

    return (
        <>
            <div className="row border rounded shadow-sm col-md-4 mt-2">
                <div className="col-1">
                    <div className="containerrr">
                    <img src={`http://localhost:3000/images/${props.data.image_url}`} width={100} alt={props.data.product_name} style={{ borderRadius: '10px', border: '1px solid green', padding: '60%' ,marginTop:'10px',marginBottom:'10px'}}x />
                    </div>
                </div>
                <div className="col-5" style={{marginLeft:'90px',marginTop:'10px'}}>
                    <h5 className="text-primary" style={{fontFamily:' Cambria, Cochin, Georgia, Times'}}>{props.data.product_name}</h5>
                    <button onClick={handleBuy} className="btn btn-outline-primary me-3">ซื้อ</button>
                    <button type="button" className="btn btn-outline-danger">ลบ</button>
                </div>
                <div className="col-2" style={{marginTop:"40px",marginRight:'20px'}}>
                    <span className="text-danger fs-4" style={{fontSize:'50px',fontFamily:' Cambria, Cochin, Georgia, Times'}}>${props.data.price}</span>
                </div>
            </div>
        </>
    );
}
