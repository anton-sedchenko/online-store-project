import {createContext, StrictMode} from "react"
import {createRoot} from "react-dom/client"
import App from "./App.jsx"
import UserStore from "./store/UserStore.js";
import ProductStore from "./store/ProductStore.js";
import CartStore from "./store/CartStore.js";
import AdminStore from "./store/AdminStore.js";

export const Context = createContext(null);
const userStore   = new UserStore();
const productStore = new ProductStore();
const cartStore   = new CartStore(userStore);
const adminStore = new AdminStore();

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Context.Provider value={{userStore, productStore, cartStore, adminStore}}>
          <App />
      </Context.Provider>
  </StrictMode>,
);
