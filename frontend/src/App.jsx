import { Routes, Route } from "react-router-dom";
import { useState } from "react";

import Home from "./pages/Home/Home";
import MovieDetails from "./pages/MovieDetails/MovieDetails";
import SeatSelection from "./pages/SeatSelection/SeatSelection";
import OrderSummary from "./pages/OrderSummary/OrderSummary";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [user, setUser] = useState({
    name: "Alex Rivera",
    role: "Member",
  });

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Home
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
            user={user}
            setUser={setUser}
          />
        }
      />

      <Route path="/movie/:id" element={<MovieDetails />} />

      <Route
        path="/seats/:id"
        element={
          <SeatSelection
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
            user={user}
            setUser={setUser}
          />
        }
      />
      <Route path="/summary" element={<OrderSummary />} />
    </Routes>
  );
}

export default App;