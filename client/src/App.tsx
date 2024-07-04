import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { ShopPage } from "./pages/shop";
import { AuthPage } from "./pages/auth";
import { CheckoutPage } from "./pages/checkout";
import { PurchasedItemsPage } from "./pages/purchased-items";
import { Navbar } from "./components/navbar";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<ShopPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/purchased-items" element={<PurchasedItemsPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
