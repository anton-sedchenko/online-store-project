import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter.jsx";

function App() {

  return (
    <BrowserRouter>
        <AppRouter />
    </BrowserRouter>
  );
}

export default App
