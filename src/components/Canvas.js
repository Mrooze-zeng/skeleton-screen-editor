import { Children, cloneElement, useEffect, useRef } from "react";
import { redrawBackground, serializeWidthAndHeightOnStyle } from "../utils";

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
    redrawBackground(canvasRef.current, image, width, height);
  }, [height, image, width]);
  useEffect(() => {
    canvasRef.current.image = image;
  }, [image]);

  const CanvasChildren = function ({ children }) {
    return Children.map(children, (child) => {
      return cloneElement(child, {
        canvas: canvasRef.current,
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
        ref={canvasRef}
      />
      <div onMouseDown={(event) => onMouseDown(event, canvasRef)}>
        <CanvasChildren children={children} />
      </div>
    </div>
  );
};

export default Canvas;
