import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './Searchstyle.css';
import Button from '@mui/material/Button';
import { IoSearch } from "react-icons/io5";

const searchindex = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <form onSubmit={handleSearch} className='searchBox flex w-[100%] h-[50px] bg-slate-200 rounded-[5px] relative p-2'>
      <input
        type='text'
        placeholder='Search for products, brands, categories...'
        className='w-full h-[35px] focus:outline-none bg-inherit p-2 text-[15px] text-slate-800'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <Button
        type="submit"
        className='right-[5px] z-[50] !w-[37px] !min-w-[37px] h-[37px] !rounded-full !p-0'
        disabled={!searchQuery.trim()}
      >
        <IoSearch className='text-lg'/>
      </Button>
    </form>
  )
}

export default searchindex
