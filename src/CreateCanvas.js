import Form from "./Form";

function CreateCanvasForm({
  onSubmit = function () {},
  onReset = function () {},
}) {
  const handleSubmit = (e) => {
    onSubmit(e.data);
  };
  return (
    <Form onSubmit={handleSubmit} onReset={onReset}>
      <div>
        <label>宽度:</label>
        <input type="number" name="width" />
      </div>
      <div>
        <label>高度</label>
        <input type="number" name="height" />
      </div>

      <div>
        <button type="submit">生成</button>
        <button type="reset">重置</button>
      </div>
    </Form>
  );
}

export default CreateCanvasForm;
