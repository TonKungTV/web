import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Form, Row, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';





export default function ProductDetail() {
    const [validated, setValidated] = useState(false);

    let params = useParams();

    const [productName, setProductName] = useState("");
    const [productTypes, setProductTypes] = useState([]);
    const [productTypeId, setProductTypeId] = useState(0);
    const [products, setProducts] = useState([]);
    const [price, setPrice] = useState(0);
    const [stock, setStock] = useState(0);


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
            //   console.log("Bearer " + localStorage.getItem("access_token"));
            let json = await response.json();
            setProductTypes(json.data);
        }
        fetchData();
    }, []);


    const doCreateProduct = async () => {
        const response = await fetch(
            "http://localhost:3000/api/product/add",
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    'Content-Type': 'application/json',
                    Authorization: "Bearer " + localStorage.getItem("access_token")
                },
                body: JSON.stringify({
                    product_name: productName,
                    product_type_id: productTypeId,
                    price: price,
                    stock: stock
                })
            }
        );
        let json = await response.json();
        if (json.result) {
            window.location = "/home";
        }
    }
    const onSave = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        console.log('777');
        if (form.checkValidity() === false) {
            alert(`กรุณากรอกข้อมูลให้ครบถ้วน`);
        } else {
            if (params.productId === "add") {
                doCreateProduct();
                alert(`Save complete!`);
            } else {
                doUpdateProduct();
            }
        }
        setValidated(true);
    }
    console.log('888');

    const doUpdateProduct = () => {

    }
    return (<>
        <div className="img" style={{height:'800px'}}>
            <>product detail ID: {params.productId}</>
            <div className="container m-auto">
                <Form noValidate validated={validated} onSubmit={onSave}>


                <Row className="mb-3">
                    <Form.Group as={Col} controlId="validateProductName">
                        <Form.Label>ชื่อสินค้า</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            value={productName}
                            placeholder="ชื่อสินค้า"
                            onChange={(e) => setProductName(e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                            กรุณากรอก ชื่อสินค้า
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} controlId="validateProductType">
                        <Form.Label>ประเภทสินค้า</Form.Label>
                        <Form.Select
                            value={productTypeId}
                            onChange={(e) => setProductTypeId(e.target.value)}
                            required>
                            <option label="กรุณาเลือกประเภทสินค้า"></option>
                            {
                                productTypes.map(item => (
                                    <option
                                        key={item.product_type_id}
                                        value={item.product_type_id}>{item.product_type_name}
                                    </option>
                                ))
                            }
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            กรุณาเลือก ประเภทสินค้า
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} controlId="validatePrice">
                        <Form.Label>ราคาสินค้า</Form.Label>
                        <Form.Control
                            required
                            type="number"
                            value={price}
                            min={0}
                            placeholder="ราคาสินค้า"
                            onChange={(e) => setPrice(e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                            กรุณากรอก ราคาสินค้า
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="validatePrice">
                        <Form.Label>จำนวนสินค้า</Form.Label>
                        <Form.Control
                            required
                            type="number"
                            value={stock}
                            min={0}
                            placeholder="จำนวนสินค้า"
                            onChange={(e) => setStock(e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                            กรุณากรอก จำนวนสินค้า
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Button variant="primary" type="submit" value="SAVE">SAVE</Button>
                </Row>
                </Form>
            </div>
            </div>
        </>
    );
}