import { useEffect, useState } from "react";

export default function usaLocalStorage(key, initialValue) {
  const [value, setValue] = useState(
    localStorage[key] ? JSON.parse(localStorage[key]) : initialValue
  );

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
}

export function useClient() {
  const [clients, setClients] = usaLocalStorage("clients", []);

  const createClient = (clientInfo) => {
    setClients((prevClients) => [...prevClients, clientInfo]);
  };

  const updateClient = (clientId, newClientInfo) => {
    setClients((prevClients) => {
      const clientIndex = prevClients.findIndex(
        (client) => client.id === clientId
      );
      const updatedClients = [...prevClients];
      updatedClients.splice(clientIndex, 1, newClientInfo);
      return updatedClients;
    });
  };

  const deleteClient = (clientId) => {
    setClients((prevClients) =>
      prevClients.filter((client) => client.id !== clientId)
    );
  };

  return { createClient, updateClient, deleteClient, clients };
}
