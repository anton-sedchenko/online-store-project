import {createContext, StrictMode} from "react"
import {createRoot} from "react-dom/client"
import App from "./App.jsx"
import UserStore from "./store/UserStore.js";
import FigureStore from "./store/FigureStore.js";
import CartStore from "./store/CartStore.js";
import AdminStore from "./store/AdminStore.js";

export const Context = createContext(null);
const user   = new UserStore();
const figure = new FigureStore();
const cart   = new CartStore(user);
const adminStore = new AdminStore();

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Context.Provider value={{user, figure, cart, adminStore}}>
          <App />
      </Context.Provider>
  </StrictMode>,
);
