import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "react-modal";
import { useClient } from "../../Components/useLocalStorage";
import axios from "axios";
import searchImg from "../../assets/search-img.svg"; // Certifique-se de importar a imagem de pesquisa corretamente

const schema = yup.object().shape({
  nome: yup.string().required("Nome é obrigatório"),
  preco: yup.number().required("Preço é obrigatório"),
  descricao: yup.string().required("Descrição é obrigatória"),
  imagem: yup.string().required("Imagem é obrigatória"),
  // Adicione outras validações conforme necessário
});

export default function Pedidos() {
  const [data, setData] = useState(null);
  const [newProductModalOpen, setNewProductModalOpen] = useState(false);
  const { createClient } = useClient(); // Corrija aqui se necessário

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    // Adicione o novo pedido aqui (usando a função correta)
    // Por exemplo, se for usar axios:
    axios
      .post("http://localhost:5173/pedidos", data)
      .then((response) => {
        console.log("Pedido criado com sucesso:", response.data);
        // Aqui você pode atualizar o estado ou fazer outras operações necessárias
        // setData(response.data);
        setNewProductModalOpen(false);
        reset();
      })
      .catch((error) => {
        console.error("Erro ao criar pedido:", error);
      });
  };

  useEffect(() => {
    axios
      .get("http://localhost:5173/pedidos")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Erro ao obter pedidos:", error);
      });
  }, []);

  return (
    <>
      <div className="search">
        <div className="search-bar">
          <form action="">
            <input
              type="text"
              placeholder="Pesquisar"
              className="search-input"
            />
            <button></button>
            <img src={searchImg} className="search-icon" alt="search" />
          </form>
        </div>
        <button
          className="btn-search"
          onClick={() => setNewProductModalOpen(true)}
        >
          + Novo Pedido
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
    </>
  );
}
