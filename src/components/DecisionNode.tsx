import { Handle, Position, NodeProps } from "reactflow";
import { Box, Typography, Chip, Paper } from "@mui/material";
import { C, NodeData } from "../constants";

export function DecisionNode({ data, selected }: NodeProps<NodeData>) {
  return (
    <Paper
      elevation={selected ? 8 : 2}
      sx={{
        bgcolor: data.colorSoft || C.accentSoft,
        border: '2px solid',
        borderColor: selected ? (data.color || C.accent) : 'divider',
        borderRadius: 3,
        p: 2,
        minWidth: 200,
        boxShadow: selected ? `0 0 0 3px ${(data.color || C.accent)}44, 0 8px 32px #00000066` : undefined,
        transition: 'all 0.18s',
        cursor: 'grab',
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: data.color || C.accent, border: "none", width: 10, height: 10 }} />
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Typography fontSize={24}>{data.icon || "📦"}</Typography>
        <Typography variant="body2" fontWeight="bold" sx={{ color: data.color || C.accent, letterSpacing: '0.03em' }}>
          {data.label}
        </Typography>
      </Box>
      
      {data.attributes && Object.keys(data.attributes).length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
          {Object.entries(data.attributes).slice(0, 3).map(([k, v]) => (
            <Chip
              key={k}
              label={`${k}: ${v}`}
              size="small"
              sx={{
                bgcolor: `${data.color || C.accent}22`,
                color: data.color || C.accent,
                border: `1px solid ${data.color || C.accent}44`,
                height: 20,
                fontSize: '0.65rem',
                borderRadius: 1,
              }}
            />
          ))}
        </Box>
      )}
      <Handle type="source" position={Position.Bottom} style={{ background: data.color || C.accent, border: "none", width: 10, height: 10 }} />
    </Paper>
  );
}
