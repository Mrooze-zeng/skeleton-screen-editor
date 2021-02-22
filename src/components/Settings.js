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
  onUpdateCanvas = function () {},
}) {
  const _readImage = function (file) {
    return new Promise((resolve, reject) => {
      if (!file.name) {
        return reject();
      }
      const reader = new FileReader();
      reader.onload = function () {
        const image = new Image();
        image.onload = function () {
          resolve(image);
        };
        image.src = this.result;
      };
      reader.readAsDataURL(file);
    });
  };
  const _handleSubmit = async function (event) {
    try {
      const image = await _readImage(event.data.file);
      onUpdateCanvas({ ...event.data, image });
    } catch (e) {
      onUpdateCanvas({ ...event.data, file: null });
    }
  };
  return (
    <Form onSubmit={_handleSubmit}>
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
  const currentBlock = blocks.find((block) => block.isActive) || {};
  if (!currentBlock.id) {
    return (
      <SetCanvasAccordingToWidthHeight
        {...canvasAttr}
        onUpdateCanvas={onUpdateCanvas}
      />
    );
  }
  const _handleSubmit = function (event) {
    const {
      color = "",
      width = 0,
      height = 0,
      left = 0,
      top = 0,
      radius = 0,
    } = event.data;
    onUpdateBlock(currentBlock.id, {
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
      <RenderInput {...currentBlock} />
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
      <p>微调</p>
      <div>
        <label htmlFor="left">X:</label>
        <input
          key={currentBlock.style.left}
          type="number"
          defaultValue={parseFloat(currentBlock.style.left)}
          name="left"
          id="left"
        />
      </div>
      <div>
        <label htmlFor="top">Y:</label>
        <input
          key={currentBlock.style.top}
          type="number"
          defaultValue={parseFloat(currentBlock.style.top)}
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
