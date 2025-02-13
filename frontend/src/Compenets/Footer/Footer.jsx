import './Footer.css'
import  {Facebook,Linkedin,Instagram} from 'react-bootstrap-icons'

const Footer = () => {
  return (
    <div className='footer container-fluid'>
      <br /> <br />
      <div className="footer-bootam">
        <span>Terms & Conditions &nbsp;&nbsp;|&nbsp;&nbsp; Privacy Policy</span>
        <span className='icones ic_big'><Facebook/><Linkedin/><Instagram/></span>
        <span>© 2025 WorkLaza. All rights reserved.</span>
        <span className='icones ic_small'><Facebook/><Linkedin/><Instagram/></span>
      </div>
    </div>
    
  )
}

export default Footer
