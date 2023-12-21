import "./styles.css"
import { useState } from "react";

const ConfigModal = ({ onClose, dropCoordinates, onSaveChanges, selectedBlock = {}, setOverlayVisible }) => {
  const [isInvalid, setIsInvalid] = useState({
    xCoordinate: false,
    yCoordinate: false,
    fontSize: false,
    fontWeight: false,
  });

  const handleClose = () => {
    onClose();
    setOverlayVisible(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const { text, xCoordinate, yCoordinate, fontSize, fontWeight } = e.target.elements;


    const newXCoordinate = parseInt(xCoordinate.value);
    const newYCoordinate = parseInt(yCoordinate.value);
    const newFontSize = parseInt(fontSize.value);
    const newFontWeight = parseInt(fontWeight.value);

    const invalidValues = {
      xCoordinate: isNaN(newXCoordinate),
      yCoordinate: isNaN(newYCoordinate),
      fontSize: isNaN(newFontSize),
      fontWeight: isNaN(newFontWeight),
    };

    if (Object.values(invalidValues).some((value) => value)) {
      setIsInvalid(invalidValues);
    } else {
      const newText = text.value ? text.value : `This is a ${selectedBlock.type}`;
      let newBlock = {
        id: new Date().getTime(),
        text: newText,
        x: newXCoordinate,
        y: newYCoordinate,
        fontSize: newFontSize,
        fontWeight: newFontWeight,
      };
      if(Object.keys(selectedBlock).length > 0) {
        newBlock = {
          ...newBlock,
          id: selectedBlock.data.id
        }
        onSaveChanges(newBlock)
      }else {
        onSaveChanges(newBlock);
      }
     
      onClose();
    }
  };
  
  const handleInputChange = (e) => {
    const { value, name } = e.target;
    setIsInvalid((prevState) => ({
      ...prevState,
      [name]: value.trim() !== '' && isNaN(parseInt(value)),
    }));
  };

  return (
    <div className="modal">
      <div className="modal-header">
        <span className="modal-title">Edit {selectedBlock.type}</span>
        <button className="close-button" onClick={handleClose}>
          X
        </button>
      </div>
      <form onSubmit={handleFormSubmit}>
        <div>
          <label htmlFor="text">Text</label>
          <input type="text" id="text" name="text" defaultValue={selectedBlock === null ? `This is a ${selectedBlock.type}`: selectedBlock?.data?.text} />
        </div>
        <div>
          <label htmlFor="xCoordinate">X</label>
          <input type="text" id="xCoordinate" name="xCoordinate" onInput={handleInputChange} defaultValue={dropCoordinates.x} required />
          {isInvalid.xCoordinate && <span className="validation-message">X coordinate should be a number</span>}
        </div>
        <div>
          <label htmlFor="yCoordinate">Y</label>
          <input type="text" id="yCoordinate" name="yCoordinate" onInput={handleInputChange} defaultValue={dropCoordinates.y} required />
          {isInvalid.yCoordinate && <span className="validation-message">Y coordinate should be a number</span>}
        </div>
        <div>
          <label htmlFor="fontSize">Font Size</label>
          <input type="text" id="fontSize" name="fontSize" onInput={handleInputChange} defaultValue={selectedBlock === null ? null: selectedBlock?.data?.fontSize} />
          {isInvalid.fontSize && <span className="validation-message">Font Size should be a number</span>}
        </div>
        <div>
          <label htmlFor="fontWeight">Font Weight</label>
          <input type="text" id="fontWeight" name="fontWeight" onInput={handleInputChange} defaultValue={selectedBlock === null?  null: selectedBlock?.data?.fontWeight} />
          {isInvalid.fontWeight && <span className="validation-message">Font Weight should be a number</span>}
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default ConfigModal;
