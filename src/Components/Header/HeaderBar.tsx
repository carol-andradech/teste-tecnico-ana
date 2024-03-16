import React from "react";
import { Link } from "react-router-dom";
import clientesSvg from "../../assets/clientes.svg";
import pedidosSvg from "../../assets/pedidos.svg";
import produtosSvg from "../../assets/produtos.svg";
import "./HeaderBar.css";

export default function HeaderBar() {
  return (
    <div className="header-center">
      {/* Link para a página de Clientes */}
      <Link to="/clientes">
        <img src={clientesSvg} alt="" className="svg-img" /> Clientes
      </Link>

      {/* Link para a página de Pedidos */}
      <Link to="/pedidos">
        <img src={pedidosSvg} alt="" className="svg-img" /> Pedidos
      </Link>

      {/* Link para a página de Produtos */}
      <Link to="/produtos">
        <img src={produtosSvg} alt="" className="svg-img" /> Produtos
      </Link>
    </div>
  );
}
