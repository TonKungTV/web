import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import './Home.css';
import ProductItem from "./ProductItem";

export default function Home() {
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
  //   const [items, setItems] = useState([
  //       { id: 1, name: 'Potion', type: 'items', price: 50 },
  //       { id: 2, name: 'Armor', type: 'Equipment', price: 80 },
  //       { id: 3, name: 'Sword', type: 'Equipment', price: 120 },
  //       { id: 4, name: 'ไอเทมที่สี่', type: 'items', price: 100 },
  //   { id: 5, name: 'ไอทมที่ห้า', type: 'Equipment', price: 200 }
  // ]);

  // const [money, setMoney] = useState(100);
  // const [selectedItem, setSelectedItem] = useState(null);
  // const [quantity, setQuantity] = useState(1);
  // const [inventory, setInventory] = useState([]);

  // const Purchase = () => {
  //   if (!selectedItem) {
  //     alert('กรุณาเลือกไอเทมที่ต้องการซื้อ');
  //     return;
  //   }
  //   const totalCost = selectedItem.price * quantity;

  //   if (parseFloat(money) >= parseFloat(totalCost)) {
  //     setMoney(parseFloat(money) - parseFloat(totalCost));
  //     const existingItem = inventory.find((item) => item.id === selectedItem.id);

  //     if (existingItem) {

  //       existingItem.quantity += parseFloat(quantity);
  //     } else {

  //       setInventory([...inventory, { ...selectedItem, quantity: parseFloat(quantity) }]);
  //     }

  //     alert(`ซื้อ ${selectedItem.name} ${quantity} ชิ้น ราคา ${totalCost} สำเร็จ! ยอดคงเหลือ ${money - totalCost} บาท`);
  //   } else {
  //     alert('ยอดเงินไม่เพียงพอ');
  //   }

  //   setSelectedItem(null);
  //   setQuantity(1);
  // };

  // function addMoney(amount) {
  //   setMoney(money + amount);
  //   alert(`เติมเงิน ${amount} บาท สำเร็จ!`);
  // }

  // function showItem(item) {
  //   return `${item.name} = ${item.quantity} ชิ้น`;
  // }


  if (localStorage.getItem("access_token")) {
    return (
      <>
        <div className="">
          <header>
            <div className="inheader">
              <Link className="homepagefont" to={`/home/`}>หน้าแรก</Link>
              <Link className="homepagefont" target="" to={`/productpage/`}>สินค้า</Link>
              <Link className="homepagefont" target="" to={`/addmoney/`}>เติมเงิน</Link>
              <Link className="fontheader" to={`#`}>ติดต่อ</Link>
              <p className="homepagefont">ยอดเงิน: ${money}</p>
            </div>
          </header>
          <div className="img" >
            {/* <select value={productTypeId} onChange={(e) => setProductTypeId(e.target.value)}>
                  <option value={0}>ทุกประเภทสินค้า</option>
                  {
                       productTypes.map(item => (
                          <option key={item.product_type_id} value={item.product_type_id}>{item.product_type_name}</option>
                      ))
                  }
              </select> */}
            {/* <Link to={"/product/add"} className="btn btn-outline-primary me-3">เพิ่ม</Link> */}
          

              <p style={{height:'700px'}}></p>

          

            {/* <button onClick={() => addMoney(50)}>เติมเงิน 50$</button>
            <button onClick={() => addMoney(100)}>เติมเงิน 100$</button>
            <button onClick={() => addMoney(500)}>เติมเงิน 500$</button> */}
            {/* <label>
              เลือกจำนวนไอเทมที่ต้องการซื้อ:
              <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} min="1" />
            </label>
            <ul>
              {items.map((item) => (
                <ul key={item.id} className={item.type === 'items' ? 'green' : 'yellow'}>
                  {item.name} - ${item.price}
                  <button onClick={() => setSelectedItem(item)}>เลือก</button>
                  {selectedItem && selectedItem.id === item.id && (
                    <button onClick={Purchase}>ซื้อ</button>
                  )}
                </ul>
              ))}
            </ul> */}
            {/* <div className="inventory">
              <h2>Inventory</h2>
              <ul>
                {inventory.map((item, index) => (
                  <li key={index}>
                    {showItem(item)}
                  </li>
                ))}
              </ul>
            </div> */}
          </div>
          <footer ></footer>
        </div>
      </>

    );
  } else {
    console.error();
    return <Navigate to="/" replace />;
  }
}