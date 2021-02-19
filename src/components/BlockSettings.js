import Form from "../Form";

const BlockSettings = function ({
  currentBlock = {},
  onUpdateBlock = function () {},
}) {
  if (!currentBlock.id) {
    return "";
  }
  const _handleSubmit = function (event) {
    onUpdateBlock(currentBlock.id, { ...currentBlock, size: event.data });
  };
  const {
    size: { width, height, color },
  } = currentBlock;
  return (
    <Form onSubmit={_handleSubmit}>
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

export default BlockSettings;
