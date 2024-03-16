import * as yup from "yup"; // Biblioteca externa
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState, useEffect } from "react"; // Biblioteca externa
import { useForm } from "react-hook-form"; // Biblioteca externa
import Modal from "react-modal"; // Biblioteca externa
import searchImg from "../src/assets/search-img.svg"; // Arquivo local do projeto
import HeaderBar from "./Components/Header/HeaderBar"; // Arquivo local do projeto
import "./App.css"; // Estilos (arquivo local do projeto)

Modal.setAppElement("#root");

const schema = yup.object().shape({
  nome: yup.string().required("Nome é obrigatório"),
  cnpj: yup.string().required("CNPJ é obrigatório"),
  telefone: yup.string().required("Telefone é obrigatório"),
  cep: yup.string().required("CEP é obrigatório"),
  estado: yup.string().required("Estado é obrigatório"),
  cidade: yup.string().required("Cidade é obrigatória"),
  bairro: yup.string().required("Bairro é obrigatório"),
  endereco: yup.string().required("Endereço é obrigatório"),
  numero: yup.string().required("Número é obrigatório"),
});

export default function App() {
  const [newClientModalOpen, setNewClientModalOpen] = useState(false); // Estado para controlar se o modal de adicionar novo cliente está aberto
  const [clientDetailsModalOpen, setClientDetailsModalOpen] = useState(false); // Estado para controlar se o modal de detalhes do cliente está aberto
  const [formData, setFormData] = useState(null); // Estado para armazenar os dados do formulário
  const [selectedClient, setSelectedClient] = useState(null);
  const [clients, setClients] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Função para salvar os dados no localStorage
  const saveFormData = (data) => {
    localStorage.setItem("formData", JSON.stringify(data));
  };

  // Função para remover os dados do localStorage
  const removeFormData = () => {
    localStorage.removeItem("formData");
  };

  const onSubmit = (data) => {
    const newClient = {
      id: clients.length + 1, // Gerar um novo ID único para o cliente
      ...data, // Utilizar os dados do formulário
      foto: "https://via.placeholder.com/150", // Adicionar uma URL padrão para a foto (você pode alterar conforme necessário)
    };

    const updatedClients = [...clients, newClient]; // Criar uma nova lista de clientes com o novo cliente adicionado

    console.log(updatedClients); // Mostrar a lista de clientes atualizada no console (opcional)

    setNewClientModalOpen(false); // Fechar o modal após o envio do formulário
    reset(); // Redefinir o formulário após o envio
    saveFormData(data); // Salvar os dados no localStorage

    setClients(updatedClients); // Atualizar o estado dos clientes com a nova lista de clientes
  };

  // useEffect para verificar e carregar dados do localStorage ao carregar a página
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("formData"));
    if (savedData) {
      setFormData(savedData);
    }
  }, []);

  const handleClientClick = (client) => {
    setSelectedClient(client);
    setClientDetailsModalOpen(true);
  };

  return (
    <>
      <header>
        <div className="header-center">
          <a href="https://exemplo.com">
            <img src="src\assets\clientes.svg" alt="" className="svg-img" />{" "}
            Clientes
          </a>

          <a href="https://exemplo.com">
            <img src="src\assets\pedidos.svg" alt="" className="svg-img" />
            Pedidos
          </a>

          <a href="https://exemplo.com">
            <img src="src\assets\produtos.svg" alt="" className="svg-img" />
            Produtos
          </a>
        </div>
      </header>

      <div className="search">
        <div className="search-bar">
          <form action="">
            <input
              type="text"
              placeholder="    Pesquisar"
              className="search-input"
            />
            <button></button>
            <img src={searchImg} className="search-icon" alt="search" />
          </form>
        </div>
        <button
          className="btn-search"
          onClick={() => setNewClientModalOpen(true)}
        >
          + Novo Cliente
        </button>

        <Modal
          isOpen={newClientModalOpen}
          onRequestClose={() => setNewClientModalOpen(false)}
          overlayClassName="modal-overlay"
          className="modal-content"
        >
          <h2>Cadastrar Cliente</h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-modal">
              <div className="items-modal">
                <label>Nome</label>
                <input
                  type="text"
                  {...register("nome", { required: "Nome é obrigatório" })}
                />
                {errors.nome && <span>{errors.nome.message}</span>}
              </div>

              <div className="items-modal">
                <label>CNPJ</label>
                <input
                  type="text"
                  {...register("cnpj", { required: "CNPJ é obrigatório" })}
                />
                {errors.cnpj && <span>{errors.cnpj.message}</span>}
              </div>

              <div className="items-modal">
                <label>Telefone</label>
                <input
                  type="text"
                  {...register("telefone", {
                    required: "Telefone é obrigatório",
                  })}
                />
                {errors.telefone && <span>{errors.telefone.message}</span>}
              </div>

              <div className="items-modal">
                <label>CEP</label>
                <input
                  type="text"
                  {...register("cep", { required: "CEP é obrigatório" })}
                />
                {errors.cep && <span>{errors.cep.message}</span>}
              </div>

              <div className="items-modal">
                <label>Estado</label>
                <input
                  type="text"
                  {...register("estado", { required: "Estado é obrigatório" })}
                />
                {errors.estado && <span>{errors.estado.message}</span>}
              </div>

              <div className="items-modal">
                <label>Cidade</label>
                <input
                  type="text"
                  {...register("cidade", { required: "Cidade é obrigatória" })}
                />
                {errors.cidade && <span>{errors.cidade.message}</span>}
              </div>
              <div className="items-modal">
                <label>Bairro</label>
                <input
                  type="text"
                  {...register("bairro", { required: "Bairro é obrigatório" })}
                />
                {errors.bairro && <span>{errors.bairro.message}</span>}
              </div>
              <div className="items-modal">
                <label>Endereço</label>
                <input
                  type="text"
                  {...register("endereco", {
                    required: "Endereço é obrigatório",
                  })}
                />
                {errors.endereco && <span>{errors.endereco.message}</span>}
              </div>
              <div className="items-modal">
                <label>Número</label>
                <input
                  type="text"
                  {...register("numero", { required: "Número é obrigatório" })}
                />
                {errors.numero && <span>{errors.numero.message}</span>}
              </div>
            </div>
            <button className="btn-modal" type="submit">
              Salvar
            </button>
          </form>
        </Modal>
      </div>
      <div className="clients-list">
        <div className="client-item">
          <img src="src\assets\flor.jpeg" alt="" />
          <div className="client-details">
            <h3>Energia verde</h3>
            <p>00.000.000</p>
          </div>
        </div>
        <div className="client-item">
          <img src="src\assets\flor.jpeg" alt="" />
          <div className="client-details">
            <h3>Energia verde</h3>
            <p>00.000.000</p>
          </div>
        </div>
        <div className="client-item">
          <img src="src\assets\flor.jpeg" alt="" />
          <div className="client-details">
            <h3>Energia verde</h3>
            <p>00.000.000</p>
          </div>
        </div>
        <div className="client-item">
          <img src="src\assets\flor.jpeg" alt="" />
          <div className="client-details">
            <h3>Energia verde</h3>
            <p>00.000.000</p>
          </div>
        </div>
      </div>
      <Modal
        isOpen={clientDetailsModalOpen}
        onRequestClose={() => clientDetailsModalOpen(false)}
        overlayClassName="modal-overlay"
        className="modal-content"
      >
        {selectedClient && (
          <>
            <h2>{selectedClient.nome}</h2>
            <hr></hr>
            <div className="client-info">
              <div>
                <p>Nome</p>
                <span>{selectedClient.nome}</span>
              </div>
              <div>
                <p>CNPJ</p>
                <span>{selectedClient.cnpj}</span>
              </div>

              <div>
                <p>Telefone </p>
                <span>{selectedClient.telefone}</span>
              </div>
              <div>
                <p>CEP </p>
                <span>{selectedClient.cep}</span>
              </div>
              <div>
                <p>Estado </p>
                <span>{selectedClient.estado}</span>
              </div>
              <div>
                <p>Cidade </p>
                <span>{selectedClient.cidade}</span>
              </div>
              <div>
                <p>Bairro</p>
                <span>{selectedClient.bairro}</span>
              </div>
              <div>
                <p>Endereço</p>
                <span>{selectedClient.endereco}</span>
              </div>
              <div>
                <p>Número</p>
                <span>{selectedClient.numero}</span>
              </div>
            </div>
          </>
        )}
      </Modal>
      <div className="clients-list">
        {/* Lista de clientes */}
        {clients.map((client) => (
          <div
            className="client-item"
            key={client.id}
            onClick={() => handleClientClick(client)}
          >
            <img src={client.foto} alt={client.nome} />
            <div className="client-details">
              <h3>{client.nome}</h3>
              <p>{client.cnpj}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
