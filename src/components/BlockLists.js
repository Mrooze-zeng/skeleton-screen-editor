import { Component } from "react";
import "./BlockLists.scss";

class BaseBlockList extends Component {
  constructor(props) {
    super(props);
    this._handleDragStart = this._handleDragStart.bind(this);
  }
  _className = "block-square";
  _type = "square";
  _handleDragStart(event) {
    const { x, y } = event.target.getBoundingClientRect();
    const { size = { width: 100, height: 100, color: "#deb887" } } = this.props;
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
    const {
      children = "",
      style = {},
      size = { width: 100, height: 100, color: "#deb887" },
    } = this.props;
    return (
      <div
        className={this._className}
        onDragStart={this._handleDragStart}
        {...this.props}
        style={{
          ...style,
          width: parseFloat(size.width),
          height: parseFloat(size.height),
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
