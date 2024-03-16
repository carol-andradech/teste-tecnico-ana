import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "react-modal";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Importe o BrowserRouter como Router
import ReactDOM from "react-dom";
import searchImg from "../src/assets/search-img.svg";
import HeaderBar from "./Components/Header/HeaderBar";
import Pedidos from "./Components/Pedidos/Pedidos";
import Produtos from "./Components/Produtos/Produtos";
import Clientes from "./Components/Clientes/Clientes";
import "./App.css";
import { useClient } from "./Components/useLocalStorage";

export default function App() {
  return (
    <>
      <div className="head">
        <HeaderBar />
      </div>
      <Routes>
        {" "}
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/" element={<Clientes />} />
      </Routes>
    </>
  );
}
