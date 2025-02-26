import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext"; 
import Home from "./pages/Home";
import Nav from "./component/Nav";
import Footer from "./component/Footer";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Menu from "./pages/Menu";
import PcPage from "./component/PcPage";
import Catalog from "./pages/Catalog";

function App() {
  return (
    <div className="app-container">
      <UserProvider>
        <BrowserRouter>
          <Nav />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/pc/:id" element={<PcPage />} />
            </Routes>
          </div>
          <Footer />
        </BrowserRouter>
      </UserProvider>
    </div>
  );
}

export default App;
