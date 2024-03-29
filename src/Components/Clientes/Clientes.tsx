import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "react-modal";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HeaderBar from "../../Components/Header/HeaderBar";
import Pedidos from "../../Components/Pedidos/Pedidos";
import Produtos from "../../assets/search-img.svg";
import "./Clientes.css";
import { useClient } from "../../Components/useLocalStorage";
import axios from "axios";

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

export default function Clientes() {
  const [newClientModalOpen, setNewClientModalOpen] = useState(false);
  const [clientDetailsModalOpen, setClientDetailsModalOpen] = useState(false);
  const [formData, setFormData] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredClient, setFilteredClient] = useState(null);

  const { createClient, updateClient, deleteClient, clients } = useClient();

  const handleCEPChange = async (cep) => {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      const data = response.data;
      if (!data.erro) {
        reset({
          estado: data.uf,
          cidade: data.localidade,
          bairro: data.bairro,
          endereco: data.logradouro,
        });
      } else {
        console.error("CEP inválido");
      }
    } catch (error) {
      console.error("Erro ao buscar endereço:", error);
    }
  };

  useEffect(() => {
    if (formData && formData.cep) {
      handleCEPChange(formData.cep);
    }
  }, [formData]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("formData"));
    if (savedData) {
      setFormData(savedData);
    }
  }, []);

  const handleFilterClients = () => {
    const filtered = clients.filter((client) =>
      client.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClient(filtered.length ? filtered : null);
  };

  const handleClientClick = (client) => {
    setSelectedClient(client);
    setClientDetailsModalOpen(true);
  };

  const onSubmit = (data) => {
    createClient(data);
    setNewClientModalOpen(false);
    reset();
  };

  const handleDeleteAllClients = () => {
    clients.forEach((client) => {
      deleteClient(client.id);
    });
  };

  const handleNewClientModalClose = () => {
    setNewClientModalOpen(false);
    reset({
      nome: "",
      cnpj: "",
      telefone: "",
      cep: "",
      estado: "",
      cidade: "",
      bairro: "",
      endereco: "",
      numero: "",
    });
  };

  const renderClientList = () => {
    if (searchTerm.trim() !== "") {
      return (
        <>
          {filteredClient &&
            filteredClient.map((client) => (
              <div
                className={`client-item ${client ? "highlighted" : ""}`}
                key={client.id}
                onClick={() => handleClientClick(client)}
              >
                <img src="src\assets\empty.jpg" alt={client.nome} />
                <div className="client-details">
                  <h3>{client.nome}</h3>
                  <p>{client.cnpj}</p>
                </div>
              </div>
            ))}
        </>
      );
    } else {
      return clients.map((client) => (
        <div
          className="client-item"
          key={client.id}
          onClick={() => handleClientClick(client)}
        >
          <img src="src\assets\empty.jpg" alt={client.nome} />
          <div className="client-details">
            <h3>{client.nome}</h3>
            <p>{client.cnpj}</p>
          </div>
        </div>
      ));
    }
  };

  return (
    <div>
      {/* <button onClick={handleDeleteAllClients}>
        Deletar Todos os Clientes
  </button> */}
      <div className="search">
        <div className="search-bar">
          <div className="div-input">
            <input
              type="text"
              placeholder="Pesquisar..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleFilterClients();
              }}
            />
            <button className="image-button"></button>
          </div>
        </div>
        <button
          className="btn-search"
          onClick={() => setNewClientModalOpen(true)}
        >
          + Novo Cliente
        </button>

        <Modal
          isOpen={newClientModalOpen}
          onRequestClose={handleNewClientModalClose}
          overlayClassName="modal-overlay"
          className="modal-content"
        >
          <h2>Cadastrar Cliente</h2>
          <hr className="custom-hr" />
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
                  onChange={(e) => handleCEPChange(e.target.value)}
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
            <hr className="custom-hr" />
            <div className="btn-salvar">
              <button className="btn-modal" type="submit">
                Salvar
              </button>
            </div>
          </form>
        </Modal>
      </div>

      <Modal
        isOpen={clientDetailsModalOpen}
        onRequestClose={() => setClientDetailsModalOpen(false)}
        overlayClassName="modal-overlay"
        className="modal-content"
      >
        {selectedClient && (
          <>
            <h2>{selectedClient.nome}</h2>

            <hr className="custom-hr" />
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
                <p>Telefone</p>
                <span>{selectedClient.telefone}</span>
              </div>
              <div>
                <p>CEP</p>
                <span>{selectedClient.cep}</span>
              </div>
              <div>
                <p>Estado</p>
                <span>{selectedClient.estado}</span>
              </div>
              <div>
                <p>Cidade</p>
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

      <div className="clients-list">{renderClientList()}</div>
    </div>
  );
}
