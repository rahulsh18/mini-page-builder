import React from 'react'
import gripIcon from '../../img/grip-vertical.svg'
import './styles.css'


const sidebarElementOptions = [
  {id: 1, type: "Label"},
  {id: 2, type: "Input"},
  {id: 3, type: "Button"},
]
const Sidebar = ({setElement}) => {

  const handleDragStart = (event, elementType) => {
    setElement(elementType);
  };
  
  return (
    <div>
      <h2 className="sidebar-heading">
        BLOCKS
      </h2>
      <div className='sidebar-elements'>
      {sidebarElementOptions.map((option) => (
          <div key={option.id} className='sidebar-element' draggable={true} onDragStart={(e) => handleDragStart(e, option.type)} aria-label={option.type}>
            <img src={gripIcon} alt='Drag' style={{ height: '20px', width: '15px', paddingLeft: '10px' }} />
            <span>{option.type}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Sidebar