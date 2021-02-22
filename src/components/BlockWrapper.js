import { useEffect } from "react";
import {
  blockCreator,
  blockShortCutKeyMap,
  drawGuideline,
  redrawBackground,
} from "../utils/index";
import { getBlockByType } from "./BlockLists";

const BlockWrapper = function ({
  block = {},
  children = "",
  canvas = "",
  setCurrentBlock = function () {},
  removeBlock = function () {},
  addBlock = function () {},
}) {
  const { id = "", style = {}, type = "", size = {}, isActive = false } = block;
  const Block = getBlockByType(type);
  const _handleClick = function (event) {
    event.preventDefault();
    event.stopPropagation();
    !isActive && setCurrentBlock(id);
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
      _shortcutHandler(block);
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
  position = "left",
  canvas = {},
  isActive = false,
  onLineMove = function () {},
}) {
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
      onLineMove(newPosition, position);
    };
    const _up = function () {
      document.removeEventListener("mousemove", _move, false);
      document.removeEventListener("mouseup", _up, false);
      redrawBackground(canvas);
    };
    document.addEventListener("mousemove", _move, false);
    document.addEventListener("mouseup", _up, false);
  };
  return (
    <i
      className={`block-wrapper-${position}`}
      onMouseDown={_handleMouseDown}
    ></i>
  );
};

const RenderBlocks = function ({
  blocks = [],
  children = "",
  canvas = "",
  onUpdateBlock = function () {},
}) {
  const lines = ["top", "right", "bottom", "left"];

  const _handleUpdateBlock = function (id = "", newBlock = {}) {
    onUpdateBlock(
      blocks.map((block) => {
        if (block.id === id) {
          return { ...block, ...newBlock };
        }
        return block;
      }),
      id
    );
  };
  const _handleRemoveBlock = function (id = "") {
    onUpdateBlock(blocks.filter((block) => block.id !== id));
  };
  const _handleAddBlock = function (block = {}) {
    onUpdateBlock([...blocks, block], block.id);
  };

  const _handleLineMove = function (
    { left = 0, right = 0, top = 0, bottom = 0 },
    position
  ) {
    const currentBlock = blocks.find((block) => block.isActive);
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

    drawGuideline(canvas, { ...newBlock.size, ...newBlock.style }, position);

    _handleUpdateBlock(currentBlock.id, newBlock);
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
    >
      {lines.map((line) => {
        return (
          <BlockActiveLine
            canvas={canvas}
            key={line}
            position={line}
            isActive={block.isActive}
            onLineMove={_handleLineMove}
          />
        );
      })}
    </BlockWrapper>
  ));
};

export { RenderBlocks };
