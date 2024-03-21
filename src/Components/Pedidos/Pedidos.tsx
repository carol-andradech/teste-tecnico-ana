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
  nome_cliente: yup.string().required("Nome do cliente é obrigatório"),
  produtos: yup.array().of(
    yup.object().shape({
      nome: yup.string().required("Nome do produto é obrigatório"),
      quantidade: yup
        .number()
        .min(0, "Quantidade mínima é 0") // Agora permitimos 0 para produtos removidos
        .required("Quantidade é obrigatória"),
      preco: yup.number().required("Preço do produto é obrigatório"),
      total: yup.number().required("Total do produto é obrigatório"),
    })
  ),
});

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [newPedidoModalOpen, setNewPedidoModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [totalProdutos, setTotalProdutos] = useState(0);
  const [totalPreco, setTotalPreco] = useState(0);
  const { clients } = useClient();
  const { produto } = useProduto();
  const [tempProdutos, setTempProdutos] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleDeleteAllPedidos = () => {
    setPedidos([]);
    setTotalProdutos(0);
    setTotalPreco(0);
  };

  const onSubmitNewPedido = (formData) => {
    if (selectedClient && tempProdutos.length > 0) {
      const novoPedido = {
        cliente: selectedClient.nome,
        produtos: tempProdutos,
      };

      setPedidos([...pedidos, novoPedido]); // Adiciona o novo pedido ao array existente
      setNewPedidoModalOpen(false);
      reset();
      setSelectedClient(null);
      setSearchTerm("");
      setTempProdutos([]); // Limpa os produtos temporários
    }
  };

  const handleAddToPedido = (produto) => {
    if (selectedClient && produto) {
      const preco = parseFloat(produto.preco.replace(",", "."));
      const existingProduto = tempProdutos.find(
        (tempProduto) => tempProduto.nome === produto.nome
      );

      if (existingProduto) {
        const updatedTempProdutos = tempProdutos.map((tempProduto) => {
          if (tempProduto.nome === produto.nome) {
            return {
              ...tempProduto,
              quantidade: tempProduto.quantidade + 1,
              total: tempProduto.total + preco,
            };
          }
          return tempProduto;
        });
        setTempProdutos(updatedTempProdutos);
      } else {
        const novoTempProduto = {
          nome: produto.nome,
          quantidade: 1,
          preco: preco,
          total: preco,
        };
        setTempProdutos([...tempProdutos, novoTempProduto]);
      }
      setTotalProdutos(totalProdutos + 1);
      setTotalPreco(totalPreco + preco);
    }
  };

  const handleRemoveFromPedido = (produto) => {
    if (produto) {
      const preco = parseFloat(produto.preco.replace(",", "."));
      const existingProdutoIndex = tempProdutos.findIndex(
        (tempProduto) => tempProduto.nome === produto.nome
      );

      if (existingProdutoIndex !== -1) {
        const existingProduto = tempProdutos[existingProdutoIndex];

        if (existingProduto.quantidade > 1) {
          const updatedTempProdutos = [...tempProdutos];
          updatedTempProdutos[existingProdutoIndex] = {
            ...existingProduto,
            quantidade: existingProduto.quantidade - 1,
            total: existingProduto.total - preco,
          };

          setTempProdutos(updatedTempProdutos);
          setTotalProdutos(totalProdutos - 1);
          setTotalPreco(totalPreco - preco);
        } else {
          // Se a quantidade for 1, remove o produto do array
          const updatedTempProdutos = tempProdutos.filter(
            (tempProduto) => tempProduto.nome !== produto.nome
          );

          setTempProdutos(updatedTempProdutos);
          setTotalProdutos(totalProdutos - 1);
          setTotalPreco(totalPreco - preco);
        }
      }
    }
  };

  const handleClientSelect = (client) => {
    setSelectedClient(client);
    setPedidos([]);
    setTotalProdutos(0);
    setTotalPreco(0);
  };

  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
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
            {produto.map((produto) => {
              const pedido = pedidos.find(
                (pedido) => pedido.nome === produto.nome
              );
              const quantidade = pedido ? pedido.quantidade : 0;
              return (
                <div className="produto-item-pedido" key={produto.id}>
                  <img src={produto.imagem} alt={produto.nome} />
                  <div className="produto-details-pedido">
                    <h3>{produto.nome}</h3>
                    <p>Preço: R${produto.preco}</p>
                    <div className="produto-actions-pedido">
                      <button
                        type="button"
                        onClick={() => handleAddToPedido(produto)}
                      >
                        +
                      </button>
                      <span>
                        {produto &&
                        tempProdutos.find(
                          (tempProduto) => tempProduto.nome === produto.nome
                        )
                          ? tempProdutos.find(
                              (tempProduto) => tempProduto.nome === produto.nome
                            ).quantidade
                          : 0}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFromPedido(produto)}
                      >
                        -
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div>
            <p>
              Nome do Cliente:{" "}
              {selectedClient
                ? selectedClient.nome
                : "Nenhum cliente selecionado"}
            </p>
            <p>
              Quantidade de Produtos:{" "}
              {tempProdutos.reduce(
                (acc, tempProduto) => acc + tempProduto.quantidade,
                0
              )}
            </p>

            <p>Valor Total do Pedido: R${totalPreco}</p>
          </div>
          <button type="submit">Salvar</button>
        </form>
      </Modal>

      <div className="pedidos-list">
        {pedidos.length > 0 ? (
          pedidos.map((pedido, index) => (
            <div className="pedido-item" key={index}>
              <img src="src\assets\empty.jpg" alt={pedido.nome} />
              <div className="pedido-left">
                <h3>{pedido.cliente}</h3>{" "}
                <span> Qtd. produtos: {pedido.quantidade}</span>{" "}
              </div>
              <div className="pedido-right">
                {/* Adicionando logs para depurar */}
                {console.log("pedido.total:", pedido.total)}
                <p> R${pedido.total}</p>
              </div>
            </div>
          ))
        ) : (
          <p>Nenhum pedido cadastrado ainda.</p>
        )}
      </div>
    </>
  );
}
