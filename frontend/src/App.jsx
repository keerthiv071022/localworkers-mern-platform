import WorkerProfile from "./pages/WorkerProfile";
import FindWorkers from "./pages/FindWorkers";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import FeaturedWorkers from "./components/FeaturedWorkers";
import Footer from "./components/Footer";
import CustomerDashboard from "./pages/CustomerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";
import WorkerDetails from "./pages/WorkerDetails";
import WorkerDashboard from "./pages/WorkerDashboard";
import MyRequests from "./pages/MyRequests";
import SavedWorkers from "./pages/SavedWorkers";
import "./App.css";
function Home() {
  return (
    <>
      <Hero />
      <Services />
      <FeaturedWorkers />
    </>
  );
}

function App() {
  return (
    <>
      <Navbar />

      <Routes>
<Route
  path="/customer/saved-workers"
  element={<SavedWorkers />}
/>
<Route
  path="/customer/requests"
  element={
    <ProtectedRoute allowedRole="customer">
      <MyRequests />
    </ProtectedRoute>
  }
/>

        <Route
  path="/workers/:id"
  element={<WorkerDetails />}
/>
        <Route
  path="/workers"
  element={<FindWorkers />}
/>
        <Route
  path="/worker/profile"
  element={
    <ProtectedRoute allowedRole="worker">
      <WorkerProfile />
    </ProtectedRoute>
  }
/>
        <Route
  path="/worker/dashboard"
  element={
    <ProtectedRoute allowedRole="worker">
      <WorkerDashboard />
    </ProtectedRoute>
  }
/>
        <Route
  path="/customer/dashboard"
  element={
    <ProtectedRoute allowedRole="customer">
      <CustomerDashboard />
    </ProtectedRoute>
  }
/>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
