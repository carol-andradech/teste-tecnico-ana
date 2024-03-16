export default function HeaderBar() {
  return (
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
  );
}
