import { savedObjectsMigrationsGraph } from "../modules/saved_objects_migrations";
import { graph } from "../graph";
import { graphDefinitions } from "../graphs_definitions";

const getGraphFromDefinition = (graphId: string) => {
  const graphDefinition = graphDefinitions.find((graph) => graph.graphId === graphId);
  if (!graphDefinition) {
    throw new Error(`Graph with id ${graphId} not found`);
  }
  switch (graphId) {
    case 'code-checker':
      return graph;
    case 'so-migrations':
      return savedObjectsMigrationsGraph;
    default:
      throw new Error(`Graph with id ${graphId} not found`);
  }
}

export const generateGraphImageData = async (graphId: string) => {
  const drawableGraph = await getGraphFromDefinition(graphId).getGraphAsync({
    xray: true,
  });
  const image = await drawableGraph.drawMermaidPng({});
  const arrayBuffer = await image.arrayBuffer();

  return {
    imageData: new Uint8Array(arrayBuffer),
    mimeType: 'image/png',
    size: arrayBuffer.byteLength
  };
}