import React from "react";
import { Link, useLocation } from "react-router-dom";
import clientesSvg from "../../assets/clientes.svg";
import pedidosSvg from "../../assets/pedidos.svg";
import produtosSvg from "../../assets/produtos.svg";
import "./HeaderBar.css";

export default function HeaderBar() {
  const location = useLocation();

  return (
    <div className="header-center">
      {/* Link para a página de Clientes */}
      <Link
        to="/clientes"
        className={location.pathname === "/clientes" ? "active-link" : ""}
      >
        <img src={clientesSvg} alt="" className="svg-img" />
        <span className="span-header">Clientes</span>
      </Link>

      {/* Link para a página de Pedidos */}
      <Link
        to="/pedidos"
        className={location.pathname === "/pedidos" ? "active-link" : ""}
      >
        <img src={pedidosSvg} alt="" className="svg-img" />
        <span className="span-header">Pedidos</span>
      </Link>

      {/* Link para a página de Produtos */}
      <Link
        to="/produtos"
        className={location.pathname === "/produtos" ? "active-link" : ""}
      >
        <img src={produtosSvg} alt="" className="svg-img" />
        <span className="span-header">Produtos</span>
      </Link>
    </div>
  );
}
