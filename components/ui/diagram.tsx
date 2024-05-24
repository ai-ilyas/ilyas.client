
import dynamic from "next/dynamic";

// Since client components get prerenderd on server as well hence importing the excalidraw stuff dynamically
// with ssr false
const Excalidraw = dynamic(
  async () => (await import("@/components/wrappers/excalidraw-wrapper")).default,
  {
    ssr: false,
  },
);

function Diagram (){
  return <Excalidraw></Excalidraw>;
}

export { Diagram };
