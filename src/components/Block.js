import { Component } from "react";
import "./Block.scss";

class Base extends Component {
  constructor(props) {
    super(props);
    this._handleDragStart = this._handleDragStart.bind(this);
  }
  _className = "block-square";
  static _type = "square";
  _handleDragStart(event) {
    const { x, y } = event.target.getBoundingClientRect();
    event.dataTransfer.setData(
      "block",
      JSON.stringify({
        X: event.clientX - x,
        Y: event.clientY - y,
        type: this.constructor._type,
      })
    );
  }
  render() {
    const _preset = getBlockByType(this.constructor._type)[1];
    const { children = "", style = {}, size = _preset.size } = this.props;
    return (
      <div
        type="block"
        className={this._className}
        onDragStart={this._handleDragStart}
        {...this.props}
        style={{
          ...style,
          width: parseInt(size.width || size.radius * 2),
          height: parseInt(size.height || size.radius * 2),
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
  static _type = "circle";
}

class Square extends Base {
  _className = "block-square";
  static _type = "square";
}

//添加预设组
class Group extends Base {
  _className = "block-group";
  static _type = "group";
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
    const _preset = getBlockByType(this.constructor._type)[1];
    const { style = {}, size = _preset.size } = this.props;
    return (
      <div
        type="block"
        className={this._className}
        onDragStart={this._handleDragStart}
        {...this.props}
        style={{
          ...style,
          width: parseInt(size.width || size.radius * 2),
          height: parseInt(size.height || size.radius * 2),
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
  static _type = "post-block";
}
class PostBlock2 extends Group {
  static _type = "post-block2";
}
class UserTagBlock extends Group {
  static _type = "user-tag-block";
}
class UserTagBlock2 extends Group {
  static _type = "user-tag-block2";
}

class PostFormBlock extends Group {
  static _type = "post-form-block";
}
class PostFormBlock2 extends Group {
  static _type = "post-form-block2";
}

class UserInfoBlock extends Group {
  static _type = "user-info-block";
}

class UserInfoBlock2 extends Group {
  static _type = "user-info-block2";
}

class CourseListBlock extends Group {
  static _type = "course-list-block";
}

class CourseListBlock2 extends Group {
  static _type = "course-list-block2";
}

class CopyrightBlock extends Group {
  static _type = "copyright-block";
}

const BlockLists = function ({ blocks = [], draggable = false }) {
  return blocks.map((block, index) => {
    const [Comp] = getBlockByType(block.type);
    return <Comp key={index} draggable={draggable} {...block} />;
  });
};

const getBlockByType = function (type = Square._type) {
  const blockMap = new Map([
    [Square._type, Square],
    [Circle._type, Circle],
    [PostBlock._type, PostBlock],
    [PostBlock2._type, PostBlock2],
    [UserTagBlock._type, UserTagBlock],
    [UserTagBlock2._type, UserTagBlock2],
    [PostFormBlock._type, PostFormBlock],
    [PostFormBlock2._type, PostFormBlock2],
    [UserInfoBlock._type, UserInfoBlock],
    [UserInfoBlock2._type, UserInfoBlock2],
    [CourseListBlock._type, CourseListBlock],
    [CourseListBlock2._type, CourseListBlock2],
    [CopyrightBlock._type, CopyrightBlock],
  ]);
  if (!blockMap.has(type)) {
    return [null, null];
  }
  return [blockMap.get(type), presets.find((preset) => preset.type === type)];
};

const presets = [
  {
    type: Square._type,
    size: {
      width: 100,
      height: 100,
      color: "#d3d3d3",
    },
  },
  {
    type: Circle._type,
    size: {
      radius: 50,
      color: "#d3d3d3",
    },
  },
  {
    type: PostBlock._type,
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
    type: PostBlock2._type,
    size: { width: 710, height: 300 },
    items: [
      {
        type: "square",
        style: { left: 0, top: 0 },
        size: { width: 708, height: 466, color: "#ffffff", radius: 354 },
      },
      {
        type: "square",
        style: { left: 15, top: 17 },
        size: { width: 75, height: 75, color: "#d3d3d3", radius: 0 },
      },
      {
        type: "square",
        style: { left: 100, top: 17 },
        size: { width: 68, height: 22, color: "#d3d3d3", radius: 34 },
      },
      {
        type: "square",
        style: { left: 100, top: 45 },
        size: { width: 147, height: 20, color: "#d3d3d3", radius: 73.5 },
      },
      {
        type: "square",
        style: { left: 15, top: 121 },
        size: { width: 390, height: 20, color: "#d3d3d3", radius: 195 },
      },
      {
        type: "square",
        style: { left: 15, top: 150 },
        size: { width: 300, height: 20, color: "#d3d3d3", radius: 150 },
      },
      {
        type: "square",
        style: { left: 15, top: 185 },
        size: { width: 250, height: 20, color: "#d3d3d3", radius: 125 },
      },
      {
        type: "square",
        style: { left: 0, top: 371 },
        size: { width: 710, height: 97, color: "#d3d3d3", radius: 355 },
      },
    ],
  },
  {
    type: UserTagBlock._type,
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
    type: UserTagBlock2._type,
    size: { width: 710, height: 200 },
    items: [
      {
        type: "square",
        style: { left: 0, top: 0 },
        size: { width: 709, height: 188, color: "#ffffff", radius: 354.5 },
      },
      {
        type: "square",
        style: { left: 15, top: 20 },
        size: { width: 103, height: 20, color: "#d3d3d3", radius: 51.5 },
      },
      {
        type: "square",
        style: { left: 127, top: 20 },
        size: { width: 78, height: 20, color: "#d3d3d3", radius: 39 },
      },
      {
        type: "square",
        style: { left: 595, top: 20 },
        size: { width: 93, height: 20, color: "#d3d3d3", radius: 46.5 },
      },
      {
        type: "square",
        style: { left: 15, top: 87 },
        size: { width: 78, height: 20, color: "#d3d3d3", radius: 39 },
      },
      {
        type: "square",
        style: { left: 496, top: 150 },
        size: { width: 131, height: 20, color: "#d3d3d3", radius: 65.5 },
      },
      {
        type: "square",
        style: { left: 650, top: 150 },
        size: { width: 35, height: 20, color: "#d3d3d3", radius: 17.5 },
      },
    ],
  },
  {
    type: PostFormBlock._type,
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
  {
    type: UserInfoBlock._type,
    size: { width: 260, height: 195 },
    items: [
      {
        type: "square",
        size: { width: 259, height: 67, radius: 129.5, color: "#d3d3d3" },
        style: { left: 0, top: 0 },
      },
      {
        type: "square",
        size: { width: 260, height: 130, radius: 130, color: "#ffffff" },
        style: { left: 0, top: 67 },
      },
      {
        type: "circle",
        size: { width: 80, height: 80, radius: 40, color: "#ffffff" },
        style: { left: 19, top: 37 },
      },
      {
        type: "circle",
        size: { width: 72, height: 72, radius: 36, color: "#d3d3d3" },
        style: { left: 23, top: 41 },
      },
      {
        type: "square",
        size: { width: 85, height: 20, radius: 42.5, color: "#d3d3d3" },
        style: { left: 105, top: 72 },
      },
      {
        type: "square",
        size: { width: 59, height: 20, radius: 29.5, color: "#d3d3d3" },
        style: { left: 105, top: 95 },
      },
      {
        type: "circle",
        size: { width: 24, height: 24, radius: 12, color: "#d3d3d3" },
        style: { left: 14, top: 104 },
      },
      {
        type: "square",
        size: { width: 59, height: 20, radius: 29.5, color: "#d3d3d3" },
        style: { left: 106, top: 137 },
      },
      {
        type: "circle",
        size: { width: 32, height: 32, radius: 16, color: "#d3d3d3" },
        style: { left: 143, top: 127 },
      },
      {
        type: "square",
        size: { width: 52, height: 31, radius: 26, color: "#d3d3d3" },
        style: { left: 184, top: 127 },
      },
      {
        type: "square",
        size: { width: 140, height: 13, radius: 70, color: "#d3d3d3" },
        style: { left: 100, top: 163 },
      },
    ],
  },
  {
    type: UserInfoBlock2._type,
    size: { width: 710, height: 195 },
    items: [
      {
        type: "square",
        style: { left: 0, top: 0 },
        size: { width: 259, height: 67, color: "#d3d3d3", radius: 129.5 },
      },
      {
        type: "square",
        style: { left: 0, top: 67 },
        size: { width: 260, height: 130, color: "#ffffff", radius: 130 },
      },
      {
        type: "square",
        style: { left: 19, top: 37 },
        size: { color: "#ffffff", width: 80, height: 80, radius: 40 },
      },
      {
        type: "square",
        style: { left: 23, top: 41 },
        size: { color: "#d3d3d3", width: 72, height: 72, radius: 36 },
      },
      {
        type: "square",
        style: { left: 105, top: 72 },
        size: { color: "#d3d3d3", width: 85, height: 15, radius: 0 },
      },
      {
        type: "square",
        style: { left: 105, top: 95 },
        size: { color: "#d3d3d3", width: 59, height: 15, radius: 0 },
      },
      {
        type: "square",
        style: { left: 100, top: 141 },
        size: { width: 140, height: 13, color: "#d3d3d3", radius: 70 },
      },
    ],
  },
  {
    type: PostFormBlock2._type,
    size: { width: 710, height: 200 },
    items: [
      {
        type: "square",
        style: { left: 533, top: 5 },
        size: { width: 177, height: 29, color: "#ffffff", radius: 88.5 },
      },
      {
        type: "square",
        style: { left: 0, top: 0 },
        size: { width: 79, height: 43, color: "#ffffff", radius: 39.5 },
      },
      {
        type: "square",
        style: { left: 15, top: 11 },
        size: { width: 51, height: 20, color: "#d3d3d3", radius: 25.5 },
      },
      {
        type: "square",
        style: { left: 0, top: 41 },
        size: { width: 710, height: 76, color: "#ffffff", radius: 355 },
      },
      {
        type: "square",
        style: { left: 11, top: 51 },
        size: { color: "#d3d3d3", width: 50, height: 50, radius: 25 },
      },
      {
        type: "square",
        style: { left: 68, top: 68 },
        size: { width: 460, height: 18, color: "#d3d3d3", radius: 230 },
      },
    ],
  },
  {
    type: CourseListBlock._type,
    size: { width: 260, height: 100 },
    items: [
      {
        type: "square",
        size: { width: 260, height: 165, color: "#ffffff", radius: 130 },
        style: { left: 0, top: 0 },
      },
      {
        type: "square",
        size: { width: 161, height: 20, color: "#d3d3d3", radius: 80.5 },
        style: { left: 11, top: 17 },
      },
      {
        type: "square",
        size: { width: 59, height: 20, color: "#d3d3d3", radius: 29.5 },
        style: { left: 199, top: 17 },
      },
      {
        type: "square",
        size: { width: 188, height: 20, color: "#d3d3d3", radius: 94 },
        style: { left: 11, top: 68 },
      },
      {
        type: "square",
        size: { width: 149, height: 20, color: "#d3d3d3", radius: 74.5 },
        style: { left: 35, top: 100 },
      },
      {
        type: "square",
        size: { width: 214, height: 20, color: "#d3d3d3", radius: 107 },
        style: { left: 35, top: 132 },
      },
    ],
  },
  {
    type: CourseListBlock2._type,
    size: { width: 214, height: 200 },
    items: [
      {
        type: "square",
        style: { left: 0, top: 0 },
        size: { width: 260, height: 165, color: "#ffffff", radius: 130 },
      },
      {
        type: "square",
        style: { left: 15, top: 17 },
        size: { color: "#d3d3d3", width: 161, height: 20, radius: 0 },
      },
      {
        type: "square",
        style: { left: 15, top: 100 },
        size: { color: "#d3d3d3", width: 149, height: 20, radius: 0 },
      },
      {
        type: "square",
        style: { left: 15, top: 132 },
        size: { color: "#d3d3d3", width: 214, height: 20, radius: 0 },
      },
    ],
  },
  {
    type: CopyrightBlock._type,
    size: {
      width: 260,
      height: 200,
    },
    items: [
      {
        type: "square",
        size: { width: 228, height: 20, color: "#d3d3d3", radius: 114 },
        style: { left: 15, top: 0 },
      },
      {
        type: "square",
        size: { width: 20, height: 20, color: "#d3d3d3", radius: 10 },
        style: { left: 34, top: 49 },
      },
      {
        type: "square",
        size: { width: 20, height: 20, color: "#d3d3d3", radius: 10 },
        style: { left: 68, top: 49 },
      },
      {
        type: "square",
        size: { width: 20, height: 20, color: "#d3d3d3", radius: 10 },
        style: { left: 102, top: 49 },
      },
      {
        type: "square",
        size: { width: 20, height: 20, color: "#d3d3d3", radius: 10 },
        style: { left: 137, top: 49 },
      },
      {
        type: "square",
        size: { width: 20, height: 20, color: "#d3d3d3", radius: 10 },
        style: { left: 172, top: 49 },
      },
      {
        type: "square",
        size: { width: 20, height: 20, color: "#d3d3d3", radius: 10 },
        style: { left: 206, top: 49 },
      },
      {
        type: "square",
        size: { width: 175, height: 18, color: "#d3d3d3", radius: 87.5 },
        style: { left: 43, top: 95 },
      },
      {
        type: "square",
        size: { width: 105, height: 18, color: "#d3d3d3", radius: 52.5 },
        style: { left: 78, top: 117 },
      },
      {
        type: "square",
        size: { width: 175, height: 18, color: "#d3d3d3", radius: 87.5 },
        style: { left: 44, top: 145 },
      },
    ],
  },
];

export { Circle, Square, getBlockByType, presets };
export default BlockLists;
