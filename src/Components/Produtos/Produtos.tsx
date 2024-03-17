import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import searchImg from "../../assets/search-img.svg"; // Importe a imagem de pesquisa
import { useProduto } from "../Produtos/useLocalStorageProduto";
import "./Produtos.css";
Modal.setAppElement("#root");
// Defina o esquema de validação para os campos do formulário
const schema = yup.object().shape({
  nome: yup.string().required("Nome é obrigatório"),
  preco: yup.number().required("Preço é obrigatório"),
  descricao: yup.string().required("Descrição é obrigatória"),
  imagem: yup.string().required("Imagem é obrigatória"),
});

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [selectedProduto, setSelectedProduto] = useState(null);
  const [newProductModalOpen, setNewProductModalOpen] = useState(false);
  const [produtoDetailsModalOpen, setProdutoDetailsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para armazenar o termo de pesquisa

  const { createProduto, deleteProduto, produto } = useProduto();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    axios
      .get("http://localhost:5173/produtos")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setProdutos(response.data);
        } else {
          console.error("Dados retornados não são um array:", response.data);
        }
      })
      .catch((error) => {
        console.error("Erro ao obter produtos:", error);
      });
  }, []);

  const handleProdutoClick = (produto) => {
    setSelectedProduto(produto);
    setProdutoDetailsModalOpen(true);
  };

  const onSubmit = (data) => {
    createProduto(data);
    setNewProductModalOpen(false);
    reset();
  };

  const filteredProdutos = produtos.filter((produto) =>
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="search">
        <div className="search-bar">
          <form>
            <input
              type="text"
              placeholder="Pesquisar..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit"></button>
            <img src={searchImg} className="search-icon" alt="search" />
          </form>
        </div>
        <button
          className="btn-search"
          onClick={() => setNewProductModalOpen(true)}
        >
          + Novo Produto
        </button>
      </div>
      <Modal
        isOpen={newProductModalOpen}
        onRequestClose={() => setNewProductModalOpen(false)}
        overlayClassName="modal-overlay"
        className="modal-content"
      >
        <h2>Adicionar Produto</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label>Nome</label>
            <input type="text" {...register("nome")} />
            {errors.nome && <span>{errors.nome.message}</span>}
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

          <div>
            <label>Imagem</label>
            <input type="text" {...register("imagem")} />
            {errors.imagem && <span>{errors.imagem.message}</span>}
          </div>

          <button type="submit">Salvar</button>
        </form>
      </Modal>
      <Modal
        isOpen={produtoDetailsModalOpen}
        onRequestClose={() => setProdutoDetailsModalOpen(false)}
        overlayClassName="modal-overlay"
        className="modal-content"
      >
        {selectedProduto && (
          <>
            <h2>Detalhes do Produto</h2>
            <hr></hr>
            <div className="modal-details">
              <img src="src\assets\empty.jpg" alt="" />
              <div className="modal-detail-item">
                <h2>{selectedProduto.nome}</h2>
                <p>Preço: R$ {selectedProduto.preco}</p>
                <p className="p-detail">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                  et pulvinar nibh. Proin dictum lectus sed ligula rhoncus, vel
                  tincidunt nisl tempus. In pulvinar auctor erat, a rhoncus mi
                  viverra eu. Nullam et sagittis dui, eu euismod est. Vestibulum
                  sem quam, viverra eget lacus sed, maximus ullamcorper nisi.
                  Vestibulum ante ipsum primis in faucibus orci luctus et
                  ultrices posuere cubilia curae; Donec justo elit, hendrerit
                  sit amet quam id, feugiat placerat diam. Pellentesque quis
                  suscipit massa. Sed libero metus, feugiat a dolor sed, iaculis
                  pellentesque felis. Proin dignissim vulputate elit eget
                  sodales. Nulla facilisi. Proin urna libero, dictum maximus
                  ligula a, vulputate consequat arcu.
                </p>
              </div>
            </div>
          </>
        )}
      </Modal>

      <div className="produto-list">
        {produto.map((produto, index) => (
          <div
            key={index}
            className="produto-item"
            onClick={() => handleProdutoClick(produto)}
          >
            <img src="src\assets\empty.jpg" alt="" />
            <div className="produto-detail">
              <p>{produto.nome}</p>
              <p className="preco">R$ {produto.preco}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
