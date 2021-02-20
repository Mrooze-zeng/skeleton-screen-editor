import { useCallback, useEffect, useState } from "react";
import { blockCreator } from "../utils";
import BlockLists from "./BlockLists";
import { RenderBlocks } from "./BlockWrapper";
import Canvas from "./Canvas";
import "./Playground.scss";
import { parseCodeToStyle } from "./RenderResult";
import Settings from "./Settings";

const Playground = function ({
  liveRender = false,
  canvasAttr = {},
  onBlockChange = function () {},
  onCanvasChange = function () {},
}) {
  const [blocks, setBlocks] = useState([]);
  const [currentBlockId, setCurrentBlockId] = useState();

  const _setBlocksAndListen = function (blocks = []) {
    setBlocks(blocks);
    liveRender && onBlockChange(blocks);
  };

  const _handleUpdateBlockById = function (id, newBlock = {}) {
    _setBlocksAndListen(
      blocks.map((block) => {
        if (block.id === id) {
          return { ...block, ...newBlock };
        }
        return block;
      })
    );
  };
  const _handleDrop = function (event) {
    event.preventDefault();
    event.stopPropagation();
    const { X, Y, type, size } = JSON.parse(
      event.dataTransfer.getData("block")
    );
    const canvasRect = event.target.getBoundingClientRect();

    const block = blockCreator({
      type,
      left: event.clientX - X - canvasRect.x,
      top: event.clientY - Y - canvasRect.y,
      ...size,
    });

    _setBlocksAndListen([...blocks, block]);
    setCurrentBlockId(block.id);
  };

  const _handleDragOver = function (event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  };

  const _handleMouseDown = function (event, canvasRef) {
    if (
      !currentBlockId ||
      (currentBlockId && event.target.id !== String(currentBlockId))
    ) {
      return;
    }
    event.stopPropagation();
    event.preventDefault();
    const blockRect = event.target.getBoundingClientRect();
    const canvasRect = canvasRef.current.getBoundingClientRect();

    const minusX = Math.abs(event.clientX - blockRect.x);
    const minusY = Math.abs(event.clientY - blockRect.y);

    const _move = (e) => {
      _handleUpdateBlockById(currentBlockId, {
        style: {
          left: e.clientX - minusX - canvasRect.x,
          top: e.clientY - minusY - canvasRect.y,
        },
      });
    };
    const _up = (e) => {
      document.removeEventListener("mousemove", _move);
      document.removeEventListener("mouseup", _up);
    };
    document.addEventListener("mousemove", _move);
    document.addEventListener("mouseup", _up);
  };

  const _getCurrentBlock = function (blocks = [], currentBlockId) {
    return blocks.find((block) => block.id === currentBlockId) || {};
  };

  //event listeners
  const _handleDeleteBlock = function (event) {
    event.stopPropagation();
    event.preventDefault();
    if (!currentBlockId) {
      return;
    }
    _setBlocksAndListen(blocks.filter((block) => block.id !== currentBlockId));
    setCurrentBlockId(
      blocks[blocks.length - 1] && blocks[blocks.length - 1]["id"]
    );
  };
  const _handleCopyBlock = function (event) {
    event.stopPropagation();
    event.preventDefault();
  };
  const _handlePasteBlock = function (event) {
    event.stopPropagation();
    event.preventDefault();
    const block = _getCurrentBlock(blocks, currentBlockId);
    if (!block.id) {
      return;
    }
    const newBlock = blockCreator({
      ...block,
      id: Date.now(),
      left: block.style.left + 10,
      top: block.style.top + 10,
    });
    setCurrentBlockId(newBlock.id);
    _setBlocksAndListen([...blocks, newBlock]);
  };

  useEffect(() => {
    document.addEventListener("delete-block", _handleDeleteBlock);
    document.addEventListener("copy-block", _handleCopyBlock);
    document.addEventListener("paste-block", _handlePasteBlock);
    return () => {
      document.removeEventListener("delete-block", _handleDeleteBlock);
      document.removeEventListener("copy-block", _handleCopyBlock);
      document.removeEventListener("paste-block", _handlePasteBlock);
    };
  });

  return (
    <>
      <Canvas
        onDrop={_handleDrop}
        onDragOver={_handleDragOver}
        onMouseDown={_handleMouseDown}
        {...canvasAttr}
      >
        <RenderBlocks
          blocks={blocks}
          currentBlockId={currentBlockId}
          onUpdateBlock={_setBlocksAndListen}
          onCurrentBlockChange={useCallback((block = {}) => {
            block && setCurrentBlockId(block.id);
          }, [])}
        />
      </Canvas>
      <div style={{ display: "flex" }}>
        <BlockLists />
        <div>
          <button
            onClick={() => {
              _setBlocksAndListen([]);
              setCurrentBlockId();
            }}
          >
            清空画板
          </button>
          <button onClick={() => onBlockChange(blocks)}>渲染</button>

          <button
            onClick={() => {
              let code = window.prompt("请填入样式代码") || "";
              code = code.replace(/\r|\n|\s{2}/g, "");
              code && _setBlocksAndListen(parseCodeToStyle(code));
            }}
          >
            导入样式代码
          </button>
        </div>

        <Settings
          currentBlock={_getCurrentBlock(blocks, currentBlockId)}
          canvasAttr={canvasAttr}
          onUpdateBlock={_handleUpdateBlockById}
          onCurrentBlockChange={useCallback((block = {}) => {
            setCurrentBlockId(block.id);
          }, [])}
          onUpdateCanvas={useCallback(
            (attrs) => {
              onCanvasChange(attrs);
            },
            [onCanvasChange]
          )}
        />
      </div>
    </>
  );
};

export default Playground;
