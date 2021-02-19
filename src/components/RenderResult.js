import Canvas from "./Canvas";
import "./RenderResult.scss";

const parseCode = function (images = [], sizes = [], positions = []) {
  let codes = [];
  images.forEach((image, i) => {
    codes.push(`(${image},${sizes[i]},${positions[i]})`);
  });
  return codes.length ? `(${codes.join(",")});` : "";
};

const generateStyles = function (blocks = [], width = 450, height = 350) {
  let styles = {};
  let backgroundImages = [];
  let backgroundPositions = [];
  let backgroundSizes = [];
  const imageMap = new Map([
    ["square", () => `linear-gradient( lightgray 100%, transparent 0 )`],
    [
      "circle",
      ({ radius = 50 }) =>
        `radial-gradient( circle ${radius}px at ${radius}px ${radius}px, lightgray 100%, transparent 0 )`,
    ],
  ]);
  const sizeMap = new Map([
    [
      "square",
      ({ width, height }) =>
        `${width + "px" || "100%"} ${height + "px" || "100%"}`,
    ],
    ["circle", ({ radius }) => `${radius * 2}px ${radius * 2}px`],
  ]);
  blocks.forEach((block) => {
    backgroundImages.push(imageMap.get(block.type)(block.size));
    backgroundPositions.push(`${block.style.left}px ${block.style.top}px`);
    backgroundSizes.push(sizeMap.get(block.type)(block.size));
  });
  styles["backgroundImage"] = backgroundImages.join(",");
  styles["backgroundPosition"] = backgroundPositions.join(",");
  styles["backgroundSize"] = backgroundSizes.join(",");
  styles["width"] = width;
  styles["height"] = height;
  return [
    styles,
    parseCode(backgroundImages, backgroundSizes, backgroundPositions),
  ];
};

const RenderResult = function ({ blocks = [], width = 450, height = 350 }) {
  const [styles, code] = generateStyles(blocks, width, height);
  console.log(code);
  return (
    <div style={{ display: "flex" }}>
      <Canvas>
        <div className="result-render" style={styles}></div>
      </Canvas>
      <textarea value={code} rows={10} cols={20} readOnly></textarea>
    </div>
  );
};

export default RenderResult;
