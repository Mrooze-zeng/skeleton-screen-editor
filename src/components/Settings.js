import Form from "../Form";

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
              type="text"
              name="height"
              defaultValue={parseFloat(height)}
              placeholder="请输入高度"
            />
          </div>
          <div>
            <label htmlFor="">宽度:</label>
            <input
              type="text"
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
            type="text"
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
      onUpdateCanvas({ ...event.data });
    }
  };
  return (
    <Form onSubmit={_handleSubmit}>
      <div>
        <label htmlFor="">画布宽度:</label>
        <input
          type="text"
          id="width"
          name="width"
          defaultValue={parseFloat(width)}
          placeholder="请输入画布宽度"
        />
      </div>
      <div>
        <label htmlFor="">画布高度:</label>
        <input
          type="text"
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
  currentBlock = {},
  canvasAttr = {},
  onUpdateBlock = function () {},
  onCurrentBlockChange = function () {},
  onUpdateCanvas = function () {},
}) {
  if (!currentBlock.id) {
    return (
      <SetCanvasAccordingToWidthHeight
        {...canvasAttr}
        onUpdateCanvas={onUpdateCanvas}
      />
    );
  }
  const _handleSubmit = function (event) {
    onUpdateBlock(currentBlock.id, { size: event.data });
    onCurrentBlockChange({ ...currentBlock, size: event.data });
  };

  const {
    size: { color = "lightgray" },
  } = currentBlock;
  return (
    <Form onSubmit={_handleSubmit}>
      <RenderInput {...currentBlock} />
      <div>
        <label htmlFor="">颜色:</label>
        <input type="color" defaultValue={color} name="color" />
      </div>
      <div>
        <button type="submit">提交</button>
        <button type="reset">重置</button>
      </div>
    </Form>
  );
};

export default Settings;
