import { CoreTool, GenerateTextResult } from "ai"

export interface IlyasAiLibProps {
    loaded: boolean;
    api: Promise<{
      getMermaidFromPrompt: (prompt: string) => Promise<GenerateTextResult<Record<string, CoreTool>>>;
    }>;
  }

// interface ConvertMermaidToExcalidrawFormatProps {
//   canvasRef: React.RefObject<HTMLDivElement>;
//   mermaidToExcalidrawLib: MermaidToExcalidrawLibProps;
//   mermaidDefinition: string;
//   setError: (error: Error | null) => void;
//   data: React.MutableRefObject<{
//     elements: readonly NonDeletedExcalidrawElement[];
//     files: BinaryFiles | null;
//   }>;
// }

// export const convertMermaidToExcalidraw = async ({
//   canvasRef,
//   mermaidToExcalidrawLib,
//   mermaidDefinition,
//   setError,
//   data,
// }: ConvertMermaidToExcalidrawFormatProps) => {
//   const canvasNode = canvasRef.current;
//   const parent = canvasNode?.parentElement;

//   if (!canvasNode || !parent) {
//     return;
//   }

//   if (!mermaidDefinition) {
//     resetPreview({ canvasRef, setError });
//     return;
//   }

//   try {
//     const api = await mermaidToExcalidrawLib.api;

//     let ret;
//     try {
//       ret = await api.parseMermaidToExcalidraw(mermaidDefinition, {
//         fontSize: DEFAULT_FONT_SIZE,
//       });
//     } catch (err: any) {
//       ret = await api.parseMermaidToExcalidraw(
//         mermaidDefinition.replace(/"/g, "'"),
//         {
//           fontSize: DEFAULT_FONT_SIZE,
//         },
//       );
//     }
//     const { elements, files } = ret;
//     setError(null);

//     data.current = {
//       elements: convertToExcalidrawElements(elements, {
//         regenerateIds: true,
//       }),
//       files,
//     };

//     const canvas = await exportToCanvas({
//       elements: data.current.elements,
//       files: data.current.files,
//       exportPadding: DEFAULT_EXPORT_PADDING,
//       maxWidthOrHeight:
//         Math.max(parent.offsetWidth, parent.offsetHeight) *
//         window.devicePixelRatio,
//     });
//     // if converting to blob fails, there's some problem that will
//     // likely prevent preview and export (e.g. canvas too big)
//     try {
//       await canvasToBlob(canvas);
//     } catch (e: any) {
//       if (e.name === "CANVAS_POSSIBLY_TOO_BIG") {
//         throw new Error(t("canvasError.canvasTooBig"));
//       }
//       throw e;
//     }
//     parent.style.background = "var(--default-bg-color)";
//     canvasNode.replaceChildren(canvas);
//   } catch (err: any) {
//     parent.style.background = "var(--default-bg-color)";
//     if (mermaidDefinition) {
//       setError(err);
//     }

//     throw err;
//   }
// };
  