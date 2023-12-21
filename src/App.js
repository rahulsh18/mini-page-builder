
import './App.css';
import { useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import DropArea from './components/DropArea/DropArea';

    const App = () => {
      const [element, setElement] = useState("");
      return (
        <div className="container">
          <div className='drop-area-container'>
            <DropArea element={element} setElement={setElement} />
          </div>
          <div className='sidebar-container'>
            <Sidebar setElement={setElement}/>
        </div>
          </div>
      );
    };
    



export default App;
