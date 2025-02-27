
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, selectProduct, removeProduct, setSearchQuery } from '../redux/productSlice';
import InfiniteScroll from 'react-infinite-scroll-component';
import '../styles/ProductDropdown.css';
import { useSearchParams } from 'react-router-dom';

const ProductDropdown = () => {
  const dispatch = useDispatch();
  const { items, selectedProducts, searchQuery, hasMore } = useSelector(state => state.products);
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [showDropdown, setShowDropdown] = useState(true);
  const [page, setPage] = useState(0);
  const dropdownRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const isFirstLoad = useRef(true); //  Track first load

  useEffect(() => {
    if (!isFirstLoad.current) return; //  Prevent reloading after first time
  
    const query = searchParams.get('search') || '';
    const selectedFromUrl = searchParams.get('selected') 
      ? searchParams.get('selected').split(',').map(item => {
          const [id, title] = item.split(':');
          return { id: Number(id), title };
        })
      : [];
  
    setSearchInput(query);
    dispatch(setSearchQuery(query));
    selectedFromUrl.forEach(product => dispatch(selectProduct(product)));
  
    dispatch(fetchProducts({ page: 0, searchQuery: query }));
    setShowDropdown(true);
  
    isFirstLoad.current = false;
  }, [dispatch, searchParams]); 

  
  useEffect(() => {
    const timer = setTimeout(() => {
      const selectedString = selectedProducts.map(p => `${p.id}:${p.title}`).join(',');
      setSearchParams({ search: searchInput, selected: selectedString });
    }, 1000);
  
    return () => clearTimeout(timer);
  }, [searchInput, selectedProducts]);

  
  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setSearchQuery(searchInput));
      dispatch(fetchProducts({ page: 0, searchQuery: searchInput, replace: true }));
      setShowDropdown(true);
      if (!searchInput.trim()) {
        dispatch({ type: 'products/resetHasMore' });
      }
      setPage(0);
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchInput, dispatch]);

  
  // Load more products when scrolled to bottom
  const fetchMoreProducts = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    dispatch(fetchProducts({ page: nextPage, searchQuery }));
  };

  // Handle search input
  const handleSearch = (event) => {
    setSearchInput(event.target.value);
    setShowDropdown(true);
  };

  // Select product
  const handleSelectProduct = (product) => {
    dispatch(selectProduct(product));
    setShowDropdown(true);
  };

  // Remove selected product
  const handleRemoveProduct = (id) => {
    dispatch(removeProduct(id));
  };

  // Hide dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Exclude already selected products from dropdown
  const availableProducts = items.filter(product =>
    !selectedProducts.some(selected => selected.id === product.id)
  );

  const handleFocus = () => {
    setShowDropdown(true); // Open dropdown when clicking on search bar
  };

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <h1>Combobox - Assignment</h1>

      {/* Search Box with Selected Items */}
      <div className="search-box">
        {selectedProducts.map(product => (
          <span key={product.id} className="selected-tag">
            {product.title} <span className="remove-btn" onClick={() => handleRemoveProduct(product.id)}>×</span>
          </span>
        ))}
        <input
          type="text"
          placeholder="Search Products"
          value={searchInput}
          onChange={handleSearch}
          onFocus={handleFocus} 
          className="search-input"
        />
      </div>


      {/* Product Dropdown with Infinite Scroll */}
      {showDropdown && (
        <div className="dropdown" id="dropdown-scroll">
          <InfiniteScroll
            dataLength={availableProducts.length}
            next={fetchMoreProducts}
            hasMore={hasMore}
            loader={<p className="loading-text">Loading more...</p>}
            scrollableTarget="dropdown-scroll"
          >
            {availableProducts.length > 0 ? (
              availableProducts.map(product => (
                <div key={product.id} className="dropdown-item" onClick={() => handleSelectProduct(product)}>
                  {product.title}
                </div>
              ))
            ) : (
              <div className="dropdown-item no-results">No products found</div>
            )}
          </InfiniteScroll>
        </div>
      )}
    </div>
  );
};

export default ProductDropdown;

