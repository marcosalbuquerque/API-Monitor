import { BrowserRouter, Route, Routes } from "react-router-dom";

import ApiDetail from "./pages/ApiDetail";
import Home from "./pages/Home";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apis/:id" element={<ApiDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
