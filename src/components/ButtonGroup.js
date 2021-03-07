import { blockGroupBoundaryMin, calculateBlockGroupHeight } from "../utils";
import { parseCodeToStyle } from "./RenderResult";

const ButtonGroup = function ({
  onCanvasChange = function () {},
  onBlockChange = function () {},
  setBlocks = function () {},
  blocks = {},
  canvasAttr = {},
}) {
  return (
    <div className="button-group">
      <button
        onClick={() => {
          onCanvasChange({
            ...canvasAttr,
            height: window.innerHeight / 2,
          });
          setBlocks([]);
        }}
      >
        清空画板
      </button>
      <button onClick={() => onBlockChange(blocks)}>渲染</button>

      <button
        onClick={() => {
          let code = window.prompt("请填入样式代码 (ps:有格式限制)") || "";
          code = code.replace(/\r|\n|\s{2}/g, "");
          if (code) {
            let codeBlocks = setBlocks(code);
            let blockIds = [];
            codeBlocks.forEach((block) => {
              blockIds.push(block.id);
            });
            setBlocks([...codeBlocks], blockIds);
          }
        }}
      >
        导入样式代码
      </button>
      <button
        onClick={() => {
          let code = window.prompt("请填入样式代码 (ps:有格式限制)") || "";
          code = code.replace(/\r|\n|\s{2}/g, "");
          if (code) {
            let codeBlocks = parseCodeToStyle(code);
            let blockIds = [];
            codeBlocks.forEach((block) => {
              blockIds.push(block.id);
            });
            const extraHeight = calculateBlockGroupHeight(blocks, 15);
            const min = blockGroupBoundaryMin(codeBlocks, "top", true)[1];
            codeBlocks = codeBlocks.map((block) => {
              block.style.top += extraHeight - min;
              return block;
            });
            onCanvasChange({
              ...canvasAttr,
              height: calculateBlockGroupHeight([...blocks, ...codeBlocks], 15),
            });
            setBlocks([...blocks, ...codeBlocks], blockIds);
          }
        }}
      >
        添加样式块
      </button>
    </div>
  );
};

export default ButtonGroup;
