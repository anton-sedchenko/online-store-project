import {createContext, StrictMode} from "react"
import {createRoot} from "react-dom/client"
import App from "./App.jsx"
import UserStore from "./store/UserStore.js";
import ProductStore from "./store/ProductStore.js";
import CartStore from "./store/CartStore.js";
import AdminStore from "./store/AdminStore.js";
import {HelmetProvider} from 'react-helmet-async';
import ArticleStore from "./store/ArticleStore.js";
import 'leaflet/dist/leaflet.css';

export const Context = createContext(null);
const userStore   = new UserStore();
const productStore = new ProductStore();
const cartStore   = new CartStore(userStore);
const adminStore = new AdminStore();
const articleStore = new ArticleStore();

userStore.checkAuth().finally(() => {
    createRoot(document.getElementById('root')).render(
      <StrictMode>
          <HelmetProvider>
              <Context.Provider value={{
                  userStore,
                  productStore,
                  cartStore,
                  adminStore,
                  articleStore
              }}>
                  <App />
              </Context.Provider>
          </HelmetProvider>
      </StrictMode>,
)});
