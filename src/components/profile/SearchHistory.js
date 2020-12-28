import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { backendUrl } from '../../helpers/constants';
import SearchHistoryTable from './SearchHistoryTable';

const SearchHistory = ({ currentUser }) => {
  const [searchedDoctors, setSearchedDoctors] = useState([]);
  useEffect(() => {
    const getSearches = async () => {
      const allDoctors = [];
      for (let i = 0; i < currentUser.searches.length; i++) {
        const { id } = currentUser.searches[i];
        const { data } = await Axios.get(`${backendUrl}/searches/${id}`);
        allDoctors.push(...data);
      }
      setSearchedDoctors(allDoctors);
    };
    getSearches();
  }, [currentUser.searches]);

  return searchedDoctors.length > 0 ? (
    <SearchHistoryTable doctors={searchedDoctors} />
  ) : (
    <p>Loading...</p>
  );
};

export default SearchHistory;
