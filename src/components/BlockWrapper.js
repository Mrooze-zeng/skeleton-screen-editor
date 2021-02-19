import { getBlockByType } from "./BlockLists";

const BlockWrapper = function ({
  id = "",
  style = {},
  children = "",
  type = "",
  size = {},
  isActive = false,
  onRemoveBlock = function () {},
  onUpdateBlock = function () {},
  setCurrentBlock = function () {},
}) {
  const Block = getBlockByType(type);
  const handleClick = function (event) {
    setCurrentBlock(!isActive && id);
  };
  return (
    <Block
      id={id}
      style={style}
      size={size}
      isactive={isActive ? isActive.toString() : undefined}
      onDoubleClick={() => onRemoveBlock(id)}
      onClick={handleClick}
    >
      {children}
    </Block>
  );
};

const RenderBlocks = function ({
  blocks = [],
  currentBlock = {},
  onUpdateBlock = function () {},
  onCurrentBlockChange = function () {},
}) {
  const handleRemoveBlock = function (id = "") {
    onUpdateBlock(blocks.filter((block) => block.id !== id));
  };
  const handleUpdateBlock = function (id = "", newBlock = {}) {
    onUpdateBlock(
      blocks.map((block) => {
        if (block.id === id) {
          return newBlock;
        }
        return block;
      })
    );
  };
  const handleSetCurrentBlock = function (id = "", newBlock = {}) {
    onCurrentBlockChange(blocks.filter((block) => block.id === id)[0]);
  };
  return blocks.map((block, index) => (
    <BlockWrapper
      key={index}
      isActive={currentBlock.id === block.id}
      onRemoveBlock={handleRemoveBlock}
      onUpdateBlock={handleUpdateBlock}
      setCurrentBlock={handleSetCurrentBlock}
      {...block}
    >
      {/* {block.id} */}
    </BlockWrapper>
  ));
};

export { RenderBlocks };

export default BlockWrapper;
