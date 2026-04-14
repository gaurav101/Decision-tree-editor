import { useState, useCallback } from "react";
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { Box, Drawer, Typography, Toolbar, Button, Paper, ToggleButtonGroup, ToggleButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { C, TREES } from "./constants";
import { genId, treeToFlow } from "./utils";
import { DecisionNode } from "./components/DecisionNode";
import { PreviewNode } from "./components/PreviewNode";
import { EditPanel } from "./components/EditPanel";

const nodeTypes = { decisionNode: DecisionNode };
const drawerWidth = 260;

export default function App() {
  const [selectedTree, setSelectedTree] = useState(null);
  const [mode, setMode] = useState("editor"); // "editor" | "preview"
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [treeData, setTreeData] = useState(null);
  const [previewRoot, setPreviewRoot] = useState(null);

  const loadTree = (treeName) => {
    const tree = TREES[treeName];
    if (!tree) return;
    setSelectedTree(treeName);
    setTreeData(JSON.parse(JSON.stringify(tree)));
    setPreviewRoot(null);
    setSelectedNode(null);
    const edgesArr = [];
    const flowNodes = treeToFlow(tree, 0, 0, null, edgesArr);
    setNodes(flowNodes);
    setEdges(edgesArr);
  };

  const onConnect = useCallback((params) => {
    setEdges(eds => addEdge({ ...params, style: { stroke: C.border, strokeWidth: 2 } }, eds));
  }, [setEdges]);

  const onNodeClick = useCallback((_, node) => {
    setSelectedNode(node);
  }, []);

  const addChildNode = () => {
    if (!selectedNode) return;
    const newId = genId();
    const newNode = {
      id: newId,
      type: "decisionNode",
      position: { x: selectedNode.position.x + 20, y: selectedNode.position.y + 160 },
      data: {
        label: "New Node",
        icon: "📦",
        color: C.accent,
        colorSoft: C.accentSoft,
        attributes: {},
      },
    };
    const newEdge = {
      id: `e-${selectedNode.id}-${newId}`,
      source: selectedNode.id,
      target: newId,
      style: { stroke: C.border, strokeWidth: 2 },
    };
    setNodes(ns => [...ns, newNode]);
    setEdges(es => [...es, newEdge]);
    setSelectedNode(newNode);
  };

  const addRootNode = () => {
    const newId = genId();
    const newNode = {
      id: newId,
      type: "decisionNode",
      position: { x: Math.random() * 400, y: Math.random() * 200 },
      data: { label: "New Root", icon: "🌱", color: C.green, colorSoft: C.greenSoft, attributes: {} },
    };
    setNodes(ns => [...ns, newNode]);
    setSelectedNode(newNode);
  };

  const saveNode = (updatedNode) => {
    setNodes(ns => ns.map(n => n.id === updatedNode.id ? updatedNode : n));
    setSelectedNode(updatedNode);
  };

  const deleteNode = (nodeId) => {
    setNodes(ns => ns.filter(n => n.id !== nodeId));
    setEdges(es => es.filter(e => e.source !== nodeId && e.target !== nodeId));
    setSelectedNode(null);
  };

  const buildTreeFromFlow = () => {
    const nodeMap = {};
    nodes.forEach(n => { nodeMap[n.id] = { ...n.data, id: n.id, children: [] }; });
    edges.forEach(e => {
      if (nodeMap[e.source] && nodeMap[e.target]) {
        nodeMap[e.source].children.push(nodeMap[e.target]);
      }
    });
    const childIds = new Set(edges.map(e => e.target));
    return nodes.filter(n => !childIds.has(n.id)).map(n => nodeMap[n.id]);
  };

  const roots = mode === "preview" ? buildTreeFromFlow() : [];
  const editorRightPad = selectedNode && mode === "editor" ? 340 : 0;

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      
      {/* ── Left Panel ───────────────────────────────────────────────────────── */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
          <Typography variant="h6" color="primary" fontWeight="bold" letterSpacing={1}>🌿 TreeFlow</Typography>
          <Typography variant="caption" color="text.secondary">Decision Tree Editor</Typography>
        </Box>

        <Box sx={{ p: 1.5 }}>
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={(_, newMode) => newMode && setMode(newMode)}
            fullWidth
            size="small"
            sx={{ mb: 2 }}
          >
            <ToggleButton value="editor">
              <EditIcon fontSize="small" sx={{ mr: 1 }} /> Editor
            </ToggleButton>
            <ToggleButton value="preview">
              <VisibilityIcon fontSize="small" sx={{ mr: 1 }} /> Preview
            </ToggleButton>
          </ToggleButtonGroup>

          <Typography variant="caption" color="text.secondary" fontWeight="bold" mb={1} display="block" letterSpacing={1}>
            ROOT NODES
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {Object.entries(TREES).map(([name, tree]) => {
              const isSelected = selectedTree === name;
              return (
                <Paper
                  key={name}
                  onClick={() => loadTree(name)}
                  elevation={isSelected ? 4 : 1}
                  sx={{
                    p: 1.5,
                    cursor: 'pointer',
                    bgcolor: isSelected ? tree.colorSoft : 'background.paper',
                    border: '1px solid',
                    borderColor: isSelected ? tree.color : 'divider',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: isSelected ? tree.colorSoft : 'action.hover',
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography fontSize={20}>{tree.icon}</Typography>
                    <Box>
                      <Typography variant="body2" fontWeight={isSelected ? 700 : 500} color={isSelected ? tree.color : "text.primary"}>
                        {name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">{tree.children?.length} branches</Typography>
                    </Box>
                  </Box>
                </Paper>
              );
            })}
          </Box>
        </Box>

        {mode === "editor" && (
          <Box sx={{ mt: 'auto', p: 2, borderTop: 1, borderColor: "divider" }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addRootNode}
              sx={{ color: C.accent, borderColor: `${C.accent}44`, bgcolor: C.accentSoft, mb: 1, '&:hover': { bgcolor: `${C.accent}22` } }}
            >
              New Root Node
            </Button>
            {selectedNode && (
              <Button
                fullWidth
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addChildNode}
                sx={{ color: C.green, borderColor: `${C.green}44`, bgcolor: C.greenSoft, '&:hover': { bgcolor: `${C.green}22` } }}
              >
                Add Child Node
              </Button>
            )}
          </Box>
        )}
      </Drawer>

      {/* ── Main Area ─────────────────────────────────────────────────────────── */}
      <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Toolbar sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper', minHeight: '50px !important' }}>
          {selectedTree ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography fontSize={20}>{TREES[selectedTree]?.icon}</Typography>
              <Typography variant="subtitle2" fontWeight={600}>{selectedTree}</Typography>
              <Typography variant="caption" color="text.secondary">• {nodes.length} nodes • {edges.length} edges</Typography>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">← Select a root node to begin</Typography>
          )}

          <Box sx={{ flexGrow: 1 }} />
          
          {mode === "preview" && previewRoot && (
            <Button
              size="small"
              startIcon={<ArrowBackIcon />}
              onClick={() => setPreviewRoot(null)}
              sx={{ color: C.accent, bgcolor: C.accentSoft, border: `1px solid ${C.accent}44` }}
            >
              Back to roots
            </Button>
          )}
        </Toolbar>

        <Box sx={{ flexGrow: 1, position: 'relative' }}>
          {mode === "editor" ? (
            selectedTree ? (
               <Box sx={{ width: `calc(100% - ${editorRightPad}px)`, height: "100%", transition: "width 0.2s" }}>
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  onNodeClick={onNodeClick}
                  nodeTypes={nodeTypes}
                  fitView
                >
                  <Background color={C.border} gap={24} size={1} />
                  <Controls />
                  <MiniMap nodeColor={n => n.data?.color || C.accent} />
                </ReactFlow>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                 <Typography color="text.secondary">Select a root node from the left panel to start editing</Typography>
              </Box>
            )
          ) : (
             <Box sx={{ p: 4, height: '100%', overflowY: 'auto' }}>
              {!selectedTree ? (
                 <Typography align="center" color="text.secondary" mt={8}>Select a root node from the left panel</Typography>
              ) : previewRoot ? (
                <Box>
                  <Typography variant="caption" color="text.secondary" mb={2} display="block">
                    Navigated into: <Box component="span" sx={{ color: previewRoot.color }}>{previewRoot.label}</Box>
                  </Typography>
                  <PreviewNode node={previewRoot} onNavigate={setPreviewRoot} depth={0} />
                </Box>
              ) : (
                 <Box>
                   <Typography variant="caption" color="text.secondary" mb={2} display="block" letterSpacing={1}>
                     TREE OVERVIEW • {selectedTree}
                   </Typography>
                   {roots.map(root => (
                     <PreviewNode key={root.id} node={root} onNavigate={setPreviewRoot} depth={0} />
                   ))}
                 </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>

      {/* ── Edit Side Panel ────────────────────────────────────────────────────── */}
      {selectedNode && mode === "editor" && (
        <EditPanel
          node={selectedNode}
          onSave={saveNode}
          onClose={() => setSelectedNode(null)}
          onDelete={deleteNode}
        />
      )}
    </Box>
  );
}
