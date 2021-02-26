import { Children, cloneElement, useEffect, useRef } from "react";
import {
  blocksInCanvasActiveArea,
  canvasDrawActiveLine,
  redrawBackground,
  serializeWidthAndHeightOnStyle,
} from "../utils";

const Canvas = function ({
  children,
  width = 450,
  height = 350,
  image = null,
  blocks = {},
  onUpdateBlock = function () {},
  onDrop = function () {},
  onDragOver = function () {},
  onMouseDown = function () {},
}) {
  const canvasRef = useRef();
  useEffect(() => {
    redrawBackground(canvasRef.current, image, width, height);
  }, [height, image, width]);
  useEffect(() => {
    canvasRef.current.image = image;
  }, [image]);

  const CanvasChildren = function ({ children }) {
    return Children.map(children, (child) => {
      return cloneElement(child, {
        canvas: canvasRef.current,
        blocks: blocks,
      });
    });
  };
  const _handleDragOver = function (event) {
    event.target.style.zIndex = 2;
    onDragOver(event);
  };
  const _handleDrop = function (event) {
    event.target.style.zIndex = 0;
    onDrop(event);
  };
  const _handleDragLeave = function (event) {
    event.target.style.zIndex = 0;
  };
  const _handleMouseMove = function (event) {
    event.stopPropagation();
    event.preventDefault();
    event.target.style.zIndex = 2;

    const canvasRect = event.target.getBoundingClientRect();
    const pointStart = {
      x: event.clientX - canvasRect.x,
      y: event.clientY - canvasRect.y,
    };
    let activeBlockIds = [];

    const _move = function (e) {
      let movePoint = {
        x: e.clientX - canvasRect.x,
        y: e.clientY - canvasRect.y,
      };
      canvasDrawActiveLine(event.target, pointStart, movePoint);
      activeBlockIds = blocksInCanvasActiveArea(blocks, {
        left: Math.min(pointStart.x, movePoint.x),
        top: Math.min(pointStart.y, movePoint.y),
        right: Math.max(pointStart.x, movePoint.x),
        bottom: Math.max(pointStart.y, movePoint.y),
      });
    };
    const _up = (e) => {
      event.target.removeEventListener("mousemove", _move);
      event.target.removeEventListener("mouseup", _up);
      event.target.style.zIndex = 0;
      redrawBackground(event.target);
      onUpdateBlock(blocks, activeBlockIds);
    };
    event.target.addEventListener("mousemove", _move);
    event.target.addEventListener("mouseup", _up);
  };
  return (
    <div
      className="playground-canvas"
      style={serializeWidthAndHeightOnStyle({ width: width, height: height })}
    >
      <canvas
        width={width}
        height={height}
        onDrop={_handleDrop}
        onDragOver={_handleDragOver}
        onDragLeave={_handleDragLeave}
        onMouseDown={_handleMouseMove}
        ref={canvasRef}
      />
      <div onMouseDown={(event) => onMouseDown(event, canvasRef)}>
        <CanvasChildren children={children} />
      </div>
    </div>
  );
};

export default Canvas;
