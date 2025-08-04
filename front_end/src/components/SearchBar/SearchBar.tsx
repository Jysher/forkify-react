import { useState, type FormEvent } from 'react';
import icons from '/icons.svg';
import './SearchBar.css';

type SearchBarProps = {
  searchHandler: (query: string) => void;
};

function SearchBar({ searchHandler }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const search = (e: FormEvent) => {
    e.preventDefault();
    setQuery('');
    searchHandler(query);
  };

  return (
    <form className="search" onSubmit={search}>
      <input
        type="text"
        className="search__field"
        placeholder="Search over 1,000,000 recipes..."
        onChange={e => setQuery(e.target.value)}
      />
      <button className="btn search__btn">
        <svg className="search__icon">
          <use href={`${icons}#icon-search`}></use>
        </svg>
        <span>Search</span>
      </button>
    </form>
  );
}

export default SearchBar;
