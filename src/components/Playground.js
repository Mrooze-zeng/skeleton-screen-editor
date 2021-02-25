import { useCallback, useState } from "react";
import {
  blockCreator,
  blockGroupBoundaryMin,
  calculateBlockGroupHeight,
  throttle,
} from "../utils";
import BlockLists, { getBlockByType, presets } from "./Block";
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

  const _getCurrentBlock = function (blocks = []) {
    return blocks.find((block) => block.isActive) || {};
  };

  console.log("blocks:", blocks, JSON.stringify(blocks));

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
        {...canvasAttr}
      >
        <RenderBlocks blocks={blocks} onUpdateBlock={_setBlocksAndListen} />
      </Canvas>
      <div style={{ display: "flex", minHeight: 250 }}>
        <div className="button-group">
          <button
            onClick={() => {
              onCanvasChange({
                ...canvasAttr,
                height: window.innerHeight / 2,
              });
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
              if (code) {
                let codeBlocks = parseCodeToStyle(code);
                let blockIds = [];
                codeBlocks.forEach((block) => {
                  blockIds.push(block.id);
                });
                _setBlocksAndListen([...codeBlocks], blockIds);
              }
            }}
          >
            导入样式代码
          </button>
          <button
            onClick={() => {
              let code = window.prompt("请填入样式代码") || "";
              code = code.replace(/\r|\n|\s{2}/g, "");
              if (code) {
                let codeBlocks = parseCodeToStyle(code);
                let blockIds = [];
                codeBlocks.forEach((block) => {
                  blockIds.push(block.id);
                });
                const extraHeight = calculateBlockGroupHeight(blocks, 15);
                const min = blockGroupBoundaryMin(codeBlocks, "top", true)[1];
                codeBlocks = codeBlocks.map((block) => {
                  block.style.top += extraHeight - min;
                  return block;
                });
                onCanvasChange({
                  ...canvasAttr,
                  height: calculateBlockGroupHeight(
                    [...blocks, ...codeBlocks],
                    15
                  ),
                });
                _setBlocksAndListen([...blocks, ...codeBlocks], blockIds);
              }
            }}
          >
            添加样式块
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
        <ul>
          <h3>快捷键:</h3>
          <li>Delete: 删除</li>
          <li>Command+V: 复制选中的块</li>
          <li>ArrowUp|ArrowDown|ArrowLeft|ArrowRight:上下左右移动</li>
          <li>Command+左击: 多项选择|多项取消选择</li>
        </ul>
      </div>
    </>
  );
};

export default Playground;
