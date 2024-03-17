import { useEffect, useState } from "react";

export default function useLocalStorageProduto(key, initialValue) {
  const [value, setValue] = useState(
    localStorage[key] ? JSON.parse(localStorage[key]) : initialValue
  );

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
}

export function useProduto() {
  const [produto, setProduto] = useLocalStorageProduto("produto", []);

  const createProduto = (produtoInfo) => {
    setProduto((prevProduto) => [...prevProduto, produtoInfo]);
  };

  const deleteProduto = (productId) => {
    setProduto((prevProduto) =>
      prevProduto.filter((product) => product.id !== productId)
    );
  };

  return { createProduto, deleteProduto, produto };
}
