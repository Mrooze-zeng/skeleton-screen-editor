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
  return <Inputs {...arguments} />;
};

const CanvasSettings = function ({
  height = 350,
  width = 450,
  onUpdateCanvas = function () {},
}) {
  const _handleSubmit = function (event) {
    onUpdateCanvas(event.data);
  };
  return (
    <Form onSubmit={_handleSubmit}>
      <p>设置画布属性</p>
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
    return <CanvasSettings {...canvasAttr} onUpdateCanvas={onUpdateCanvas} />;
  }
  const _handleSubmit = function (event) {
    onUpdateBlock(currentBlock.id, { ...currentBlock, size: event.data });
    onCurrentBlockChange({ ...currentBlock, size: event.data });
  };

  const {
    size: { color },
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
