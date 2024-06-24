
import dynamic from "next/dynamic";

// Since client components get prerenderd on server as well hence importing the excalidraw stuff dynamically
// with ssr false
const Excalidraw = dynamic(
  async () => (await import("@/src/lib/presenter/components/wrappers/excalidraw-wrapper")).default,
  {
    ssr: false,
  },
);

function Canvas (){
  return <Excalidraw></Excalidraw>;
}

export { Canvas };
