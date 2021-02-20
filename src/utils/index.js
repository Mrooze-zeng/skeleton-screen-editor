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
  ctx.drawImage(image, 0, 0, width, height);
};

const serializeWidthAndHeightOnStyle = function (style) {
  return { ...style, width: style.width + "px", height: style.height + "px" };
};

const blockCreator = function ({
  id = "",
  type = "",
  left = 0,
  top = 0,
  width = 0,
  height = 0,
  color = "",
  radius = 0,
}) {
  return {
    id: id || Date.now(),
    type: type,
    style: {
      left,
      top,
    },
    size: { width, height, color, radius },
  };
};

const listenGlobalKeyDown = function () {
  const deleteBlock = new Event("delete-block");
  const copyBlock = new Event("copy-block");
  const pasteBlock = new Event("paste-block");
  window.onkeydown = function (event) {
    if (event.keyCode === 8) {
      //delete
      document.dispatchEvent(deleteBlock);
    } else if (event.keyCode === 67 && event.metaKey) {
      //copy
      document.dispatchEvent(copyBlock);
    } else if (event.keyCode === 86 && event.metaKey) {
      //paste
      document.dispatchEvent(pasteBlock);
    }
  };
};

export {
  drawGrid,
  drawImage,
  serializeWidthAndHeightOnStyle,
  listenGlobalKeyDown,
  blockCreator,
};
