import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-toastify/dist/ReactToastify.css";
import "react-quill/dist/quill.snow.css";
import { StyleSheetManager } from "styled-components";
import App from "./App";
import "./App.css";
import { SessionStorageProvider } from "context/SessionStorageContext";

const shouldForwardProp = (prop) => !/^sortActive$/.test(prop);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <StyleSheetManager shouldForwardProp={shouldForwardProp}>
      <SessionStorageProvider>
          <App />
      </SessionStorageProvider>
    </StyleSheetManager>
  </React.StrictMode>
);
