import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Dashboard from "../Pages/Dashboard";
import Layout from "../Pages/Layout";
import Inventory from "../Pages/Inventory";
import AddInventory from "../Pages/Add Inventory";

let RoutesPage = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add-inventory" element={<AddInventory />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="*" element={<>no route</>} />
      </Routes>
      <ToastContainer />
    </Layout>
  );
};

export default RoutesPage;
