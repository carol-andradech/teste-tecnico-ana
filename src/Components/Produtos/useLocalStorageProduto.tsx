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
    // Verifica se a imagem é uma string em base64 antes de armazená-la
    if (produtoInfo.imagem.startsWith("data:image")) {
      setProduto((prevProduto) => [...prevProduto, produtoInfo]);
    } else {
      console.error("Imagem inválida.");
    }
  };

  const deleteProduto = (productId) => {
    setProduto((prevProduto) =>
      prevProduto.filter((product) => product.id !== productId)
    );
  };

  return { createProduto, deleteProduto, produto };
}
