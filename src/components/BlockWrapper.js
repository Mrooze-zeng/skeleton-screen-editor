import { useEffect } from "react";
import { getBlockByType } from "./BlockLists";

const BlockWrapper = function ({
  id = "",
  style = {},
  children = "",
  type = "",
  size = {},
  isActive = false,
  onRemoveBlock = function () {},
  setCurrentBlock = function () {},
}) {
  const Block = getBlockByType(type);
  const _handleClick = function (event) {
    setCurrentBlock(!isActive && id);
  };
  return (
    <Block
      id={id}
      style={{ ...style, position: "absolute", opacity: 0.9 }}
      size={size}
      isactive={isActive ? isActive.toString() : undefined}
      onDoubleClick={() => onRemoveBlock(id)}
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
  currentBlock = {},
  children = "",
  canvas = "",
  onUpdateBlock = function () {},
  onCurrentBlockChange = function () {},
}) {
  const lines = ["top", "right", "bottom", "left"];

  const _handleRemoveBlock = function (id = "") {
    onUpdateBlock(blocks.filter((block) => block.id !== id));
  };
  const _handleUpdateBlock = function (id = "", newBlock = {}) {
    onUpdateBlock(
      blocks.map((block) => {
        if (block.id === id) {
          return newBlock;
        }
        return block;
      })
    );
  };
  const _handleSetCurrentBlock = function (id = "") {
    onCurrentBlockChange(blocks.filter((block) => block.id === id)[0]);
  };
  const _handleLineMove = function (
    { left = 0, right = 0, top = 0, bottom = 0 },
    position
  ) {
    const newBlock = {
      id: currentBlock.id,
      type: currentBlock.type,
      size: {
        color: currentBlock.size.color,
        width: currentBlock.size.width,
        height: currentBlock.size.height,
        radius: currentBlock.size.radius,
      },
      style: { left: currentBlock.style.left, top: currentBlock.style.top },
    };
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
      switch (position) {
        case "top":
          newBlock.size.radius = currentBlock.size.radius - top;
          newBlock.style.top = top + currentBlock.style.top;
          break;
        case "right":
          newBlock.size.radius = right + currentBlock.size.radius;
          break;
        case "bottom":
          newBlock.size.radius = bottom + currentBlock.size.radius;
          break;
        case "left":
          newBlock.size.radius = currentBlock.size.radius - left;
          newBlock.style.left = left + currentBlock.style.left;
          break;
        default:
          break;
      }
      newBlock.size.width = newBlock.size.radius * 2;
      newBlock.size.height = newBlock.size.radius * 2;
    }
    _handleUpdateBlock(currentBlock.id, newBlock);
  };
  useEffect(() => {
    _handleSetCurrentBlock(currentBlock.id);
  });
  return blocks.map((block, index) => (
    <BlockWrapper
      key={index}
      isActive={currentBlock.id === block.id}
      onRemoveBlock={_handleRemoveBlock}
      setCurrentBlock={_handleSetCurrentBlock}
      {...block}
    >
      {lines.map((line) => {
        return (
          <BlockActiveLine
            key={line}
            position={line}
            isActive={currentBlock.id === block.id}
            onLineMove={_handleLineMove}
          />
        );
      })}
    </BlockWrapper>
  ));
};

export { RenderBlocks };

export default BlockWrapper;
