import React from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProductDropdown from "./components/ProductDropdown";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<ProductDropdown />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;

/* ===============     Some Extra Features which I have added     =============================

  1) (dummyjson.com) this api renders unused data for each object in the api, which can cause performance issues, 
     So, I have fetched only the id, title of each object from the api
     This significanlty increases the performance. 

  2) When we click outside of the dropdown, the dropdown closes
     And when we click on the searchbar then dropdown opens again

  3) I have also implemented url-sharing, so that state of this app can we preserved when we open the url in new tab

  4) This app is designed in fully responsive way 
     
  5) Each time instead of fetching more data, I fetched only 10 records from the api, this increases the performance

  6) When user enters search-word, instead of calling the apis immediately 
    I used debounce technique, to call the api after 1 second of user entered the search-word
    This reduces the redundant api calls and increases performance drastically
    This saves the band-width, resources.

  7) Maintained clean project structure

*/

/* ===============     List limitations here     =============================
 
1) Performance Bottlenecks
 - The dropdown uses infinite scrolling, which may result in excessive API calls when the user scrolls quickly.
 - If the API has a rate limit, frequent requests may cause throttling or temporary unavailability.
 - The application fetches 10 items per request, but if the dataset is large (e.g., 10,000+ items), 
   performance may degrade due to increased rendering time.


2) API Constraints
  - The API provider (dummyjson.com) may limit requests per second. If exceeded, the API may reject requests temporarily.
  - API responses include unnecessary fields, increasing payload size.

3) Unsupported Features 
  - We can add retry mechanism , in case of api rate limiting
  - Keyboard navigation (arrow keys, Enter selection) is not yet implemented.
  - store the api-response in redux or localhost or redis, so that, when the user makes the same search again, 
    instead of getting data from database, we can get the data from cache
  - we can add animation effects if needed

 */
