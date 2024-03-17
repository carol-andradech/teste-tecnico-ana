import { useEffect, useState } from "react";

export default function useLocalStoragePedido(key, initialValue) {
  const [value, setValue] = useState(
    localStorage[key] ? JSON.parse(localStorage[key]) : initialValue
  );

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
}

export function usePedido() {
  const [pedido, setPedido] = useLocalStoragePedido("pedido", []);

  const createPedido = (pedidoInfo) => {
    setPedido((prevPedido) => [...prevPedido, pedidoInfo]);
  };

  const deletePedido = (pedidoId) => {
    setPedido((prevPedido) =>
      prevPedido.filter((pedido) => pedido.id !== pedidoId)
    );
  };

  return { createPedido, deletePedido, pedido };
}
