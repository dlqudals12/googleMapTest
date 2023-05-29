import "./App.css";
import { Route, Routes } from "react-router-dom";
import { GoogleMapFirst } from "./component/googleMap/GoogleMapFirst";

function App() {
  return (
    <>
      <Routes>
        <Route path={"/"} element={<GoogleMapFirst />} />
      </Routes>
    </>
  );
}

export default App;
