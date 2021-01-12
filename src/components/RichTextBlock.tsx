import React, { useCallback, useMemo, useState } from "react";
import isHotkey from "is-hotkey";
import { Editable, withReact, Slate, ReactEditor } from "slate-react";
import { Editor, Transforms, createEditor, Node } from "slate";
import { withHistory } from "slate-history";
import { Box } from "@chakra-ui/react";
import { Element, Leaf, toggleMark, Toolbar } from "./components";

// @refresh reset
const HOTKEYS: { [hotkey: string]: string } = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code"
};

export interface RichTextBlockProps {}

const initialValue = [
  {
    type: "paragraph",
    children: [{ text: "" }]
  }
];

const exampleValue = [
  {
    type: "paragraph",
    children: [
      { text: "This is editable " },
      { text: "rich", bold: true },
      { text: " text, " },
      { text: "much", italic: true },
      { text: " better than a " },
      { text: "<textarea>", code: true },
      { text: "!" }
    ]
  },
  {
    type: "paragraph",
    children: [
      {
        text:
          "Since it's rich text, you can do things like turn a selection of text "
      },
      { text: "bold", bold: true },
      {
        text:
          ", or add a semantically rendered block quote in the middle of the page, like this:"
      }
    ]
  },
  {
    type: "block-quote",
    children: [{ text: "A wise quote." }]
  },
  {
    type: "paragraph",
    children: [{ text: "Try it out for yourself!" }]
  }
];

export const RichTextBlock: React.FC<RichTextBlockProps> = ({}) => {
  const [value, setValue] = useState<Node[]>(exampleValue);
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  //focus selection
  const [focused, setFocused] = React.useState(false);
  const savedSelection = React.useRef(editor.selection);

  const onFocus = React.useCallback(() => {
    setFocused(true);
    if (!editor.selection && value?.length) {
      Transforms.select(
        editor,
        savedSelection.current ?? Editor.end(editor, [])
      );
    }
  }, [editor]);

  const onBlur = React.useCallback(() => {
    setFocused(false);
    savedSelection.current = editor.selection;
  }, [editor]);

  const divRef = React.useRef<HTMLDivElement>(null);

  const focusEditor = React.useCallback(
    (e: React.MouseEvent) => {
      if (e.target === divRef.current) {
        ReactEditor.focus(editor);
        e.preventDefault();
      }
    },
    [editor]
  );

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    for (const hotkey in HOTKEYS) {
      if (isHotkey(hotkey, event as any)) {
        event.preventDefault();
        const mark = HOTKEYS[hotkey];
        toggleMark(editor, mark);
      }
    }
  };

  return (
    <Box ref={divRef} onMouseDown={focusEditor} borderWidth={"1px"}>
      <Slate
        editor={editor}
        value={value}
        onChange={(newValue) => setValue(newValue)}
      >
        <Toolbar />
        <Box padding={"15px 5px"}>
          <Editable
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder="Enter some rich text…"
            spellCheck
            style={{ minHeight: "150px", resize: "vertical", overflow: "auto" }}
          />
        </Box>
      </Slate>
    </Box>
  );
};
