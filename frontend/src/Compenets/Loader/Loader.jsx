import logo from '../../assets/logo.png'
import "./Loader.css"; 

const Loader = () => {
    return (
        <div className="loading-overlay">
      <div className="loading-box">
        <img src={logo} alt="Loading" className="loading-logo" />
        <p className="loading-message">Loading... Please wait</p>
      </div>
    </div>
    );
};

export default Loader;
