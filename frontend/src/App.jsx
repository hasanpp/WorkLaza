
import RouteSets from './Routes';
import Loader from './Compenets/Loader/Loader';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import { createContext, useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider } from 'react-redux';
import { store, persistor } from './store';
import { PersistGate } from 'redux-persist/integration/react';
import { Toaster } from 'sonner'

export const LoadingContext = createContext();

function App() {

  const GOOGLE_CLIENT_ID = "358220686468-isdt3qooc2dedok4sg0h7kovaq2f03ld.apps.googleusercontent.com";
  const [isLoading, setIsLoading] = useState(false);

  return (
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <LoadingContext.Provider value={setIsLoading}>
              <RouteSets />
            </LoadingContext.Provider>
            {isLoading && <Loader />}
            <Toaster position="top-right" theme="dark" richColors={true}/>
          </GoogleOAuthProvider>
        </PersistGate>
      </Provider>
    </BrowserRouter>
  )
}

export default App
