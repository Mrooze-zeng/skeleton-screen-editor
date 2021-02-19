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

const drawImage = function (canvas, image) {
  if (!image) {
    return;
  }
  const ctx = canvas.getContext("2d");
  console.log(image);
  ctx.drawImage(image, 0, 0);
};

export { drawGrid, drawImage };
