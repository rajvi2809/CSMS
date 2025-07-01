import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./static/users.css";
import "./static/login.css";
import "./static/sidebar.css";
import "./static/booking.css";
import "./static/userDetails.css";
import "./static/chargingStation.css";
import "./static/stationDetails.css";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter } from "react-router-dom";
import { persistor, store } from "./store/store.js";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { CookiesProvider } from "react-cookie";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate persistor={persistor} />
    <CookiesProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CookiesProvider>
  </Provider>
);
