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
  preco: yup.string().required("Preço é obrigatório"),
  descricao: yup.string().required("Descrição é obrigatória"),
  imagem: yup.string().notRequired(), // Torna a imagem opcional
});

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [selectedProduto, setSelectedProduto] = useState(null);
  const [newProductModalOpen, setNewProductModalOpen] = useState(false);
  const [produtoDetailsModalOpen, setProdutoDetailsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para armazenar o termo de pesquisa
  const [selectedImage, setSelectedImage] = useState(null);

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
    if (selectedImage) {
      data.imagem = selectedImage;
    } else {
      delete data.imagem; // Remove o campo imagem se não houver imagem selecionada
    }
    createProduto(data);
    setNewProductModalOpen(false);
    reset();
    setSelectedImage(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setSelectedImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const filteredProdutos = produtos.filter((produto) =>
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="search">
        <div className="search-bar">
          <div className="div-input">
            <input
              type="text"
              placeholder="Pesquisar..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="image-button"></button>
          </div>
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
        <h2>Cadastrar Produto</h2>
        <hr className="custom-hr" />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-info">
            <div className="form-title">
              <div className="form-nome form-organizar">
                <label>Nome</label>
                <input type="text" {...register("nome")} />
                {errors.nome && <span>{errors.nome.message}</span>}
              </div>

              <div className="form-preco form-organizar">
                <label>Preço</label>
                <input type="text" {...register("preco")} />
                {errors.preco && <span>{errors.preco.message}</span>}
              </div>
            </div>
            <div className="form-desc form-organizar">
              <label>Descrição</label>
              <input type="text" {...register("descricao")} />
              {errors.descricao && <span>{errors.descricao.message}</span>}
            </div>

            <div className="form-img form-organizar">
              <label htmlFor="upload-button">Foto do Produto</label>
              <div className="form-img-center">
                <input
                  type="file"
                  id="upload-button"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }} // ocultando o input file
                />
                <button
                  onClick={() =>
                    document.getElementById("upload-button").click()
                  } // simulando o clique no input file ao clicar no botão
                  className="upload-button"
                >
                  Faça o upload da foto
                </button>
                <span>JPG e PNG, somente</span>

                {selectedImage && (
                  <img
                    src={selectedImage}
                    alt="Preview"
                    className="preview-image"
                    style={{ maxWidth: "200px", maxHeight: "200px" }} // Definindo um tamanho máximo
                  />
                )}

                {errors.imagem && <span>{errors.imagem.message}</span>}
              </div>
            </div>
          </div>
          <hr className="custom-hr" />
          <div className="btn-salvar">
            <button className="btn-modal" type="submit">
              Salvar
            </button>
          </div>
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
            <hr className="custom-hr" />
            <div className="modal-details">
              <img src={selectedProduto.imagem} alt="" />
              <div className="modal-detail-item">
                <h2>{selectedProduto.nome}</h2>
                <p>R$ {selectedProduto.preco}</p>
                <p className="p-detail">{selectedProduto.descricao}</p>
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
            <img src={produto.imagem} alt="" className="produto-img" />
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
