import { blockGroup } from "../utils";
import Form from "./Form";

const RenderInput = function ({ type = "square" }) {
  const typeInputMap = new Map([
    [
      "square",
      ({ height = 100, width = 100 }) => (
        <>
          <div>
            <label htmlFor="height">高度:</label>
            <input
              id="height"
              type="number"
              name="height"
              defaultValue={parseFloat(height)}
              placeholder="请输入高度"
            />
          </div>
          <div>
            <label htmlFor="">宽度:</label>
            <input
              type="number"
              id="width"
              name="width"
              defaultValue={parseFloat(width)}
              placeholder="请输入宽度"
            />
          </div>
        </>
      ),
    ],
    [
      "circle",
      ({ radius = 50 }) => (
        <div>
          <label htmlFor="radius">半径:</label>
          <input
            type="number"
            id="radius"
            name="radius"
            defaultValue={parseFloat(radius)}
          />
        </div>
      ),
    ],
  ]);
  const Inputs = typeInputMap.get(type);
  const block = arguments[0] || {};
  return <Inputs {...block.size} />;
};

const SetCanvasAccordingToWidthHeight = function ({
  height = 350,
  width = 450,
  style = {},
  onUpdateCanvas = function () {},
}) {
  const _readImage = function (file, imageWidth) {
    return new Promise((resolve, reject) => {
      if (!file.name) {
        return reject();
      }
      const reader = new FileReader();
      reader.onload = function () {
        const image = new Image();
        image.onload = function () {
          const originalWidth = image.width;
          image.width = imageWidth;
          image.height = (imageWidth * image.height) / originalWidth;
          resolve(image);
        };
        image.src = this.result;
      };
      reader.readAsDataURL(file);
    });
  };
  const _handleSubmit = async function (event) {
    try {
      const image = await _readImage(
        event.data.file,
        parseFloat(event.data.imageWidth)
      );
      onUpdateCanvas({ ...event.data, image });
    } catch (e) {
      onUpdateCanvas({ ...event.data, file: null });
    }
  };
  return (
    <Form onSubmit={_handleSubmit} style={style}>
      <h3>设置画布属性:</h3>
      <div>
        <label htmlFor="">画布宽度:</label>
        <input
          type="number"
          id="width"
          name="width"
          defaultValue={parseFloat(width)}
          placeholder="请输入画布宽度"
        />
      </div>
      <div>
        <label htmlFor="">画布高度:</label>
        <input
          type="number"
          id="height"
          name="height"
          defaultValue={parseFloat(height)}
          placeholder="请输入画布高度"
        />
      </div>

      <div>
        <label htmlFor="image">上传图片:</label>
        <input type="file" accept="image/*" name="file" />
      </div>
      <div>
        <label htmlFor="imageWidth">底图宽度:</label>
        <input
          type="number"
          name="imageWidth"
          id="imageWidth"
          defaultValue={parseFloat(width)}
        />
      </div>
      <div>
        <button type="submit">提交</button>
        <button type="reset">重置</button>
      </div>
    </Form>
  );
};

const Settings = function ({
  blocks = [],
  canvasAttr = {},
  onUpdateBlock = function () {},
  onUpdateCanvas = function () {},
}) {
  const [activeGroup] = blockGroup(blocks, true);
  let currentBlock = {};
  //   console.log(activeGroup);
  if (!activeGroup.length) {
    return (
      <SetCanvasAccordingToWidthHeight
        {...canvasAttr}
        onUpdateCanvas={onUpdateCanvas}
      />
    );
  } else if (activeGroup.length === 1) {
    currentBlock = activeGroup[0];
  } else {
    return "";
  }

  const _handleSubmit = function (event) {
    const {
      color = "",
      width = 0,
      height = 0,
      left = 0,
      top = 0,
      radius = 0,
      type = "",
    } = event.data;
    onUpdateBlock(currentBlock.id, {
      type,
      size: {
        color,
        width: parseFloat(width),
        height: parseFloat(height),
        radius: parseFloat(radius),
      },
      style: { left: parseFloat(left), top: parseFloat(top) },
    });
  };

  return (
    <Form onSubmit={_handleSubmit}>
      <h3>设置块属性:</h3>
      <RenderInput {...currentBlock} />
      <div>
        <label htmlFor="type">类型:</label>
        <select
          name="type"
          id="type"
          key={currentBlock.type}
          defaultValue={currentBlock.type}
        >
          <option value="circle">circle</option>
          <option value="square">square</option>
        </select>
      </div>
      <div>
        <label htmlFor="color">颜色:</label>
        <input
          key={currentBlock.size.color}
          type="color"
          defaultValue={currentBlock.size.color}
          name="color"
          id="color"
        />
      </div>
      <p>---微调---</p>
      <div>
        <label htmlFor="left">X:</label>
        <input
          key={currentBlock.style.left}
          type="number"
          defaultValue={parseInt(currentBlock.style.left)}
          name="left"
          id="left"
        />
      </div>
      <div>
        <label htmlFor="top">Y:</label>
        <input
          key={currentBlock.style.top}
          type="number"
          defaultValue={parseInt(currentBlock.style.top)}
          name="top"
          id="top"
        />
      </div>
      <div>
        <button type="submit">提交</button>
        <button type="reset">重置</button>
      </div>
    </Form>
  );
};

export default Settings;
