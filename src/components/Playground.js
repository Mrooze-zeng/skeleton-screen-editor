import { useCallback, useEffect, useState } from "react";
import BlockLists from "./BlockLists";
import { RenderBlocks } from "./BlockWrapper";
import Canvas from "./Canvas";
import "./Playground.scss";
import Settings from "./Settings";

const Playground = function ({
  onBlockChange = function () {},
  onCanvasChange = function () {},
}) {
  const [blocks, setBlocks] = useState([]);
  const [currentBlock, setCurrentBlock] = useState({});
  const [canvasAttr, setCanvasAttr] = useState({
    width: 450,
    height: 350,
  });

  const handleUpdateBlockById = function (id, newBlock = {}) {
    setBlocks(
      blocks.map((block) => {
        if (block.id === id) {
          return newBlock;
        }
        return block;
      })
    );
  };
  const handleDrop = function (event) {
    event.preventDefault();
    event.stopPropagation();
    const { X, Y, type, size } = JSON.parse(
      event.dataTransfer.getData("block")
    );
    const canvasRect = event.target.getBoundingClientRect();

    const block = {
      id: Date.now(),
      type: type,
      style: {
        left: event.clientX - X - canvasRect.x,
        top: event.clientY - Y - canvasRect.y,
        position: "absolute",
      },
      size,
    };
    setBlocks([...blocks, block]);
    setCurrentBlock(block);
  };

  const handleDragOver = function (event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  };

  const handleMouseDown = function (event, canvasRef) {
    if (!currentBlock || (currentBlock && !currentBlock.id)) {
      event.preventDefault();
      return;
    }
    const blockRect = event.target.getBoundingClientRect();
    const canvasRect = canvasRef.current.getBoundingClientRect();

    const minusX = Math.abs(event.clientX - blockRect.x);
    const minusY = Math.abs(event.clientY - blockRect.y);

    const move = (e) => {
      handleUpdateBlockById(currentBlock.id, {
        ...currentBlock,
        style: {
          left: e.clientX - minusX - canvasRect.x,
          top: e.clientY - minusY - canvasRect.y,
          position: "absolute",
        },
      });
    };
    const up = (e) => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  };

  useEffect(() => {
    onBlockChange(blocks);
    onCanvasChange(canvasAttr);
  });

  return (
    <>
      <Canvas
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onMouseDown={handleMouseDown}
        {...canvasAttr}
      >
        <RenderBlocks
          blocks={blocks}
          currentBlock={currentBlock}
          onUpdateBlock={setBlocks}
          onCurrentBlockChange={useCallback((block) => {
            setCurrentBlock(block);
          }, [])}
        />
      </Canvas>
      <div style={{ display: "flex" }}>
        <BlockLists />
        <div>
          <button onClick={() => setBlocks([])}>ClearBlocks</button>
        </div>

        <Settings
          currentBlock={currentBlock}
          canvasAttr={canvasAttr}
          onUpdateBlock={handleUpdateBlockById}
          onCurrentBlockChange={useCallback((block) => {
            setCurrentBlock(block);
          }, [])}
          onUpdateCanvas={useCallback((attrs) => {
            setCanvasAttr(attrs);
            console.log(attrs);
          }, [])}
        />
      </div>
    </>
  );
};

export default Playground;
