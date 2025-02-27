import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiConstants from '../constants/ApiConstants';
import { fetchData } from '../utils/apiServices';

export const fetchProducts = createAsyncThunk('products/fetchProducts', async ({ page, searchQuery, replace }) => {
  let url = searchQuery
    ? `${ApiConstants.DUMMY_JSON_BASE_URL}/products/search?q=${searchQuery}&limit=10&skip=${page * 10}`
    : `${ApiConstants.DUMMY_JSON_BASE_URL}/products?limit=10&skip=${page * 10}&select=title`;

  const data = await fetchData(url)
  return { products: data.products, replace };
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    selectedProducts: [],
    searchQuery: '',
    page: 0,
    hasMore: true,
  },
  reducers: {
    selectProduct: (state, action) => {
      state.selectedProducts.push(action.payload);
    },
    removeProduct: (state, action) => {
      state.selectedProducts = state.selectedProducts.filter(product => product.id !== action.payload);
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.page = 0;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    resetProducts: (state) => {
      state.items = [];
      state.hasMore = true;
    },
    resetHasMore: (state) => {
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      if (action.payload.replace) {
        state.items = action.payload.products; // Replace items on new search
      } else {
        state.items = [...state.items, ...action.payload.products]; // Append items on scroll
      }
      if (action.payload.products.length < 10) state.hasMore = false;
    });
  }
});

export const { selectProduct, removeProduct, setSearchQuery, setPage, resetProducts } = productSlice.actions;
export default productSlice.reducer;



