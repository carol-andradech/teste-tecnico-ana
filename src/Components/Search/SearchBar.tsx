export default function SearchBar() {
  return (
    <div className="search">
      <div className="search-bar">
        <form action="">
          <input
            type="text"
            placeholder="    Pesquisar"
            className="search-input"
          />
          <img src={searchImg} className="search-icon" />
        </form>
      </div>
    </div>
  );
}
