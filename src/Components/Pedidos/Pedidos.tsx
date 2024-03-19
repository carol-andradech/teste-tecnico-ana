// Pedidos.js
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "react-modal";
import axios from "axios";
import { usePedido } from "../Pedidos/useLocalStoragePedido";
import searchImg from "../../assets/search-img.svg";
import "../Pedidos/Pedidos.css";
import { useClient } from "../useLocalStorage";
import { useProduto } from "../Produtos/useLocalStorageProduto";
Modal.setAppElement("#root");

const schema = yup.object().shape({
  nome: yup.string().required("Nome é obrigatório"),
  preco: yup.number().required("Preço é obrigatório"),
  descricao: yup.string().required("Descrição é obrigatória"),
});
export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [newPedidoModalOpen, setNewPedidoModalOpen] = useState(false);
  const [pedidoDetailsModalOpen, setPedidoDetailsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [quantidade, setQuantidade] = useState(0); // Estado para a quantidade de produtos no pedido
  const { createPedido, deletePedido, pedido } = usePedido();
  const { produto } = useProduto();
  const { clients } = useClient();
  const [selectedClient, setSelectedClient] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handlePedidoClick = (pedido) => {
    setSelectedPedido(pedido);
    setPedidoDetailsModalOpen(true);
  };

  const handleDeleteAllPedidos = () => {
    pedidos.forEach((pedido) => {
      deletePedido(pedido.id);
    });
  };

  const onSubmitNewPedido = (data) => {
    createPedido(data);
    setNewPedidoModalOpen(false);
    reset();
  };

  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClientSelect = (client) => {
    setSelectedClient(client);
  };

  const handleAddToPedido = (productId) => {
    console.log("Produto adicionado ao pedido:", productId);
    setQuantidade(quantidade + 1);
  };

  const handleRemoveFromPedido = (productId) => {
    console.log("Produto removido do pedido:", productId);
    if (quantidade > 0) {
      setQuantidade(quantidade - 1);
    }
  };

  const handleFormSubmit = (data) => {
    // Lógica para lidar com o envio do formulário
    onSubmitNewPedido(data);
  };

  const handleAddClick = () => {
    setQuantidade(quantidade + 1);
  };

  const handleRemoveClick = () => {
    if (quantidade > 0) {
      setQuantidade(quantidade - 1);
    }
  };
  return (
    <>
      <button onClick={handleDeleteAllPedidos}>Deletar Todos os Pedidos</button>
      <div className="search">
        <div className="search-bar">
          <div className="div-input">
            <input
              type="text"
              placeholder="Pesquisar"
              className="search-input"
              onChange={handleSearchInputChange}
            />
            <button className="image-button"></button>
          </div>
        </div>
        <button
          className="btn-search"
          onClick={() => setNewPedidoModalOpen(true)}
        >
          + Novo Pedido
        </button>
      </div>
      <Modal
        isOpen={newPedidoModalOpen}
        onRequestClose={() => setNewPedidoModalOpen(false)}
        overlayClassName="modal-overlay"
        className="modal-content"
      >
        <h2>Cadastro do Pedido</h2>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="dropdown">
            <select
              name="cliente"
              className="dropdown-menu"
              onChange={(e) => handleClientSelect(clients[e.target.value])}
            >
              <option value="">Escolha um cliente</option>
              {clients.map((client, index) => (
                <option key={index} value={index}>
                  {client.nome}
                </option>
              ))}
            </select>
          </div>
          <div className="search-produtos">
            <input
              type="text"
              placeholder="Pesquisar produtos"
              className="input-cadastro"
              value={searchTerm}
              onChange={handleSearchInputChange}
            />
          </div>

          <div className="produto-list-pedido">
            {produto.map((produto) => (
              <div className="produto-item-pedido" key={produto.id}>
                <img src={produto.imagem} alt={produto.nome} />
                <div className="produto-details-pedido">
                  <h3>{produto.nome}</h3>
                  <p>Preço: R${produto.preco}</p>
                  <div className="produto-actions-pedido">
                    <button onClick={handleAddClick}>+ Adicionar</button>
                    <span>{quantidade}</span>
                    <button onClick={handleRemoveClick}>- Remover</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button type="submit">Salvar</button>
        </form>
      </Modal>
    </>
  );
}
