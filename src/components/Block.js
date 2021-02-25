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

//添加预设组
class Group extends Base {
  _className = "block-group";
  _type = "group";
  _renderItems(blocks = []) {
    return blocks.map((block, index) => {
      const [Comp] = getBlockByType(block.type);
      block.style.position = "absolute";
      return (
        <Comp key={index} {...block}>
          {this.props.children}
        </Comp>
      );
    });
  }
  render() {
    const _preset = getBlockByType(this._type)[1];
    const { style = {}, size = _preset.size } = this.props;
    console.log(_preset);
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
          position: "relative",
        }}
      >
        {this._renderItems(_preset.items)}
      </div>
    );
  }
}

class PostBlock extends Group {
  _type = "post-block";
}
class UserTagBlock extends Group {
  _type = "user-tag-block";
}

class PostFormBlock extends Group {
  _type = "post-form-block";
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
    ["post-block", PostBlock],
    ["user-tag-block", UserTagBlock],
    ["post-form-block", PostFormBlock],
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
  {
    type: "post-block",
    size: {
      width: 710,
      height: 468,
    },
    style: {},
    items: [
      {
        type: "square",
        size: { width: 708, height: 466, color: "#ffffff", radius: 354 },
        style: { left: 0, top: 0 },
      },
      {
        type: "circle",
        size: { width: 60, height: 60, color: "#d3d3d3", radius: 30 },
        style: { left: 19, top: 21 },
      },
      {
        type: "square",
        size: { width: 68, height: 22, color: "#d3d3d3", radius: 34 },
        style: { left: 100, top: 17 },
      },
      {
        type: "square",
        size: { width: 147, height: 20, color: "#d3d3d3", radius: 73.5 },
        style: { left: 100, top: 45 },
      },
      {
        type: "square",
        size: { width: 147, height: 20, color: "#d3d3d3", radius: 73.5 },
        style: { left: 100, top: 70 },
      },
      {
        type: "square",
        size: { width: 49, height: 28, color: "#d3d3d3", radius: 24.5 },
        style: { left: 641, top: 21 },
      },
      {
        type: "square",
        size: { width: 217, height: 20, color: "#d3d3d3", radius: 108.5 },
        style: { left: 15, top: 95 },
      },
      {
        type: "square",
        size: { width: 191, height: 20, color: "#d3d3d3", radius: 95.5 },
        style: { left: 15, top: 122 },
      },
      {
        type: "square",
        size: { width: 223, height: 20, color: "#d3d3d3", radius: 111.5 },
        style: { left: 15, top: 150 },
      },
      {
        type: "square",
        size: { width: 342, height: 20, color: "#d3d3d3", radius: 171 },
        style: { left: 15, top: 176 },
      },
      {
        type: "square",
        size: { width: 390, height: 20, color: "#d3d3d3", radius: 195 },
        style: { left: 15, top: 204 },
      },
      {
        type: "square",
        size: { width: 300, height: 20, color: "#d3d3d3", radius: 150 },
        style: { left: 15, top: 233 },
      },
      {
        type: "square",
        size: { width: 250, height: 20, color: "#d3d3d3", radius: 125 },
        style: { left: 15, top: 268 },
      },
      {
        type: "square",
        size: { width: 143, height: 38, color: "#d3d3d3", radius: 71.5 },
        style: { left: 21, top: 313 },
      },
      {
        type: "square",
        size: { width: 710, height: 97, color: "#d3d3d3", radius: 355 },
        style: { left: 0, top: 371 },
      },
    ],
  },
  {
    type: "user-tag-block",
    size: { width: 710, height: 100 },
    items: [
      {
        type: "square",
        size: { width: 709, height: 188, radius: 354.5, color: "#ffffff" },
        style: { left: 0, top: 0 },
      },
      {
        type: "square",
        size: { width: 103, height: 20, radius: 51.5, color: "#d3d3d3" },
        style: { left: 15, top: 20 },
      },
      {
        type: "square",
        size: { width: 78, height: 20, radius: 39, color: "#d3d3d3" },
        style: { left: 127, top: 20 },
      },
      {
        type: "square",
        size: { width: 93, height: 20, radius: 46.5, color: "#d3d3d3" },
        style: { left: 595, top: 20 },
      },
      {
        type: "square",
        size: { width: 78, height: 20, radius: 39, color: "#d3d3d3" },
        style: { left: 23, top: 50 },
      },
      {
        type: "square",
        size: { width: 78, height: 20, radius: 39, color: "#d3d3d3" },
        style: { left: 15, top: 87 },
      },
      {
        type: "square",
        size: { width: 78, height: 20, radius: 39, color: "#d3d3d3" },
        style: { left: 15, top: 120 },
      },
      {
        type: "square",
        size: { width: 131, height: 20, radius: 65.5, color: "#d3d3d3" },
        style: { left: 496, top: 150 },
      },
      {
        type: "square",
        size: { width: 35, height: 20, radius: 17.5, color: "#d3d3d3" },
        style: { left: 650, top: 150 },
      },
    ],
  },
  {
    type: "post-form-block",
    size: {
      width: 710,
      height: 100,
    },
    style: {},
    items: [
      {
        type: "square",
        size: { width: 177, height: 29, color: "#ffffff", radius: 88.5 },
        style: { left: 533, top: 5 },
      },
      {
        type: "square",
        size: { width: 73, height: 20, color: "#d3d3d3", radius: 36.5 },
        style: { left: 451, top: 12 },
      },
      {
        type: "square",
        size: { width: 51, height: 20, color: "#d3d3d3", radius: 25.5 },
        style: { left: 86, top: 11 },
      },
      {
        type: "square",
        size: { width: 51, height: 20, color: "#d3d3d3", radius: 25.5 },
        style: { left: 159, top: 11 },
      },
      {
        type: "square",
        size: { width: 79, height: 43, color: "#ffffff", radius: 39.5 },
        style: { left: 0, top: 0 },
      },
      {
        type: "square",
        size: { width: 51, height: 20, color: "#d3d3d3", radius: 25.5 },
        style: { left: 15, top: 11 },
      },
      {
        type: "square",
        size: { width: 710, height: 76, color: "#ffffff", radius: 355 },
        style: { left: 0, top: 41 },
      },
      {
        type: "circle",
        size: { width: 50, height: 50, color: "#d3d3d3", radius: 25 },
        style: { left: 11, top: 51 },
      },
      {
        type: "square",
        size: { width: 460, height: 18, color: "#d3d3d3", radius: 230 },
        style: { left: 68, top: 68 },
      },
    ],
  },
];

export { Circle, Square, getBlockByType, presets };
export default BlockLists;
