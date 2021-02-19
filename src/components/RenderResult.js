import Canvas from "./Canvas";
import "./RenderResult.scss";

const generateStyles = function (blocks = [], width = 450, height = 350) {
  let styles = {};
  let backgroundImages = [];
  let backgroundPositions = [];
  let backgroundSizes = [];
  const imageMap = new Map([
    ["square", `linear-gradient( lightgray 100%, transparent 0 )`],
    [
      "circle",
      `radial-gradient( circle 50px at 50px 50px, lightgray 100%, transparent 0 )`,
    ],
  ]);
  blocks.forEach((block) => {
    backgroundImages.push(imageMap.get(block.type));
    backgroundPositions.push(`${block.style.left}px ${block.style.top}px`);
    backgroundSizes.push(
      `${block.size.width + "px" || "100%"} ${
        block.size.height + "px" || "100%"
      }`
    );
  });
  styles["backgroundImage"] = backgroundImages.join(",");
  styles["backgroundPosition"] = backgroundPositions.join(",");
  styles["backgroundSize"] = backgroundSizes.join(",");
  styles["width"] = width;
  styles["height"] = height;
  return styles;
};

const RenderResult = function ({ blocks = [], width = 450, height = 350 }) {
  const styles = generateStyles(blocks, width, height);
  return (
    <Canvas>
      <div className="result-render" style={styles}></div>
    </Canvas>
  );
};

export default RenderResult;
