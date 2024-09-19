import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import ProductItem from "./ProductItem";
import './Home.css';
import './style.css'






export default function Money() {
    const [money, setMoney] = useState(null);



    async function addMoney(amount) {
        try {
            const response = await fetch(
                "http://localhost:3000/api/addmoney",
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + localStorage.getItem("access_token")
                    },
                    body: JSON.stringify({ amount })
                }
            );
            if (!response.ok) {
                throw new Error("Failed to add money");
            }
            const json = await response.json();
            alert(`เติมเงิน ${amount} บาท สำเร็จ!`);
            console.log("Money added successfully:", json);
        } catch (error) {
            console.error("Error adding money:", error);
            alert("เกิดข้อผิดพลาดในการเพิ่มเงิน");
        }
    }

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

    async function addMoney(amount) {
        try {
            const response = await fetch(
                "http://localhost:3000/api/addmoney",
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + localStorage.getItem("access_token")
                    },
                    body: JSON.stringify({ amount })
                }
            );
            if (!response.ok) {
                throw new Error("Failed to add money");
            }

            const json = await response.json();
            alert(`เติมเงิน ${amount} บาท สำเร็จ!`);
            console.log("Money added successfully:", json);


            fetchMoney();
        } catch (error) {
            console.error("Error adding money:", error);
            alert("เกิดข้อผิดพลาดในการเพิ่มเงิน");
        }
    }

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
                throw new Error("Failed to fetch money");
            }
            const json = await response.json();
            setMoney(json.data); // อัพเดท state ของยอดเงินใน React component
        } catch (error) {
            console.error("Error fetching money:", error);
            alert("เกิดข้อผิดพลาดในการดึงข้อมูลยอดเงิน");
        }
    }




    console.log(money);

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
                <p style={{height:'700px'}}>
                <div className="img">
                    <div className="content">
                        <div class="modal-dialog modal-dialog-centered">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5>ระบบเติมเงิน</h5>
                                    <button onClick={() => addMoney(50)}>เติมเงิน 50$</button>
                                    <button onClick={() => addMoney(100)}>เติมเงิน 100$</button>
                                    <button onClick={() => addMoney(500)}>เติมเงิน 500$</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </p>
                <footer></footer>
            </>
        );
    } else {
        console.error();
        return <Navigate to="/" replace />;
    }
}