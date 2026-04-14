import { Node, Edge } from "reactflow";
import { C, TreeNode, NodeData } from "./constants";

let nodeIdCounter = 1000;
export const genId = (): string => `n-${++nodeIdCounter}`;

export function treeToFlow(
  node: TreeNode,
  x = 0,
  y = 0,
  parentId: string | null = null,
  edges: Edge[] = [],
  depth = 0
): Node<NodeData>[] {
  const nodes: Node<NodeData>[] = [];
  const flowNode: Node<NodeData> = {
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
  const totalWidth = ((node.children?.length ?? 1) - 1) * childSpacing;
  
  node.children?.forEach((child: TreeNode, i: number) => {
    const cx = x - totalWidth / 2 + i * childSpacing;
    const cy = y + verticalGap;
    const childNodes = treeToFlow(child, cx, cy, node.id, edges, depth + 1);
    nodes.push(...childNodes);
  });
  return nodes;
}
