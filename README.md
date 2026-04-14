# Decision Tree Editor

A modern, strictly-typed interactive decision tree editor built with **React**, **React Flow**, **Material UI (MUI)**, and **TypeScript**. This tool allows users to visualize, build, edit, and navigate through complex decision trees in both a node-graph editor and a structured preview layout.

## Features

- **Interactive Node Editor**: Drag, drop, and connect decision nodes seamlessly using `reactflow`.
- **Material UI Design**: Sleek, modern interface using native `@mui/material` components, with a built-in Dark Mode theme.
- **Strictly Typed**: Fully built with TypeScript using explicit models and interfaces for predictability and safety.
- **Node Customization**: Click on any node to open the side drawer, where you can modify the node's:
  - Label
  - Icon (emoji support)
  - Color styling
  - Custom key-value attributes
- **Preview Mode**: Toggle between the graph-based editor and a hierarchical list-based preview mode with collapsible branches.
- **Pre-loaded Seed Data**: Start with example flows like "Customer Support", "Sales Pipeline", and "Product Onboarding".

---

## Tech Stack & Dependencies

This application uses the following major libraries and dependencies:

### Core
- **[React](https://react.dev/)**: Core component rendering logic (`react`, `react-dom`).
- **[TypeScript](https://www.typescriptlang.org/)**: Static type checking and interfaces.
- **[Vite](https://vitejs.dev/)**: Ultra-fast frontend build tool and local dev server.

### UI & Styling
- **[Material UI (MUI)](https://mui.com/)**: Primary UI layout system (`@mui/material`). Utilizes standard components like `Drawer`, `Paper`, `Box`, and `TextField`.
- **[Emotion](https://emotion.sh/)**: Required CSS-in-JS compilation engine for MUI (`@emotion/react`, `@emotion/styled`).
- **[MUI Icons](https://mui.com/material-ui/material-icons/)**: Standardized icons used across the application for buttons and layout structure (`@mui/icons-material`).

### Logic & Canvas Engine
- **[React Flow](https://reactflow.dev/)**: A highly customizable library for building node-based graphical interfaces (`reactflow`). We use this to render the draggable decision tree on an HTML5 canvas.

---

## Installation & Setup

1. **Install all dependencies**:
   Make sure you have Node.js installed, then install the packages utilizing `npm`:
   ```bash
   npm install
   ```

2. **Start the Vite development server**:
   ```bash
   npm run start
   ```

---

## Underlying Architecture

### Core Data Models
The application relies on explicitly typed structures internally (found in `src/constants.ts`):
```typescript
export interface NodeData {
  label: string;
  icon: string;
  color: string;
  colorSoft: string;
  attributes: NodeAttributes;
  children?: TreeNode[]; // Used when iterating the graph layout hierarchically
}
```

### Graph Conversion Logic
The app dynamically converts a typical JSON-based hierarchical tree structure into a flat array of nodes and edges required by React Flow using a recursive function `treeToFlow`.

```typescript
import { treeToFlow } from "./utils";
import { TREES } from "./constants";

// Example of pulling seed data and converting to flow nodes:
const tree = TREES["Customer Support"];
const edgesArr: Edge[] = [];
// This builds the x/y positions and relations for React Flow naturally
const flowNodes: Node[] = treeToFlow(tree, 0, 0, null, edgesArr);

setNodes(flowNodes);
setEdges(edgesArr);
```

### Custom Nodes Rendering
We use a custom node component (`DecisionNode.tsx`) injected into React Flow. This allows us to use MUI `<Paper>` and `<Chip>` elements natively on the flow canvas, binding directly to `<Handle>` endpoints.

```typescript
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
