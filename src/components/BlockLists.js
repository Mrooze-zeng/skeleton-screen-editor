import { Component } from "react";
import "./BlockLists.scss";

class BaseBlockList extends Component {
  constructor(props) {
    super(props);
    this._handleDragStart = this._handleDragStart.bind(this);
  }
  _className = "block-square";
  _type = "square";
  _defaultSize = {
    width: 100,
    height: 100,
    color: "#d3d3d3",
    radius: 50,
  };
  _handleDragStart(event) {
    const { x, y } = event.target.getBoundingClientRect();
    const { size = this._defaultSize } = this.props;
    event.dataTransfer.setData(
      "block",
      JSON.stringify({
        X: event.clientX - x,
        Y: event.clientY - y,
        type: this._type,
        size: size,
      })
    );
  }
  render() {
    const { children = "", style = {}, size = this._defaultSize } = this.props;
    return (
      <div
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

class Circle extends BaseBlockList {
  _className = "block-circle";
  _type = "circle";
}

class Square extends BaseBlockList {
  _className = "block-square";
  _type = "square";
}

const BlockLists = function (props) {
  const lists = [Circle, Square];
  return lists.map((List, index) => {
    return <List key={index} draggable={true} {...props} />;
  });
};

const getBlockByType = function (type = "square") {
  const blockMap = new Map([
    ["square", Square],
    ["circle", Circle],
  ]);
  if (!blockMap.has(type)) {
    return null;
  }
  return blockMap.get(type);
};

export { Circle, Square, getBlockByType };
export default BlockLists;
