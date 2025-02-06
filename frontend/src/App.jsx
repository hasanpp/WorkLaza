
import RouteSets from './Routes';
import Loader from './Compenets/Loader/Loader';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import { createContext, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { GoogleOAuthProvider } from '@react-oauth/google';

export const LoadingContext = createContext();

function App() {

  const GOOGLE_CLIENT_ID = "358220686468-isdt3qooc2dedok4sg0h7kovaq2f03ld.apps.googleusercontent.com";
  const [isLoading, setIsLoading] = useState(false);

  return (
    <BrowserRouter>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <LoadingContext.Provider value={setIsLoading}>
        <RouteSets />
      </LoadingContext.Provider>
      {isLoading && <Loader />}
      <ToastContainer theme='dark'/>
    </GoogleOAuthProvider>
    </BrowserRouter>
  )
}

export default App
