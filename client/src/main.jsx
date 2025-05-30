import {createContext, StrictMode} from "react"
import { createRoot } from "react-dom/client"
import App from "./App.jsx"
import UserStore from "./store/UserStore.js";
import FigureStore from "./store/FigureStore.js";

export const Context = createContext(null);

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Context.Provider value={{
          user: new UserStore(),
          figure: new FigureStore()
      }}>
          <App />
      </Context.Provider>,
  </StrictMode>,
);
