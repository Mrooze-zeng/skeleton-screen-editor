import { Component } from "react";
import "./Block.scss";

class Base extends Component {
  constructor(props) {
    super(props);
    this._handleDragStart = this._handleDragStart.bind(this);
  }
  _className = "block-square";
  _type = "square";
  _handleDragStart(event) {
    const { x, y } = event.target.getBoundingClientRect();
    event.dataTransfer.setData(
      "block",
      JSON.stringify({
        X: event.clientX - x,
        Y: event.clientY - y,
        type: this._type,
      })
    );
  }
  render() {
    const _preset = getBlockByType(this._type)[1];
    const { children = "", style = {}, size = _preset.size } = this.props;
    return (
      <div
        type="block"
        className={this._className}
        onDragStart={this._handleDragStart}
        {...this.props}
        style={{
          ...style,
          width: parseFloat(size.width || size.radius * 2),
          height: parseFloat(size.height || size.radius * 2),
          backgroundColor: size.color,
        }}
      >
        {children}
      </div>
    );
  }
}

class Circle extends Base {
  _className = "block-circle";
  _type = "circle";
}

class Square extends Base {
  _className = "block-square";
  _type = "square";
}

const BlockLists = function ({ blocks = [], draggable = false }) {
  return blocks.map((block, index) => {
    const [Comp] = getBlockByType(block.type);
    return <Comp key={index} draggable={draggable} {...block} />;
  });
};

const getBlockByType = function (type = "square") {
  const blockMap = new Map([
    ["square", Square],
    ["circle", Circle],
  ]);
  if (!blockMap.has(type)) {
    return [null, null];
  }
  return [blockMap.get(type), presets.find((preset) => preset.type === type)];
};

const presets = [
  {
    type: "square",
    size: {
      width: 100,
      height: 100,
      color: "#d3d3d3",
    },
  },
  {
    type: "circle",
    size: {
      radius: 50,
      color: "#d3d3d3",
    },
  },
];

export { Circle, Square, getBlockByType, presets };
export default BlockLists;
