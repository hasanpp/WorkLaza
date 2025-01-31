
import RouteSets from './Routes';
import Loader from './Compenets/Loader/Loader';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import { createContext, useState } from 'react';
import { ToastContainer } from 'react-toastify';


export const LoadingContext = createContext();

function App() {


  const [isLoading, setIsLoading] = useState(false);

  return (
    <BrowserRouter>
      <LoadingContext.Provider value={setIsLoading}>
        <RouteSets />
      </LoadingContext.Provider>
      {isLoading && <Loader />}
      <ToastContainer theme='dark'/>
    </BrowserRouter>
  )
}

export default App
