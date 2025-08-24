import { graph } from "../graph";

export const generateGraphImageData = async () => {
  const drawableGraph = await graph.getGraphAsync({ xray: true });
  const image = await drawableGraph.drawMermaidPng();
  const arrayBuffer = await image.arrayBuffer();

  return {
    imageData: new Uint8Array(arrayBuffer),
    mimeType: 'image/png',
    size: arrayBuffer.byteLength
  };
}