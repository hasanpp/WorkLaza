import { Routes, Route } from 'react-router-dom'
import SignIn from "./routes/SignIn";
import SignUp from "./routes/SignUp";
import EnterOTP from './routes/varification/EnterOTP';
import Layout from './Layout/Layout';
import Forgot from './routes/varification/Forgot';
import ChangePassword from './routes/varification/ChangePassword';
import Admin from './Admin/Admin'
import WorkerRegister from './routes/WorkerRegister';
import Worker from './Worker/Worker';
import ProtectedRoute from './Compenets/ProtectedRoute/ProtectedRoute'

function RouteSets() {

  return (
      <Routes> 
        <Route path="*" element={<Layout not_found="true" />} />
        <Route path="/" element={<Layout not_found="false"/>} />
        <Route path="/signin" element={<SignIn/>} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/worker_register" element={<ProtectedRoute><WorkerRegister/></ProtectedRoute>} />
        <Route path="/signup/enterotp" element={<EnterOTP />} />
        <Route path="/Forgot" element={<Forgot/>}/>
        <Route path="/change_password" element={<ChangePassword/>}/>
        <Route path="/admin-panel" element={<ProtectedRoute><Admin/></ProtectedRoute>}/>
        <Route path="/worker" element={<ProtectedRoute><Worker/></ProtectedRoute>}/>
      </Routes>
  )
}

export default RouteSets
