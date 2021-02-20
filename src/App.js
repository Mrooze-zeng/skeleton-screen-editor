import { useCallback, useState } from "react";
import "./App.scss";
import Playground from "./components/Playground";
import RenderResult from "./components/RenderResult";
import { listenGlobalKeyDown } from "./utils";

listenGlobalKeyDown();

function App() {
  const [blocks, setBlocks] = useState([]);
  const [canvasAttr, setCanvasAttr] = useState({
    width: 450,
    height: 350,
  });
  console.log("-----");
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
