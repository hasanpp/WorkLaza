import { useAuth } from "../Authstate"


const Admin = () => {

  
  const { isAuthenticated, isAdmin, isWorker, } = useAuth();

 console.log(isAdmin);
 

  return (
    <div>
      <h1 style={{color:'#fff'}}>admin_panel</h1>
    </div>
  )
}

export default Admin
