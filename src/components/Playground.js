import { useCallback, useState } from "react";
import { blockCreator, throttle } from "../utils";
import BlockLists, { getBlockByType, presets } from "./Block";
import { RenderBlocks } from "./BlockWrapper";
import ButtonGroup from "./ButtonGroup";
import Canvas from "./Canvas";
import Note from "./Note";
import "./Playground.scss";
import Settings from "./Settings";

const _blockChangeThrottle = throttle();

const Playground = function ({
  liveRender = false,
  canvasAttr = {},
  onBlockChange = function () {},
  onCanvasChange = function () {},
}) {
  const [blocks, setBlocks] = useState([]);

  const _setBlocksAndListen = function (blocks = [], activeIds = []) {
    blocks = blocks.map((block) => {
      block.isActive = activeIds.indexOf(block.id) >= 0;
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
      [id]
    );
  };
  const _handleDrop = function (event) {
    event.preventDefault();
    event.stopPropagation();
    const { X, Y, type } = JSON.parse(event.dataTransfer.getData("block"));

    const canvasRect = event.target.getBoundingClientRect();

    const { size, items = [] } = getBlockByType(type)[1];

    if (items.length > 0) {
      let blockItems = [];
      let blockItemIds = [];
      items.forEach((item) => {
        console.log(item.size);
        const [block] = blockCreator(
          {
            type: item.type,
            isActive: true,
            left:
              parseInt(event.clientX - X - canvasRect.x) +
              (item?.style?.left || 0),
            top:
              parseInt(event.clientY - Y - canvasRect.y) +
              (item?.style?.top || 0),
            ...item.size,
          },
          { canvas: event.target }
        );
        blockItems.push(block);
        blockItemIds.push(block.id);
      });
      _setBlocksAndListen([...blocks, ...blockItems], [...blockItemIds]);
    } else {
      const [block] = blockCreator(
        {
          type,
          isActive: true,
          left: parseInt(event.clientX - X - canvasRect.x),
          top: parseInt(event.clientY - Y - canvasRect.y),
          ...size,
        },
        { canvas: event.target }
      );
      _setBlocksAndListen([...blocks, block], [block.id]);
    }
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
    const currentBlock = _getCurrentBlock(blocks, event.target.id);
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
      //todo 支持block group 移动；
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

  const _getCurrentBlock = function (blocks = [], id = "") {
    return blocks.find((block) => block.id === Number(id)) || {};
  };

  //   console.log("blocks:", blocks, JSON.stringify(blocks));

  return (
    <>
      <div style={{ border: "1px solid lightgray" }}>
        <h2>可拖拽预设:</h2>
        <div
          style={{ padding: 15, backgroundColor: "green" }}
          className="presets-box"
        >
          <BlockLists blocks={presets} draggable={true} />
        </div>
      </div>
      <Canvas
        onDrop={_handleDrop}
        onDragOver={_handleDragOver}
        onMouseDown={_handleMouseDown}
        blocks={blocks}
        onUpdateBlock={_setBlocksAndListen}
        {...canvasAttr}
      >
        <RenderBlocks onUpdateBlock={_setBlocksAndListen} />
      </Canvas>
      <div style={{ display: "flex", minHeight: 250 }}>
        <ButtonGroup
          onCanvasChange={onCanvasChange}
          onBlockChange={onBlockChange}
          setBlocks={_setBlocksAndListen}
          blocks={blocks}
          canvasAttr={canvasAttr}
        />
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
        <Note />
      </div>
    </>
  );
};

export default Playground;
