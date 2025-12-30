import { Routes, Route, Navigate } from "react-router-dom";
import { Home, Login, Signup, DashBoard } from "./Pages";
import { ThemeProvider } from "./Context/ThemeProvider";
import { useAuth } from "@clerk/clerk-react";

function App() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return null; // or loader
  }

  return (
    <ThemeProvider>
      <Routes>
        <Route
          path="*"
          element={
            isSignedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          index
          element={isSignedIn ? <Navigate to="/dashboard" /> : <Home />}
        />

        <Route
          path="/login"
          element={isSignedIn ? <Navigate to="/dashboard" /> : <Login />}
        />

        <Route
          path="/signup"
          element={isSignedIn ? <Navigate to="/dashboard" /> : <Signup />}
        />

        <Route path="/dashboard" element={<DashBoard />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
