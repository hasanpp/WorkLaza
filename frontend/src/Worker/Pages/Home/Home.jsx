import './Home.css'
import { CardChecklist, BoxFill, PersonCheckFill, Wallet2 } from 'react-bootstrap-icons'

const Home = () => {
  return (
    <div className='main_worker_home'>
      <span>Home</span>
      <div className="top_row">
        <div className="new_task">
          <BoxFill/>
          <span>New tasks</span>
          <h4 className="count">08</h4>
        </div>
        <div className="new_task">
          <CardChecklist/>
          <span>Tasks completed</span>
          <h4 className="count">08</h4>
        </div>
        <div className="new_task">
          <PersonCheckFill/>
          <span>New reviews</span>
          <h4 className="count">08</h4>
        </div>
        <div className="new_task">
          <Wallet2/>
          <span>Platform fee</span>
          <h4 className="count">08</h4>
        </div>
      </div>
    </div>
  )
}

export default Home
