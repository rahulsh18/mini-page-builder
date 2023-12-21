import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import "./styles.css";
import ConfigModal from "../ConfigModal/ConfigModal";

const DropArea = ({ element, setElement }) => {
  const [showModal, setShowModal] = useState(false);
  const [elementType, setElementType] = useState(null);
  const [dropCoordinates, setDropCoordinates] = useState({ x: null, y: null });
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState({});
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const selectedElementRef = useRef(null);
  const [blocks, setBlocks] = useState(localStorage.getItem("blocks") ? JSON.parse(localStorage.getItem("blocks")) : []);

  
  const handleFocus = (block) => {
    setSelectedBlock(block);
  };

  const handleDragStart = (e, block, id) => {
    e.dataTransfer.setData("text/plain", JSON.stringify({ block, id }));
    setSelectedBlockId(id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setSelectedBlock({})
    if (element) {
      const x = e.clientX;
      const y = e.clientY;
      setElementType(element);
      setDropCoordinates({ x, y });
      setShowModal(true);
      setOverlayVisible(true);
      setElement("")
    } else {
      const draggedItem = e.dataTransfer.getData("text/plain") ? JSON.parse(e.dataTransfer.getData("text/plain")) : {};
      const { block, id } = draggedItem;
      const newX = e.clientX;
      const newY = e.clientY;

      const updatedBlocks = blocks.map((b, i) => {
        if ((b.data || {}).id === id) {
          return {
            ...b,
            data: {
              ...b.data,
              x: newX,
              y: newY,
            },
          };
        }
        return b;
      });

      setBlocks(updatedBlocks);
    }
  };

  const handleSaveChanges = (newBlock) => {
    const existingDataIdx = blocks.findIndex((x)=> x.data.id === newBlock.id);
    if(existingDataIdx > -1){
      const newBlockArr = [...blocks.slice(0, existingDataIdx), {type: elementType, data: newBlock}, ...blocks.slice(existingDataIdx + 1)]
      setBlocks(newBlockArr)
    }else {
      setBlocks((prev) => [...prev, {type: elementType, data: newBlock}]);
    }
    setSelectedBlockId(null);
    setShowModal(false);
    setOverlayVisible(false);
  };

  const handleKeyPress = (e, block) => {
    e.preventDefault();
    if (e.key === "Enter") {
      setSelectedBlock(block);
      setShowModal(true);
      setElementType(block.type);
      setDropCoordinates({ x: block.data.x, y: block.data.y });
    } else if (e.key === "Backspace" && !!selectedBlock) {
      const updatedBlocks = blocks.filter((b) => b.data.id !== block.data.id);
      setBlocks(updatedBlocks);
      setSelectedBlock(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        selectedElementRef.current &&
        !selectedElementRef.current.contains(event.target)
      ) {
        setSelectedBlock(null);
        setSelectedBlockId(null);
      }
    };
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);


  useEffect(() => {
    localStorage.setItem("blocks", JSON.stringify(blocks));
  }, [blocks]);


  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{ height: "100vh", position: "relative" }}
    >
      {overlayVisible && <div className="overlay" />}
      {showModal &&
        createPortal(
          <ConfigModal
            onClose={() => setShowModal(false)}
            dropCoordinates={dropCoordinates}
            onSaveChanges={handleSaveChanges}
            selectedBlock={selectedBlock}
            setOverlayVisible={setOverlayVisible}
          />,
          document.body
        )}
      {blocks.map((block) => {
        let element;
        const elementId = (block.data || {}).id
        const isSelected = elementId === selectedBlockId;
        if (block.type === "Label") {
          element = (
            <label
              key={elementId}
              onFocus={() => handleFocus(block)}
              onKeyDown={(e) => handleKeyPress(e, block)}
              onDragStart={(e) => handleDragStart(e, block, elementId)}
              draggable
              tabIndex={0}
              style={{
                minWidth: "40px",
                minHeight: "auto",
                fontSize: `${block.data.fontSize}px`,
                fontWeight: `${block.data.fontWeight}px`,
                border: isSelected ? "2px solid red" : "none",
                color: "black",
                position: "absolute",
                left: block.data.x,
                top: block.data.y,
                cursor: "pointer"
              }}
              onClick={() => setSelectedBlockId(elementId)}
              ref={block.type === selectedBlock ? selectedElementRef : null}
            >
              {block.data.text}
            </label>
          );
        } else if (block.type === "Input") {
          element = (
            <input
              key={elementId}
              onFocus={() => handleFocus(block)}
              onKeyDown={(e) => handleKeyPress(e, block)}
              onDragStart={(e) => handleDragStart(e, block, elementId)}
              value={block.data.text}
              draggable
              style={{
                minWidth: "300px",
                minHeight: "50px",
                outline: "none",
                fontSize: `${block.data.fontSize}px`,
                fontWeight: `${block.data.fontWeight}px`,
                border: isSelected ? "2px solid red" : "none",
                position: "absolute",
                left: block.data.x,
                top: block.data.y,
                cursor: "pointer"
              }}
              onClick={() => setSelectedBlockId(elementId)}
              ref={block.type === selectedBlock ? selectedElementRef : null}
            />
          );
        } else if (block.type === "Button") {
          element = (
            <button
              key={elementId}
              onFocus={() => handleFocus(block)}
              onKeyDown={(e) => handleKeyPress(e, block)}
              onDragStart={(e) => handleDragStart(e, block, elementId)}
              draggable
              style={{
                backgroundColor: "#0044C1",
                color: "white",
                minWidth: "77px",
                minHeight: "50px",
                fontSize: `${block.data.fontSize}px`,
                fontWeight: `${block.data.fontWeight}px`,
                border: isSelected ? "2px solid red" : "none",
                position: "absolute",
                left: block.data.x,
                top: block.data.y,
                cursor: "pointer",
                cursor: "pointer"
              }}
              onClick={() => setSelectedBlockId(elementId)}
              ref={block.type === selectedBlock ? selectedElementRef : null}
            >
              {block.data.text}
            </button>
          );
        }
        return element;
      })}
    </div>
  );
};

export default DropArea;
