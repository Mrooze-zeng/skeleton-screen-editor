const Note = function () {
  return (
    <div style={{ maxHeight: 250, overflow: "scroll", display: "flex" }}>
      <ul>
        <h3>快捷键:</h3>
        <li>Delete: 删除</li>
        <li>Command+V: 复制选中的块</li>
        <li>ArrowUp|ArrowDown|ArrowLeft|ArrowRight:上下左右移动</li>
        <li>Command+左击: 多项选择|多项取消选择</li>
      </ul>
      <ul>
        <h3>说明</h3>
        <li>
          生成的样式仅对于SCSS有效 且SCSS中已经定义是函数
          <pre>
            <code>
              {`
                    @mixin skeleton-screen-bg-creator($images, $width, $height) {
                        $imagesArr: ();
                        $sizeArr: ();
                        $positionArr: ();
                    
                        @for $i from 1 through length($images) {
                            $imagesArr: append(
                                $imagesArr,
                                nth(nth($images, $i), 1),
                                $separator: comma
                            );
                            $sizeArr: append($sizeArr, nth(nth($images, $i), 2), $separator: comma);
                            $positionArr: append(
                                $positionArr,
                                nth(nth($images, $i), 3),
                                $separator: comma
                            );
                        }
                    
                        background: {
                            image: $imagesArr;
                            size: $sizeArr;
                            position: $positionArr;
                        }
                        background-repeat: no-repeat;
                        overflow: hidden;
                        width: $width;
                        height: $height;
                        &:before {
                            content: "";
                            width: $width;
                            height: $height;
                            display: inline-block;
                            position: relative;
                            top: -20px;
                            left: -100%;
                            background-image: linear-gradient(
                                100deg,
                                rgba(255, 255, 255, 0),
                                rgba(255, 255, 255, 0.5) 50%,
                                rgba(255, 255, 255, 0) 80%
                            );
                            animation: shine 1s infinite;
                        }
                    
                        @keyframes shine {
                            to {
                                left: 100%;
                            }
                        }
                    }
                    `}
            </code>
          </pre>
        </li>

        <li>
          导入及添加的样式块的格式基于
          <pre>
            <code>{`
            $arr: (
                (linear-gradient(lightgray 25px, transparent 0), 100px 25px, 15px 15px),
                (linear-gradient(white 100%, transparent 0), 25px 25px, 120px 15px)
            );
            `}</code>
          </pre>
          是以[image,size,position]为子元素的数组
        </li>
        <li>
          使用:
          <pre>
            <code>
              {`
                    $arr: (
                        (linear-gradient(#ff0000 25px, transparent 0), 100px 25px, 15px 15px),
                        (linear-gradient(white 100%, transparent 0), 25px 25px, 120px 15px)
                    );
                    
                    .my-skeleton-screen {
                        @include skeleton-screen-bg-creator($arr,$backgroundWidth,$backgroundHeight);
                    }
                    `}
            </code>
          </pre>
        </li>
      </ul>
    </div>
  );
};

export default Note;
