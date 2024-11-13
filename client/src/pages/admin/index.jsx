import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SideBar from "./components/sidebar";
import AddProduct from "./components/add-product";
import AllProducts from "./components/all-products";

const Admin = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <div className=" flex flex-col md:flex-row">
      <div className="md:w-56 border-r-2">
        <SideBar />
      </div>
      <div className="md:w-full max-w-2xl md:mx-auto px-10">
        {tab === "products" && <AllProducts />}
        {tab === "users" && <h1>Users</h1>}
        {tab === "orders" && <h1>Orders</h1>}
        {tab === "add-product" && <AddProduct />}
      </div>
    </div>
  );
};

export default Admin;
