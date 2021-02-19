import { useEffect, useRef } from "react";
import { drawGrid } from "../utils";

const Canvas = function ({
  children,
  width = 450,
  height = 350,
  onDrop = function () {},
  onDragOver = function () {},
  onMouseDown = function () {},
}) {
  const canvasRef = useRef();
  useEffect(() => {
    drawGrid(canvasRef.current);
  });
  return (
    <div className="playground-canvas">
      <canvas
        width={width}
        height={height}
        onDrop={onDrop}
        onDragOver={onDragOver}
        ref={canvasRef}
      />
      <div onMouseDown={(event) => onMouseDown(event, canvasRef)}>
        {children}
      </div>
    </div>
  );
};

export default Canvas;
