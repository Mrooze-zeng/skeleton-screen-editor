import { useCallback, useState } from "react";
import "./App.scss";
import Playground from "./components/Playground";
import RenderResult from "./components/RenderResult";

function App() {
  const [blocks, setBlocks] = useState([]);
  const [canvasAttr, setCanvasAttr] = useState({
    width: window.innerWidth,
    height: window.innerHeight / 2,
  });
  console.log("-----", blocks, canvasAttr);
  return (
    <>
      <Playground
        liveRender={true}
        canvasAttr={canvasAttr}
        onBlockChange={useCallback((block) => setBlocks(block), [])}
        onCanvasChange={useCallback((attrs) => setCanvasAttr(attrs), [])}
      ></Playground>

      <hr />
      <h1>Output:</h1>
      <RenderResult blocks={blocks} {...canvasAttr} />
    </>
  );
}

export default App;
