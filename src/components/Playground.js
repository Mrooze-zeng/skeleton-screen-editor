import { useCallback, useState } from "react";
import { blockCreator, throttle } from "../utils";
import BlockLists from "./BlockLists";
import { RenderBlocks } from "./BlockWrapper";
import Canvas from "./Canvas";
import "./Playground.scss";
import { parseCodeToStyle } from "./RenderResult";
import Settings from "./Settings";

const _blockChangeThrottle = throttle();

const Playground = function ({
  liveRender = false,
  canvasAttr = {},
  onBlockChange = function () {},
  onCanvasChange = function () {},
}) {
  const [blocks, setBlocks] = useState([]);

  const _setBlocksAndListen = function (blocks = [], id = "") {
    blocks = blocks.map((block) => {
      if (block.isActive) {
        block.isActive = false;
      }
      if (block.id === id) {
        block.isActive = true;
      }
      return block;
    });
    setBlocks(blocks);
    liveRender &&
      _blockChangeThrottle(function (data) {
        onBlockChange(data);
      }, blocks);
  };

  const _handleUpdateBlockById = function (id, newBlock = {}) {
    _setBlocksAndListen(
      blocks.map((block) => {
        if (block.id === id) {
          return { ...block, ...newBlock };
        }
        return block;
      }),
      id
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
      isActive: true,
      left: event.clientX - X - canvasRect.x,
      top: event.clientY - Y - canvasRect.y,
      ...size,
    });
    _setBlocksAndListen([...blocks, block], block.id);
  };

  const _handleDragOver = function (event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  };

  const _calculateBoundary = function ({
    x = 0,
    y = 0,
    blockRect,
    canvasRect,
  }) {
    return (
      x < 0 ||
      y < 0 ||
      x + blockRect.width > canvasRect.width ||
      y + blockRect.height > canvasRect.height
    );
  };

  const _handleMouseDown = function (event, canvasRef) {
    event.stopPropagation();
    event.preventDefault();
    const currentBlock = _getCurrentBlock(blocks);
    if (
      !currentBlock.id ||
      (currentBlock.id && event.target.id !== String(currentBlock.id))
    ) {
      return;
    }

    const blockRect = event.target.getBoundingClientRect();
    const canvasRect = canvasRef.current.getBoundingClientRect();

    const minusX = Math.abs(event.clientX - blockRect.x);
    const minusY = Math.abs(event.clientY - blockRect.y);

    const _move = (e) => {
      let x = e.clientX - minusX - canvasRect.x;
      let y = e.clientY - minusY - canvasRect.y;

      if (_calculateBoundary({ x, y, blockRect, canvasRect })) {
        return;
      }
      _handleUpdateBlockById(currentBlock.id, {
        style: {
          left: x,
          top: y,
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

  const _getCurrentBlock = function (blocks = []) {
    return blocks.find((block) => block.isActive) || {};
  };

  console.log("blocks:", blocks);

  return (
    <>
      <Canvas
        onDrop={_handleDrop}
        onDragOver={_handleDragOver}
        onMouseDown={_handleMouseDown}
        {...canvasAttr}
      >
        <RenderBlocks blocks={blocks} onUpdateBlock={_setBlocksAndListen} />
      </Canvas>
      <div style={{ display: "flex" }}>
        <BlockLists />
        <div>
          <button
            onClick={() => {
              _setBlocksAndListen([]);
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
          blocks={blocks}
          canvasAttr={canvasAttr}
          onUpdateBlock={_handleUpdateBlockById}
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
