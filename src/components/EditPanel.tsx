import { useState, useEffect } from "react";
import { Node } from "reactflow";
import { Drawer, Box, Typography, IconButton, TextField, Button, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import SaveIcon from "@mui/icons-material/Save";
import { C, NodeData } from "../constants";

const COLORS = [C.accent, C.green, C.amber, C.red, "#b57bee", "#f76eb4"];

export interface EditPanelProps {
  node: Node<NodeData>;
  onSave: (node: Node<NodeData>) => void;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export function EditPanel({ node, onSave, onClose, onDelete }: EditPanelProps) {
  const [label, setLabel] = useState<string>(node.data?.label || "");
  const [icon, setIcon] = useState<string>(node.data?.icon || "📦");
  const [color, setColor] = useState<string>(node.data?.color || C.accent);
  const [attrs, setAttrs] = useState<[string, string][]>(Object.entries(node.data?.attributes || {}));

  useEffect(() => {
    if (node) {
      setLabel(node.data?.label || "");
      setIcon(node.data?.icon || "📦");
      setColor(node.data?.color || C.accent);
      setAttrs(Object.entries(node.data?.attributes || {}));
    }
  }, [node]);

  const updateAttr = (i: number, field: 0 | 1, val: string) => {
    const next = [...attrs] as [string, string][];
    next[i] = field === 0 ? [val, next[i][1]] : [next[i][0], val];
    setAttrs(next);
  };

  const save = () => {
    onSave({
      ...node,
      data: {
        ...node.data,
        label,
        icon,
        color,
        colorSoft: color + "22",
        attributes: Object.fromEntries(attrs.filter(([k]) => k.trim() !== "")),
      },
    });
  };

  return (
    <Drawer
      anchor="right"
      open={!!node}
      onClose={onClose}
      variant="persistent"
      sx={{
        width: 340,
        flexShrink: 0,
        '& .MuiDrawer-paper': { width: 340, boxSizing: 'border-box', p: 3 },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight="bold">Edit Node</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <TextField
          label="Label"
          size="small"
          fullWidth
          value={label}
          onChange={e => setLabel(e.target.value)}
          variant="outlined"
        />
        
        <TextField
          label="Icon (Emoji)"
          size="small"
          fullWidth
          value={icon}
          onChange={e => setIcon(e.target.value)}
          variant="outlined"
        />

        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight="bold" display="block" mb={1}>
            COLOR
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {COLORS.map(c => (
              <Box
                key={c}
                onClick={() => setColor(c)}
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  bgcolor: c,
                  cursor: 'pointer',
                  border: color === c ? '3px solid #fff' : '2px solid transparent',
                  boxShadow: color === c ? `0 0 0 2px ${c}` : 'none',
                  transition: 'all 0.2s'
                }}
              />
            ))}
          </Box>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography variant="caption" color="text.secondary" fontWeight="bold">
              ATTRIBUTES
            </Typography>
            <Button
              size="small"
              startIcon={<AddIcon />}
              onClick={() => setAttrs([...attrs, ["", ""]])}
              sx={{ color: C.accent, bgcolor: `${C.accent}22`, py: 0.25 }}
            >
              Add
            </Button>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {attrs.map(([k, v], i) => (
              <Box key={i} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  placeholder="Key"
                  size="small"
                  value={k}
                  onChange={e => updateAttr(i, 0, e.target.value)}
                  sx={{ flex: 1 }}
                />
                <TextField
                  placeholder="Value"
                  size="small"
                  value={v}
                  onChange={e => updateAttr(i, 1, e.target.value)}
                  sx={{ flex: 1.5 }}
                />
                <IconButton onClick={() => setAttrs(attrs.filter((_, j) => j !== i))} color="error" size="small">
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
            {attrs.length === 0 && (
              <Typography variant="body2" color="text.secondary" align="center" mt={1}>
                No attributes added
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={save}
            startIcon={<SaveIcon />}
            sx={{ bgcolor: C.accent, '&:hover': { bgcolor: C.accent + 'dd' }, py: 1 }}
          >
            Save Changes
          </Button>
          <Button
            variant="outlined"
            color="error"
            fullWidth
            onClick={() => onDelete(node.id)}
            startIcon={<DeleteForeverRoundedIcon />}
          >
            Delete Node
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
