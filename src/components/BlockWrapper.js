import { useEffect, useState } from "react";
import {
  blockCreator,
  blockShortCutKeyMap,
  redrawBackground,
} from "../utils/index";
import { getBlockByType } from "./Block";

const BlockWrapper = function ({
  block = {},
  blocks = [],
  children = "",
  canvas = "",
  setCurrentBlock = function () {},
  removeBlock = function () {},
  addBlock = function () {},
}) {
  const { id = "", style = {}, type = "", size = {}, isActive = false } = block;
  const [Block] = getBlockByType(type);
  const _handleClick = function (event) {
    event.preventDefault();
    event.stopPropagation();
    if (event.metaKey && !isActive) {
      return setCurrentBlock([{ id, isActive: true }]);
    }
    setCurrentBlock([{ id, isActive: !isActive }], true);
  };

  const _handleKeyDown = function (event) {
    if (
      isActive &&
      (event.target.getAttribute("type") === "block" ||
        event.target === document.body)
    ) {
      const _shortcutHandler =
        blockShortCutKeyMap(event, {
          canvas: canvas,
          remove: removeBlock,
          add: addBlock,
          update: setCurrentBlock,
        })[event.code] || function () {};
      _shortcutHandler([...blocks]);
    }
  };

  const _handleKeyUp = function (event) {
    if (
      (isActive &&
        (event.target.getAttribute("type") === "block" ||
          event.target === document.body) &&
        (event.code === "ArrowUp" ||
          event.code === "ArrowRight" ||
          event.code === "ArrowDown")) ||
      event.code === "ArrowLeft"
    ) {
      redrawBackground(canvas);
      event.preventDefault();
      event.stopPropagation();
    }
  };

  useEffect(() => {
    if (isActive) {
      window.addEventListener("keydown", _handleKeyDown, false);
      window.addEventListener("keyup", _handleKeyUp, false);
      return () => {
        window.removeEventListener("keydown", _handleKeyDown, false);
        window.removeEventListener("keyup", _handleKeyUp, false);
      };
    }
  });
  useEffect(() => {
    isActive && document.getElementById(id).focus();
  });
  return (
    <Block
      id={id}
      style={{ ...style, position: "absolute", opacity: 0.9 }}
      size={size}
      tabIndex={isActive ? 1 : -1}
      isactive={isActive ? isActive.toString() : undefined}
      onClick={_handleClick}
    >
      {children}
    </Block>
  );
};

const BlockActiveLine = function ({
  block = {},
  position = "left",
  canvas = {},
  isActive = false,
  onLineMove = function () {},
  activeStyle = function () {},
}) {
  const [isLineActive, setIsLineActive] = useState(false);
  const _handleMouseDown = function (event) {
    if (!isActive) {
      return;
    }
    event.stopPropagation();
    event.preventDefault();
    const lineRect = event.target.getBoundingClientRect();

    const newPosition = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    };
    const _move = function (e) {
      if (position === "left" || position === "right") {
        newPosition[position] = e.clientX - lineRect.x;
      } else if (position === "top" || position === "bottom") {
        newPosition[position] = e.clientY - lineRect.y;
      }
      onLineMove(block, newPosition, position);
    };
    const _up = function () {
      document.removeEventListener("mousemove", _move, false);
      document.removeEventListener("mouseup", _up, false);
      //以下代码被注释:用dom 替代canvas绘画规划线
      //   redrawBackground(canvas);
    };
    document.addEventListener("mousemove", _move, false);
    document.addEventListener("mouseup", _up, false);
  };
  return (
    <i
      className={`block-wrapper-${position}`}
      onMouseDown={_handleMouseDown}
      onMouseOver={() => setIsLineActive(true)}
      onMouseOut={() => setIsLineActive(false)}
      style={isLineActive ? activeStyle(canvas, block.style) : {}}
    ></i>
  );
};

