import 'bootstrap/dist/css/bootstrap.min.css';

import { useState } from 'react';
import { Form, Row, Col, Button,img,input } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


import md5 from "md5";


export default function Login() {

  const [validated, setValidated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  let navigate = useNavigate();
  
  const onLogin = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
        doLogin();
    }

    setValidated(true);
  }

  const doLogin = async() =>{
    const data1 = await getAuthenToken();
    console.log("data1: " , data1);
    if(data1.error) {
      console.log("Username ไม่ถูกต้อง");
      return;
    }
    // if(authToken.error){
    //   alert(`erorrrrrr`);
    //   return;
    // }
    const authToken = data1.data.auth_token;
    if (!authToken) {
      console.log("ไม่สามารถรับ auth_token ได้");
      return;
    }
    if(authToken === data1.data.auth_token){
    alert(`เข้าสู่ระบบเสร็จสิ้น ยินดีตอนรับ`);
    }else{
      alert(`ขอโต๊ด`);
    }
    
    
    const data2 = await getAccessToken(authToken);
    
    if(data2.error) {
      console.log("Password ไม่ถูกต้อง");
      return;
    }
  
    localStorage.setItem("access_token", data2.data.access_token);
    localStorage.setItem("user_id", data2.data.account_info.user_id);
    localStorage.setItem("username", username);
    localStorage.setItem("first_name", data2.data.account_info.first_name);
    localStorage.setItem("last_name", data2.data.account_info.last_name);
    localStorage.setItem("email", data2.data.account_info.email);
    localStorage.setItem("role_id", data2.data.account_info.role_id);
    localStorage.setItem("role_name", data2.data.account_info.role_name);
    
    navigate("home", { replace: false });
  }

  const getAuthenToken = async () => {
    const response = await fetch(
      "http://localhost:3000/api/authen_request",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: md5(username)
        })
      }
    );

    const data = await response.json();
    
    return data;
  };

  const getAccessToken = async (authToken) => {
    var baseString = username + "&" + md5(password);
    var authenSignature = md5(baseString);


    
    const response = await fetch(
      "http://localhost:3000/api/access_request",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          auth_signature: authenSignature,
          auth_token: authToken
        })
      }
    );

    const data = await response.json();
    console.log("data: " , data);
    return data;
  };

  return(
    <div className="test m-auto">
      {/* <Form noValidate validated={validated} onSubmit={onLogin}>
        <Row className="mb-3">
          <Form.Group as = {Col} controlId="validateUsername">
            <Form.Label> Username</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Enter Username"
              onChange={(e)=> setUsername(e.target.value)}
            />
            <Form.Control.Feedback type = "invalid">
              กรุณากรอก Username
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as = {Col} controlId="validatePassword">
            <Form.Label> Password</Form.Label>
            <Form.Control
              required
              type="password"
              placeholder="Password"
              onChange={(e)=> setPassword(e.target.value)}
            />
            <Form.Control.Feedback type = "invalid">
              กรุณากรอก Password
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row>
          <Col md={3}>
            <Button type = "submit"> Login </Button>
          </Col>
        </Row>
      </Form> */}
      <div >
      <div class="modal-dialog modal-dialog-centered" >
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">ระบบสมาชิก | Member</h5>
              {/* <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span>
              </button> */}
            </div>
            <div class="modal-body">
              {/* <img src="https://store.mc-csl.net/storage_img/ZVKhTXyeOd4nJ3g11707745441.png" class="modallogo" alt="icon"></img> */}
              <hr></hr>
              <div class="row justify-content-center">
                <div class="col-lg-8">

                <Form noValidate validated={validated} onSubmit={onLogin}>
        <Row className="mb-3">
          <Form.Group as = {Col} controlId="validateUsername">
            <Form.Label> Username</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Enter Username"
              onChange={(e)=> setUsername(e.target.value)}
            />
            <Form.Control.Feedback type = "invalid">
              กรุณากรอก Username
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as = {Col} controlId="validatePassword">
            <Form.Label> Password</Form.Label>
            <Form.Control
              required
              type="password"
              placeholder="Password"
              onChange={(e)=> setPassword(e.target.value)}
            />
            <Form.Control.Feedback type = "invalid">
              กรุณากรอก Password
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row>
          <Col md={3}>
            <Button type = "submit"> Login </Button>
          </Col>
        </Row>
      </Form>

                </div>
              </div>
            </div>
            <div class="modal-footer">
                          </div>
          </div>
        </div>
        </div>
    </div>
  );


}