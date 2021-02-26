import { serializeWidthAndHeightOnStyle } from "../utils/index";
import Canvas from "./Canvas";
import "./RenderResult.scss";

const parseCodeToStyle = function (code = "") {
  const result = [];
  const blockRegx = new RegExp(
    /(radial|linear)-gradient\(([^)]*)\)(,\s?\d+(\.*\d*)(px|rem|%)?\s{1}\d+(\.*\d*)(px|rem|%)?){2}/g
  );
  const colorReg = new RegExp(/#\S+\d{0}/gi);
  const digitReg = new RegExp(
    /,\s?\d+(\.*\d*)(px|rem|%)?\s{1}\d+(\.*\d*)(px|rem|%)?/g
  );

  const codeGroup = code.match(blockRegx) || [];
  const _getType = function (code = "") {
    if (code.indexOf("radial-gradient") >= 0) {
      return "circle";
    } else if (code.indexOf("linear-gradient") >= 0) {
      return "square";
    }
  };
  const _getSize = function (code) {
    const [size = "", position = ""] = code.match(digitReg) || [];
    const [color = ""] = code.match(colorReg) || [];
    const [width = "", height = ""] = size.replace(",", "").trim().split(" ");
    const [left = "", top = ""] = position.replace(",", "").trim().split(" ");
    return [
      {
        width: parseInt(width),
        height: parseInt(height),
        radius: parseInt(width) / 2,
        color: color,
      },
      { left: parseInt(left), top: parseInt(top) },
    ];
  };
  for (let i = 0; i < codeGroup.length; i++) {
    const [size, style] = _getSize(codeGroup[i]);
    const type = _getType(codeGroup[i]);
    const data = {
      id: Date.now() + i + 1,
      type,
      size,
      style,
    };
    result.unshift(data);
  }
  return result;
};

const _parseStyleToCode = function (images = [], sizes = [], positions = []) {
  let codes = [];
  images.forEach((image, i) => {
    codes.push(`(${image},${sizes[i]},${positions[i]})`);
  });
  return codes.length ? `(${codes.join(",")});` : "";
};

const _generateStyles = function (blocks = [], width = 450, height = 350) {
  let styles = {};
  let backgroundImages = [];
  let backgroundPositions = [];
  let backgroundSizes = [];
  const imageMap = new Map([
    [
      "square",
      ({ color = "lightgray" }) =>
        `linear-gradient( ${color} 100%, transparent 0 )`,
    ],
    [
      "circle",
      ({ radius = 50, color = "lightgray" }) =>
        `radial-gradient( circle ${radius}px at ${radius}px ${radius}px, ${color} 100%, transparent 0 )`,
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

  for (let i = blocks.length - 1; i >= 0; i--) {
    let block = blocks[i];
    backgroundImages.push(imageMap.get(block.type)(block.size));
    backgroundPositions.push(`${block.style.left}px ${block.style.top}px`);
    backgroundSizes.push(sizeMap.get(block.type)(block.size));
  }

  styles["backgroundImage"] = backgroundImages.join(",");
  styles["backgroundPosition"] = backgroundPositions.join(",");
  styles["backgroundSize"] = backgroundSizes.join(",");
  styles["width"] = width;
  styles["height"] = height;
  return [
    serializeWidthAndHeightOnStyle(styles),
    _parseStyleToCode(backgroundImages, backgroundSizes, backgroundPositions),
  ];
};

const RenderResult = function ({ blocks = [], width = 450, height = 350 }) {
  const [styles, code] = _generateStyles(blocks, width, height);
  const _selectText = function (event) {
    event.target.select();
    document.execCommand("copy");
  };
  return (
    <>
      <Canvas width={width} height={height}>
        <div className="result-render" style={styles}></div>
      </Canvas>
      <textarea
        value={code}
        rows={10}
        cols={20}
        onFocus={_selectText}
        readOnly
        style={{ width: "100%" }}
      ></textarea>
    </>
  );
};

export { parseCodeToStyle };

export default RenderResult;
