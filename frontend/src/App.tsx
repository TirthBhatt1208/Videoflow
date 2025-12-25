import { Routes , Route } from "react-router-dom"
import {Home , Login , Signup , DashBoard} from "./Pages"
import {ThemeProvider} from "./Context/ThemeProvider"
function App() {

  return (
    <ThemeProvider>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App
