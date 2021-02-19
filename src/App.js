import { useCallback, useState } from "react";
import "./App.scss";
import Playground from "./components/Playground";
import RenderResult from "./components/RenderResult";

function App() {
  const [blocks, setBlocks] = useState([]);
  return (
    <>
      <div style={{ display: "flex" }}>
        <Playground
          onBlockChange={useCallback((block) => setBlocks(block), [])}
        ></Playground>
      </div>

      <hr />
      <h1>Output:</h1>
      <RenderResult blocks={blocks} />
    </>
  );
}

export default App;
