
import './App.css';
import Home from './Home/Home';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  return (
  //Routers
     <Router>
      <Routes>
        <Route path='/' element={<Home/>}/>
      </Routes>
     </Router>
   
  );
}

export default App;
