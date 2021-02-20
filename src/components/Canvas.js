import { Children, cloneElement, useEffect, useRef } from "react";
import { drawGrid, drawImage, serializeWidthAndHeightOnStyle } from "../utils";

const Canvas = function ({
  children,
  width = 450,
  height = 350,
  image = null,
  onDrop = function () {},
  onDragOver = function () {},
  onMouseDown = function () {},
}) {
  const canvasRef = useRef();
  useEffect(() => {
    drawImage(canvasRef.current, image, width, height);
    drawGrid(canvasRef.current);
  });
  const CanvasChildren = function ({ children, canvasRef }) {
    return Children.map(children, (child) => {
      return cloneElement(child, {
        canvas: canvasRef.current,
      });
    });
  };
  return (
    <div
      className="playground-canvas"
      style={serializeWidthAndHeightOnStyle({ width: width, height: height })}
    >
      <canvas
        width={width}
        height={height}
        onDrop={onDrop}
        onDragOver={onDragOver}
        ref={canvasRef}
      />
      <div onMouseDown={(event) => onMouseDown(event, canvasRef)}>
        {/* {children} */}
        <CanvasChildren children={children} canvasRef={canvasRef} />
      </div>
    </div>
  );
};

export default Canvas;
