import { useState, useRef, useEffect, useDeferredValue } from "react";
import type { BinaryFiles } from "../../types";
import { useApp } from "../App";
import type { NonDeletedExcalidrawElement } from "../../element/types";
import { ArrowRightIcon } from "../icons";
import "./MermaidToExcalidraw.scss";
import { t } from "../../i18n";
import Trans from "../Trans";
import type { MermaidToExcalidrawLibProps } from "./common";
import {
  convertMermaidToExcalidraw,
  insertToEditor,
  saveMermaidDataToStorage,
} from "./common";
import { TTDDialogPanels } from "./TTDDialogPanels";
import { TTDDialogPanel } from "./TTDDialogPanel";
import { TTDDialogInput } from "./TTDDialogInput";
import { TTDDialogOutput } from "./TTDDialogOutput";
import { EditorLocalStorage } from "../../data/EditorLocalStorage";
import { EDITOR_LS_KEYS } from "../../constants";
import { debounce, isDevEnv } from "../../utils";
import { TTDDialogSubmitShortcut } from "./TTDDialogSubmitShortcut";
import { IlyasAiLibProps } from "./ilyas.common";

const debouncedSaveMermaidDefinition = debounce(saveMermaidDataToStorage, 300);

const TextToDiagram = ({
  ilyasAiLib,
  mermaidToExcalidrawLib
}: {
  ilyasAiLib: IlyasAiLibProps;
  mermaidToExcalidrawLib: MermaidToExcalidrawLibProps;
}) => {
  const [text, setText] = useState("");
  const [aiMermaidText, setAiMermaidText] = useState("");
  const deferredText = useDeferredValue(text.trim());
  const aiMermaidDeferredText = useDeferredValue(aiMermaidText.trim());
  const [error, setError] = useState<Error | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);
  const data = useRef<{
    elements: readonly NonDeletedExcalidrawElement[];
    files: BinaryFiles | null;
  }>({ elements: [], files: null });

  const app = useApp();

  useEffect(() => {
    convertMermaidToExcalidraw({
      canvasRef,
      data,
      mermaidToExcalidrawLib,
      setError,
      mermaidDefinition: aiMermaidDeferredText,
    }).catch((err) => {
      if (isDevEnv()) {
        console.error("Failed to parse instructions definition", err);
      }
    });

    debouncedSaveMermaidDefinition(aiMermaidDeferredText);
  }, [aiMermaidDeferredText, mermaidToExcalidrawLib]);

  useEffect(
    () => () => {
      debouncedSaveMermaidDefinition.flush();
    },
    [],
  );

  const onInsertToEditor = () => {
    insertToEditor({
      app,
      data,
      text,
      shouldSaveMermaidDataToStorage: true,
    });
  };

  return (
    <>
      <div className="ttd-dialog-desc">
        {t("textToDiagram.description")}
      </div>
      <TTDDialogPanels>
        <TTDDialogPanel label={t("textToDiagram.syntax")}>
          <TTDDialogInput
            input={text}
            placeholder={"Describe what you here..."}
            onChange={(event) => setText(event.target.value)}
            onKeyboardSubmit={() => {
              onInsertToEditor();
            }}
          />
        </TTDDialogPanel>
        <TTDDialogPanel
          label={t("textToDiagram.preview")}
          panelAction={{
            action: () => {
              onInsertToEditor();
            },
            label: t("textToDiagram.button"),
            icon: ArrowRightIcon,
          }}
          renderSubmitShortcut={() => <TTDDialogSubmitShortcut />}
        >
          <TTDDialogOutput
            canvasRef={canvasRef}
            loaded={mermaidToExcalidrawLib.loaded}
            error={error}
          />
        </TTDDialogPanel>
      </TTDDialogPanels>
    </>
  );
};
export default TextToDiagram;
