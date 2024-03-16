import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

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
    // Aqui você pode enviar os dados do novo produto para a API
    // e atualizar a lista de produtos
    // Exemplo de como enviar os dados para a API:
    // axios.post("http://localhost:5173/produtos", data)
    //   .then((response) => {
    //     // Atualizar a lista de produtos após a criação bem-sucedida
    //     setProdutos([...produtos, response.data]);
    //   })
    //   .catch((error) => {
    //     console.error("Erro ao criar produto:", error);
    //   });

    // Aqui, por simplicidade, apenas adicionamos o novo produto à lista
    setProdutos([...produtos, data]);

    // Fechar o modal e limpar o formulário
    setNewProductModalOpen(false);
    reset();
  };

  return (
    <div>
      <h1>Produtos</h1>
      <button onClick={() => setNewProductModalOpen(true)}>
        Adicionar Produto
      </button>

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
        {produtos.map((produto, index) => (
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
