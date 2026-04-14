# Decision Tree Editor

A modern, interactive decision tree editor built with **React**, **React Flow**, and **Material UI (MUI)**. This tool allows users to visualize, build, edit, and navigate through complex decision trees in both a node-graph editor and a structured preview layout.

## Features

- **Interactive Node Editor**: Drag, drop, and connect decision nodes using `reactflow`.
- **Material UI Design**: Sleek, modern interface using native `@mui/material` components, with a built-in Dark Mode theme.
- **Node Customization**: Click on any node to open the side drawer, where you can modify the node's:
  - Label
  - Icon (emoji support)
  - Color styling
  - Custom key-value attributes
- **Preview Mode**: Toggle between the graph-based editor and a hierarchical list-based preview mode with collapsible branches.
- **Pre-loaded Seed Data**: Start with example flows like "Customer Support", "Sales Pipeline", and "Product Onboarding".

---

## Installation & Setup

1. **Install dependencies**:
   Make sure you have Node.js installed, then install the required packages:
   ```bash
   npm install react react-dom reactflow
   npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
   npm install --save-dev vite @vitejs/plugin-react
   ```

2. **Start the development server**:
   ```bash
   npm run start
   ```

---

## Basic Usage & Functionality

### Core Architecture
The app dynamically converts a JSON-based tree structure into a flat array of nodes and edges required by React Flow using a recursive function `treeToFlow`.

```javascript
import { treeToFlow } from "./utils";
import { TREES } from "./constants";

// Example of pulling seed data and converting to flow nodes:
const tree = TREES["Customer Support"];
const edgesArr = [];
const flowNodes = treeToFlow(tree, 0, 0, null, edgesArr);

setNodes(flowNodes);
setEdges(edgesArr);
```

### Custom Nodes
We use a custom node component (`DecisionNode.jsx`) injected into React Flow. This allows us to use MUI `<Paper>` and `<Chip>` elements natively on the canvas.

```javascript
import { DecisionNode } from "./components/DecisionNode";

// Define our custom node objects to pass into ReactFlow
const nodeTypes = { decisionNode: DecisionNode };

<ReactFlow
  nodes={nodes}
  edges={edges}
  nodeTypes={nodeTypes}
  onNodesChange={onNodesChange}
  onEdgesChange={onEdgesChange}
  onConnect={onConnect}
/>
```

### Modes
1. **Editor**: The default view where users can click on nodes to spawn the MUI Drawer (`EditPanel.jsx`) and modify attributes, or click `Add Root/Child Nodes` to spawn brand-new boxes on the board.
2. **Preview**: Converts the graph back into a data tree and renders it using MUI nested `Collapse` elements inside `PreviewNode.jsx`.

---

## Managing Custom Attributes

Each node supports arbitrary key-value pairs (stored under `data.attributes`). They are exposed visually via MUI `<Chip>` components inside both the Editor Graph and the Preview mode.

You can modify these freely within the `EditPanel` Drawer:
```javascript
// Adding a new attribute handler
const updateAttr = (index, field, value) => {
  const next = [...attrs];
  // 0 corresponds to Key, 1 corresponds to Value
  next[index] = field === 0 ? [value, next[index][1]] : [next[index][0], value];
  setAttrs(next);
};
```
