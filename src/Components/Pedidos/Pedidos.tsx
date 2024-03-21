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
  const [currentPedido, setCurrentPedido] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const savedPedidos = localStorage.getItem("pedidos");
    if (savedPedidos) {
      setPedidos(JSON.parse(savedPedidos));
    }
  }, []);

  const handleDeleteAllPedidos = () => {
    setPedidos([]);
    setTotalProdutos(0);
    setTotalPreco(0);
  };

  const handleSavePedido = (event) => {
    event.preventDefault(); // Previne a submissão padrão do formulário

    console.log("selectedClient:", selectedClient);
    console.log("currentPedido:", currentPedido);

    if (selectedClient && currentPedido.length > 0) {
      const novoPedido = {
        cliente: selectedClient.nome,
        quantidade: currentPedido.reduce(
          (acc, tempProduto) => acc + tempProduto.quantidade,
          0
        ),
        total: currentPedido.reduce(
          (acc, tempProduto) => acc + tempProduto.total,
          0
        ),
        produtos: currentPedido,
      };

      setPedidos((prevPedidos) => [...prevPedidos, novoPedido]);
      setNewPedidoModalOpen(false);
      reset();
      setSelectedClient(null);
      setSearchTerm("");
      setCurrentPedido([]);
      setTotalProdutos(0);
      setTotalPreco(0);

      localStorage.setItem("pedidos", JSON.stringify([...pedidos, novoPedido]));
    } else {
      console.log(
        "Erro: cliente não selecionado ou nenhum produto adicionado ao pedido."
      );
    }
  };

  const handleAddToPedido = (produto) => {
    if (selectedClient && produto) {
      const preco = parseFloat(produto.preco.replace(",", "."));
      const existingProduto = currentPedido.find(
        (tempProduto) => tempProduto.nome === produto.nome
      );

      if (existingProduto) {
        const updatedCurrentPedido = currentPedido.map((tempProduto) => {
          if (tempProduto.nome === produto.nome) {
            return {
              ...tempProduto,
              quantidade: tempProduto.quantidade + 1,
              total: tempProduto.total + preco,
            };
          }
          return tempProduto;
        });
        setCurrentPedido(updatedCurrentPedido);
      } else {
        const novoTempProduto = {
          nome: produto.nome,
          quantidade: 1,
          preco: preco,
          total: preco,
        };
        setCurrentPedido([...currentPedido, novoTempProduto]);
      }
      setTotalProdutos(totalProdutos + 1);
      setTotalPreco(totalPreco + preco);
    }
  };

  const handleRemoveFromPedido = (produto) => {
    if (produto) {
      const preco = parseFloat(produto.preco.replace(",", "."));
      const existingProdutoIndex = currentPedido.findIndex(
        (tempProduto) => tempProduto.nome === produto.nome
      );

      if (existingProdutoIndex !== -1) {
        const existingProduto = currentPedido[existingProdutoIndex];

        if (existingProduto.quantidade > 1) {
          const updatedCurrentPedido = [...currentPedido];
          updatedCurrentPedido[existingProdutoIndex] = {
            ...existingProduto,
            quantidade: existingProduto.quantidade - 1,
            total: existingProduto.total - preco,
          };

          setCurrentPedido(updatedCurrentPedido);
          setTotalProdutos(totalProdutos - 1);
          setTotalPreco(totalPreco - preco);
        } else {
          // Se a quantidade for 1, remove o produto do array
          const updatedCurrentPedido = currentPedido.filter(
            (tempProduto) => tempProduto.nome !== produto.nome
          );

          setCurrentPedido(updatedCurrentPedido);
          setTotalProdutos(totalProdutos - 1);
          setTotalPreco(totalPreco - preco);
        }
      }
    }
  };
  useEffect(() => {
    // Atualiza o total de produtos e preço sempre que houver mudanças em tempProdutos
    const totalQuantidade = tempProdutos.reduce(
      (acc, tempProduto) => acc + tempProduto.quantidade,
      0
    );
    const totalValor = tempProdutos.reduce(
      (acc, tempProduto) => acc + tempProduto.total,
      0
    );
    setTotalProdutos(totalQuantidade);
    setTotalPreco(totalValor);
  }, [tempProdutos]); // Adicionando tempProdutos como dependência

  const handleClientSelect = (client) => {
    setSelectedClient(client);
  };

  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
  };
  return (
    <>
      {/* 
<button onClick={handleDeleteAllPedidos}>Deletar Todos os Pedidos</button>
*/}
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
        <hr className="custom-hr" />
        <form>
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

                    <div className="produto-actions-pedido">
                      <button
                        className="btn-valor"
                        type="button"
                        onClick={() => handleRemoveFromPedido(produto)}
                      >
                        -
                      </button>
                      <span>
                        {currentPedido &&
                        currentPedido.find(
                          (tempProduto) => tempProduto.nome === produto.nome
                        )
                          ? (console.log(
                              "Produto encontrado:",
                              currentPedido.find(
                                (tempProduto) =>
                                  tempProduto.nome === produto.nome
                              )
                            ),
                            currentPedido.find(
                              (tempProduto) => tempProduto.nome === produto.nome
                            ).quantidade)
                          : 0}
                      </span>
                      <button
                        className="btn-valor"
                        type="button"
                        onClick={() => handleAddToPedido(produto)}
                      >
                        +
                      </button>
                      <span className="cadastro-valor">R$ {produto.preco}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <hr className="custom-hr" />
          <div className="info-form">
            <p className="form-total">
              Total: <span>R${totalPreco.toFixed(2)}</span>
            </p>
            <p className="form-total">
              Quantidade de Produtos:{" "}
              <span>
                {currentPedido.reduce(
                  (acc, tempProduto) => acc + tempProduto.quantidade,
                  0
                )}
              </span>
            </p>
            <button
              className="btn-salvar-pedido"
              onClick={(event) => handleSavePedido(event)}
            >
              Salvar Pedido
            </button>
          </div>
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
                <p> R${pedido.total.toFixed(2)}</p>
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