const RenderBlocks = function ({
  blocks = [],
  children = "",
  canvas = "",
  onUpdateBlock = function () {},
}) {
  const lines = [
    [
      "top",
      function (canvas = {}, { left = 0 }) {
        return {
          left: `${-left}px`,
          width: `${canvas.width}px`,
        };
      },
    ],
    [
      "right",
      function (canvas = {}, { top = 0 }) {
        return {
          top: `${-top}px`,
          height: `${canvas.height}px`,
        };
      },
    ],
    [
      "bottom",
      function (canvas = {}, { left = 0 }) {
        return {
          left: `${-left}px`,
          width: `${canvas.width}px`,
        };
      },
    ],
    [
      "left",
      function (canvas = {}, { top = 0 }) {
        return {
          top: `${-top}px`,
          height: `${canvas.height}px`,
        };
      },
    ],
  ];

  const _handleUpdateBlock = function (blockItems = [], isResetActive = false) {
    const activeBlockIds = [];
    const newBlocks = blocks.map((block) => {
      let item = blockItems.find((item) => item.id === block.id) || {};
      if (isResetActive) {
        block.isActive = false;
      }
      block = { ...block, ...item };
      if (block.isActive) {
        activeBlockIds.push(block.id);
      }
      return { ...block, ...item };
    });
    onUpdateBlock(newBlocks, activeBlockIds);
  };
  const _handleRemoveBlock = function (selectedIds = []) {
    onUpdateBlock(
      blocks.filter((block) => selectedIds.indexOf(block.id) === -1)
    );
  };
  const _handleAddBlock = function (newBlocks = [], isResetActive = false) {
    const activeIds = [];
    blocks.forEach((block) => {
      if (block.isActive) {
        !isResetActive && activeIds.push(block.id);
      }
    });
    newBlocks.forEach((block) => activeIds.push(block.id));
    onUpdateBlock([...blocks, ...newBlocks], activeIds);
  };

  const _handleLineMove = function (
    currentBlock = {},
    { left = 0, right = 0, top = 0, bottom = 0 },
    position
  ) {
    const [newBlock] = blockCreator(
      {
        ...currentBlock,
        ...currentBlock.size,
        ...currentBlock.style,
      },
      { canvas: canvas }
    );

    if (currentBlock.type === "square") {
      switch (position) {
        case "top":
          newBlock.size.height = currentBlock.size.height - top;
          newBlock.style.top = top + currentBlock.style.top;
          break;
        case "right":
          newBlock.size.width = right + currentBlock.size.width;
          break;
        case "bottom":
          newBlock.size.height = bottom + currentBlock.size.height;
          break;
        case "left":
          newBlock.size.width = currentBlock.size.width - left;
          newBlock.style.left = left + currentBlock.style.left;
          break;
        default:
          break;
      }
    } else if (currentBlock.type === "circle") {
      let minus = top || right || bottom || left;

      switch (position) {
        case "left":
        case "top":
          minus *= -1;
          break;
        default:
          minus *= 1;
          break;
      }
      newBlock.style.top = currentBlock.style.top - minus;
      newBlock.style.left = currentBlock.style.left - minus;
      newBlock.size.radius = currentBlock.size.radius + minus;

      newBlock.size.width = newBlock.size.radius * 2;
      newBlock.size.height = newBlock.size.radius * 2;
    }

    if (
      newBlock.size.width <= 10 ||
      newBlock.size.height <= 10 ||
      newBlock.style.left + newBlock.size.width > canvas.width ||
      newBlock.style.top + newBlock.size.height > canvas.height ||
      //限定圆不能出画布边界
      newBlock.style.left < 0 ||
      newBlock.style.top < 0
    ) {
      return;
    }
    //以下代码被注释:用dom 替代canvas绘画规划线
    // drawGuideline(canvas, { ...newBlock.size, ...newBlock.style }, position);

    newBlock.isActive = true;

    _handleUpdateBlock([newBlock], true);
  };

  return blocks.map((block, index) => (
    <BlockWrapper
      key={index}
      canvas={canvas}
      isActive={block.isActive}
      addBlock={_handleAddBlock}
      setCurrentBlock={_handleUpdateBlock}
      removeBlock={_handleRemoveBlock}
      block={block}
      blocks={blocks}
    >
      {lines.map(([line, activeStyle]) => {
        return (
          <BlockActiveLine
            canvas={canvas}
            key={line}
            block={block}
            position={line}
            isActive={block.isActive}
            activeStyle={activeStyle}
            onLineMove={_handleLineMove}
          />
        );
      })}
    </BlockWrapper>
  ));
};

export { RenderBlocks };
