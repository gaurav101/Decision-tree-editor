import { C } from './constants';

let nodeIdCounter = 1000;
export const genId = () => `n-${++nodeIdCounter}`;

export function treeToFlow(node, x = 0, y = 0, parentId = null, edges = [], depth = 0) {
  const nodes = [];
  const flowNode = {
    id: node.id,
    type: "decisionNode",
    position: { x, y },
    data: { ...node, children: undefined },
  };
  nodes.push(flowNode);
  if (parentId) {
    edges.push({
      id: `e-${parentId}-${node.id}`,
      source: parentId,
      target: node.id,
      type: "smoothstep",
      animated: false,
      style: { stroke: C.border, strokeWidth: 2 },
    });
  }
  const childSpacing = 280;
  const verticalGap = 160;
  const totalWidth = (node.children?.length - 1) * childSpacing;
  node.children?.forEach((child, i) => {
    const cx = x - totalWidth / 2 + i * childSpacing;
    const cy = y + verticalGap;
    const childNodes = treeToFlow(child, cx, cy, node.id, edges, depth + 1);
    nodes.push(...childNodes);
  });
  return nodes;
}
