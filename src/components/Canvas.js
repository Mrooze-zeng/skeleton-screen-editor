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
        <CanvasChildren children={children} />
      </div>
    </div>
  );
};

export default Canvas;
