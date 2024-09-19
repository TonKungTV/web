import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Form, Row, Col, Button } from 'react-bootstrap';





export default function HomePage(){
//     const [validated, setValidated] = useState(false);
    
//     let params = useParams();
    
//     const [productName, setProductName ] = useState("");
//     const [productTypes, setProductTypes] = useState([]);
//     const [productTypeId, setProductTypeId] = useState(0);
//     const [price, setPrice] = useState(0);
//     const [stock, setStock] = useState(0);


// useEffect(() => {
//     async function fetchData() {
//         const response = await fetch(
//             "http://localhost:8080/api/product_types",
//             {
//                 method: "GET",
//                 headers: {
//                     Accept: "application/json",
//                     'Content-Type': 'application/json',
//                     Authorization: "Bearer " + localStorage.getItem("access_token")
//                 }
//             }
//         );

//         let json = await response.json();
//         setProductTypes(json.data);
//     }

//     fetchData();
// }, []);

// const doCreateProduct = async () => {
//     const response = await fetch(
//         "http://localhost:8080/api/product/add",
//         {
//             method: "POST",
//             headers: {
//                 Accept: "application/json",
//                 'Content-Type': 'application/json',
//                 Authorization: "Bearer" + localStorage.getItem("access_token")
//             },
//             body: JSON.stringify({
//                 product_name: productName,
//                 product_type_id: productTypeId,
//                 price: price,
//                 stock: stock
//             })
//         }
//     );
//     let json = await response.json();
//     if (json.result) {
//         window.location = "/home";
//     }
// }

// const onSave = (event) => {
//     const form = event.currentTarget;
//     event.preventDefault();

//     if (!form.checkValidity()) {
//             alert(`กรุณากรอกข้อมูลให้ครบถ้วน`);
//         } else {
//             if (params.productId === "add") {
//                 doCreateProduct();
//                 alert(`Save complete!`);
//             } else {
//                 doCreateProduct();
//             }
//         }
//     setValidated(true);
// }
return (
    <>
        สวัสดีครับท่านสมาชิกชมรมผู้เจริญ
    </>
);
}