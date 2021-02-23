const drawGrid = function (
  canvas,
  stepX = 10,
  stepY = 10,
  color = "lightgray",
  lineWidth = 0.5
) {
  const ctx = canvas.getContext("2d");
  ctx.lineWidth = lineWidth;

  for (let i = lineWidth, j = 0; i < canvas.width; i += stepX, j++) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, canvas.height);
    if (j % 5 === 0) {
      ctx.strokeStyle = "darkgrey";
    } else {
      ctx.strokeStyle = color;
    }
    ctx.stroke();
  }

  for (let i = lineWidth, j = 0; i < canvas.height; i += stepY, j++) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(canvas.width, i);
    if (j % 5 === 0) {
      ctx.strokeStyle = "darkgrey";
    } else {
      ctx.strokeStyle = color;
    }
    ctx.stroke();
  }
};

const drawImage = function (canvas, image, width, height) {
  if (!image) {
    return;
  }
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0, width, (width * image.height) / image.width);
};

const serializeWidthAndHeightOnStyle = function (style) {
  return { ...style, width: style.width + "px", height: style.height + "px" };
};

const redrawBackground = function (canvas, image, width, height) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, width || canvas.width, height || canvas.height);
  if (image == null && typeof image == "object") {
    //hack
    canvas.image = image;
  }
  drawImage(
    canvas,
    image || canvas.image,
    width || canvas.width,
    height || canvas.height
  );
  drawGrid(canvas);
  return ctx;
};

const _drawGuideline = function (
  canvas = {},
  { x = 0, y = 0 },
  direction = ""
) {
  const endpoint = { x: 0, y: 0 };
  if (direction === "v") {
    endpoint.y = canvas.height;
    endpoint.x = x;
  } else if (direction === "h") {
    endpoint.y = y;
    endpoint.x = canvas.width;
  }
  const ctx = redrawBackground(canvas);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(endpoint.x, endpoint.y);
  ctx.strokeStyle = "#59c7f9";
  ctx.stroke();
};

const drawGuideline = function (
  canvas = {},
  { top = 0, left = 0, width = 0, height = 0 },
  side = ""
) {
  //todo 规划线被图层遮盖
  //todo 图层组移动规划线不正确
  if (side) {
    switch (side) {
      case "top":
        _drawGuideline(
          canvas,
          {
            y: top,
            x: 0,
          },
          "h"
        );
        break;
      case "right":
        _drawGuideline(
          canvas,
          {
            y: 0,
            x: left + width,
          },
          "v"
        );
        break;
      case "bottom":
        _drawGuideline(
          canvas,
          {
            y: top + height,
            x: 0,
          },
          "h"
        );
        break;
      default:
        //left
        _drawGuideline(
          canvas,
          {
            y: 0,
            x: left,
          },
          "v"
        );
        break;
    }
  }
};

const blockCreator = function (
  {
    id = "",
    type = "",
    left = 0,
    top = 0,
    width = 0,
    height = 0,
    color = "",
    radius = 0,
    isActive = false,
  },
  { canvas = {}, extra = 0, side = "" }
) {
  // calculate boundary
  if (left + width > canvas.width) {
    left = canvas.width - width - extra;
  }
  if (left <= 0) {
    left = 0;
  }
  if (top + height > canvas.height) {
    top = canvas.height - height - extra;
  }
  if (top <= 0) {
    top = 0;
  }
  if (width > canvas.width) {
    width = canvas.width;
  }
  if (height > canvas.height) {
    height = canvas.height;
  }
  drawGuideline(canvas, { top, left, width, height }, side);
  return [
    {
      id: id || Date.now(),
      isActive,
      type: type,
      style: {
        left,
        top,
      },
      size: { width, height, color, radius },
    },
  ];
};

const throttle = function (delay = 100) {
  let _timers = [];
  return function (fn, argus) {
    if (_timers.length > 1) {
      clearTimeout(_timers[0]);
      _timers.shift();
      return;
    }
    _timers.push(
      setTimeout(function () {
        fn(argus);
      }, delay)
    );
  };
};

const _blockGroupBoundaryMin = function (blocks = [], side = "top") {
  let _value = [];
  blocks.forEach((block) => {
    if (block.isActive) {
      _value.push(block.style[side]);
    }
  });
  return Math.min(..._value) === 0;
};
const _blockGroupBoundaryMax = function (
  blocks = [],
  extra = "width",
  side = "top",
  max = 0
) {
  let _value = [];
  blocks.forEach((block) => {
    if (block.isActive) {
      _value.push(block.style[side] + block.size[extra]);
    }
  });
  return Math.max(..._value) === max;
};

