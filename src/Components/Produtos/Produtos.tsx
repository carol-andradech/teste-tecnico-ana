import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import searchImg from "../../assets/search-img.svg"; // Importe a imagem de pesquisa

// Defina o esquema de validação para os campos do formulário
const schema = yup.object().shape({
  nome: yup.string().required("Nome é obrigatório"),
  preco: yup.number().required("Preço é obrigatório"),
  descricao: yup.string().required("Descrição é obrigatória"),
  imagem: yup.string().required("Imagem é obrigatória"),
});

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [newProductModalOpen, setNewProductModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para armazenar o termo de pesquisa

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

  const onSubmit = (data) => {
    setProdutos([...produtos, data]);
    setNewProductModalOpen(false);
    reset();
  };

  // Função para filtrar os produtos com base no termo de pesquisa
  const filteredProdutos = produtos.filter((produto) =>
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>Produtos</h1>
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

      <div>
        {filteredProdutos.map((produto, index) => (
          <div key={index}>
            <h3>{produto.nome}</h3>
            <p>Preço: {produto.preco}</p>
            <p>Descrição: {produto.descricao}</p>
            <p>Imagem: {produto.imagem}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
