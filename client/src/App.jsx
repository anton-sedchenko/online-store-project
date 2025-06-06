import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter.jsx";
import Wrapper from "./components/Wrapper.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";

function App() {

  return (
    <BrowserRouter>
        <Wrapper>
            <AppRouter />
        </Wrapper>
    </BrowserRouter>
  );
}

export default App
