import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import AppLayout from "../App";
import Home from "../pages/Home";
import Information from "../components/Information";
import Token from "../components/Token";
import Counter from "../components/Counter";
import Countdown from "../components/Countdown";
import EditDisplay from "../components/EditDisplay";
import PaymentPage from "../components/PaymentPage";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="information" element={<Information />} />
          <Route path="token" element={<Token />} />
          <Route path="counter" element={<Counter />} />
          <Route path="countdown" element={<Countdown />} />
          <Route path="editdisplay" element={<EditDisplay />} />
          <Route path="paymentpage" element={<PaymentPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
