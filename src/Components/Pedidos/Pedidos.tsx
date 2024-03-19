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

  const { createPedido, deletePedido, pedido } = usePedido();
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
    clients.forEach((pedido) => {
      deleteClient(pedido.id);
    });
  };

  const onSubmitNewPedido = (data) => {
    createPedido(data);
    setNewPedidoModalOpen(false);
    reset();
  };

  useEffect(() => {
    axios
      .get("http://localhost:5173/pedidos")
      .then((response) => {
        setPedidos(response.data);
      })
      .catch((error) => {
        console.error("Erro ao obter pedidos:", error);
      });
  }, []);

  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const [showMenu, setShowMenu] = useState(false); // Estado para controlar se o menu está visível ou não
  const { clients } = useClient(); // Obtenha a lista de clientes usando a função useClient

  const [selectedClient, setSelectedClient] = useState(null); // Estado para armazenar o cliente selecionado

  // Função para lidar com a seleção de um cliente
  const handleClientSelect = (client) => {
    setSelectedClient(client);
    // Aqui você pode adicionar a lógica para lidar com a seleção do cliente, como enviar dados para outros componentes ou realizar outras ações.
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

        <form onSubmit={handleSubmit(onSubmitNewPedido)}>
          <div className="dropdown-content">
            <label>Cliente</label>
            {clients.map((client) => (
              <a
                href="#"
                key={client.id}
                onClick={() => handleClientSelect(client)}
              >
                {client.nome}
              </a>
            ))}
          </div>
          <div>
            <label>Preço</label>
            <input type="number" {...register("preco")} />
            {errors.preco && <span>{errors.preco.message}</span>}
          </div>
          <div>
            <label>Descrição</label>
            <input type="text" {...register("descricao")} />
            {errors.descricao && <span>{errors.descricao.message}</span>}
          </div>
          <div className="dropdown">
            <button className="dropbtn">
              {selectedClient ? selectedClient.nome : "Escolha um cliente"}{" "}
              {/* Mostra o nome do cliente selecionado, ou "Escolha um cliente" se nenhum cliente estiver selecionado */}
            </button>
          </div>
          <button type="submit">Salvar</button>
        </form>
      </Modal>
    </>
  );
}