const blockShortCutKeyMap = function (
  event,
  {
    canvas = {},
    remove = function (activeIds = []) {},
    add = function (newBlocks = []) {},
    update = function (id = "", block = {}) {},
  }
) {
  return {
    Backspace: function (blocks = []) {
      event.preventDefault();
      event.stopPropagation();
      let selectedIds = [];
      blocks.forEach((block) => {
        if (block.isActive) {
          selectedIds.push(block.id);
        }
      });
      remove(selectedIds);
    },
    KeyC: function () {
      if (event.metaKey) {
        event.preventDefault();
        event.stopPropagation();
        console.log("copy");
      }
    },
    KeyV: function (blocks = []) {
      if (event.metaKey) {
        event.preventDefault();
        event.stopPropagation();
        let newBlocks = [];
        blocks.forEach((block, i) => {
          if (block.isActive) {
            const { type, style, size } = block;
            const [newBlock] = blockCreator(
              {
                type,
                isActive: true,
                id: Date.now() + i,
                left: style.left + 10,
                top: style.top + 10,
                ...size,
              },
              { canvas, extra: 15 }
            );
            newBlocks.push(newBlock);
          }
        });
        add(newBlocks, true);
      }
    },
    ArrowUp: function (blocks = []) {
      event.preventDefault();
      event.stopPropagation();

      if (_blockGroupBoundaryMin([...blocks], "top")) {
        return;
      }

      let newBlocks = [];

      blocks.forEach((block) => {
        if (block.isActive) {
          let top = block.style.top;
          top -= 1;
          if (top >= 0) {
            const [newBlock] = blockCreator(
              {
                ...block,
                ...block.size,
                ...block.style,
                top,
              },
              { canvas, side: "top" }
            );
            newBlocks.push(newBlock);
          }
        }
      });
      update(newBlocks);
    },
    ArrowRight: function (blocks = []) {
      event.preventDefault();
      event.stopPropagation();

      if (_blockGroupBoundaryMax([...blocks], "width", "left", canvas.width)) {
        return;
      }

      let newBlocks = [];
      blocks.forEach((block) => {
        if (block.isActive) {
          let left = block.style.left;
          left += 1;
          if (left + block.size.width <= canvas.width) {
            const [newBlock] = blockCreator(
              {
                ...block,
                ...block.size,
                ...block.style,
                left,
              },
              { canvas, side: "right" }
            );
            newBlocks.push(newBlock);
          }
        }
      });
      update(newBlocks);
    },
    ArrowDown: function (blocks = []) {
      event.preventDefault();
      event.stopPropagation();

      if (_blockGroupBoundaryMax([...blocks], "height", "top", canvas.height)) {
        return;
      }

      let newBlocks = [];
      blocks.forEach((block) => {
        if (block.isActive) {
          let top = block.style.top;
          top += 1;
          if (top + block.size.height <= canvas.height) {
            const [newBlock] = blockCreator(
              {
                ...block,
                ...block.size,
                ...block.style,
                top,
              },
              { canvas, side: "bottom" }
            );
            newBlocks.push(newBlock);
          }
        }
      });
      update(newBlocks);
    },
    ArrowLeft: function (blocks = []) {
      event.preventDefault();
      event.stopPropagation();

      if (_blockGroupBoundaryMin([...blocks], "left")) {
        return;
      }

      let newBlocks = [];
      blocks.forEach((block) => {
        if (block.isActive) {
          let left = block.style.left;
          left -= 1;
          if (left >= 0) {
            const [newBlock] = blockCreator(
              {
                ...block,
                ...block.size,
                ...block.style,
                left,
              },
              { canvas, side: "left" }
            );
            newBlocks.push(newBlock);
          }
        }
      });
      update(newBlocks);
    },
  };
};

const calculateBlockGroupHeight = function (blocks = [], margin = 0) {
  let _blocksheights = [0];
  blocks.forEach((block) => {
    _blocksheights.push(block.style.top + block.size.height);
  });
  return Math.max(..._blocksheights) + margin;
};

export {
  drawGrid,
  drawImage,
  serializeWidthAndHeightOnStyle,
  blockCreator,
  throttle,
  blockShortCutKeyMap,
  redrawBackground,
  drawGuideline,
  calculateBlockGroupHeight,
};
