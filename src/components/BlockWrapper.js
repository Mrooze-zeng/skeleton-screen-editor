import { useEffect } from "react";
import { blockCreator } from "../utils/index";
import { getBlockByType } from "./BlockLists";

const BlockWrapper = function ({
  id = "",
  style = {},
  children = "",
  type = "",
  size = {},
  isActive = false,
  setCurrentBlock = function () {},
  removeBlock = function () {},
  addBlock = function () {},
}) {
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
      if (event.keyCode === 8) {
        event.preventDefault();
        event.stopPropagation();
        //delete
        removeBlock(id);
      } else if (event.keyCode === 67 && event.metaKey) {
        event.preventDefault();
        event.stopPropagation();
        //copy
        console.log("copy");
      } else if (event.keyCode === 86 && event.metaKey) {
        event.preventDefault();
        event.stopPropagation();
        //paste
        const newBlock = blockCreator({
          type,
          isActive: true,
          id: Date.now(),
          left: style.left + 10,
          top: style.top + 10,
          ...size,
        });
        addBlock(newBlock, newBlock.id);
      }
    }
  };
  useEffect(() => {
    if (isActive) {
      window.addEventListener("keydown", _handleKeyDown, false);
      return () => {
        window.removeEventListener("keydown", _handleKeyDown, false);
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
    const newBlock = blockCreator({
      ...currentBlock,
      ...currentBlock.size,
      ...currentBlock.style,
    });

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
      newBlock.style.top + newBlock.size.height > canvas.height
    ) {
      return;
    }

    _handleUpdateBlock(currentBlock.id, newBlock);
  };

  return blocks.map((block, index) => (
    <BlockWrapper
      key={index}
      isActive={block.isActive}
      addBlock={_handleAddBlock}
      setCurrentBlock={_handleUpdateBlock}
      removeBlock={_handleRemoveBlock}
      {...block}
    >
      {lines.map((line) => {
        return (
          <BlockActiveLine
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

export default BlockWrapper;
