import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { searchEvents, clearSearchResults } from '../../redux/slices/eventSlice';
import debounce from 'lodash/debounce';
import './SearchBar.css';

const SearchBar = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    location: '',
    isRecurring: false
  });

  const debouncedSearch = useCallback(
    debounce((term, filterValues) => {
      if (term || Object.values(filterValues).some(value => value)) {
        dispatch(searchEvents({ searchTerm: term, filters: filterValues }));
      } else {
        dispatch(clearSearchResults());
      }
    }, 300),
    []
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value, filters);
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    const updatedFilters = { ...filters, [name]: newValue };
    setFilters(updatedFilters);
    debouncedSearch(searchTerm, updatedFilters);
  };

  const handleClear = () => {
    setSearchTerm('');
    setFilters({
      startDate: '',
      endDate: '',
      location: '',
      isRecurring: false
    });
    dispatch(clearSearchResults());
  };

  return (
    <div className="search-bar-container">
      <div className="search-input-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder="Search events..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button
          className="filter-toggle"
          onClick={() => setShowFilters(!showFilters)}
          aria-label="Toggle filters"
        >
          <i className="fas fa-filter"></i>
        </button>
        {(searchTerm || Object.values(filters).some(value => value)) && (
          <button
            className="clear-button"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>
      
      {showFilters && (
        <div className="filters-container">
          <div className="filter-group">
            <label>
              Start Date:
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
              />
            </label>
          </div>
          <div className="filter-group">
            <label>
              End Date:
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
              />
            </label>
          </div>
          <div className="filter-group">
            <label>
              Location:
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="Enter location..."
              />
            </label>
          </div>
          <div className="filter-group">
            <label>
              <input
                type="checkbox"
                name="isRecurring"
                checked={filters.isRecurring}
                onChange={handleFilterChange}
              />
              Recurring Events
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar; 