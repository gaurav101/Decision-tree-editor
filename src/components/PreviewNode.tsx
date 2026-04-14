import { useState } from "react";
import { Box, Paper, Typography, Button, Collapse, Chip } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { TreeNode } from "../constants";

export interface PreviewNodeProps {
  node: TreeNode;
  onNavigate: (node: TreeNode) => void;
  depth?: number;
}

export function PreviewNode({ node, onNavigate, depth = 0 }: PreviewNodeProps) {
  const [expanded, setExpanded] = useState(depth < 1);
  const hasChildren = (node.children?.length ?? 0) > 0;

  return (
    <Box sx={{ ml: depth * 3, mt: 1.5 }}>
      <Paper
        elevation={0}
        onClick={() => hasChildren && setExpanded(!expanded)}
        sx={{
          bgcolor: node.colorSoft,
          border: '1.5px solid',
          borderColor: `${node.color}55`,
          borderRadius: 2,
          p: 1.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          cursor: hasChildren ? 'pointer' : 'default',
          transition: 'background 0.15s',
          '&:hover': {
            bgcolor: hasChildren ? `${node.colorSoft}dd` : node.colorSoft,
          }
        }}
      >
        <Typography fontSize={22}>{node.icon}</Typography>
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" fontWeight="bold" sx={{ color: node.color }}>
            {node.label}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
            {Object.entries(node.attributes || {}).map(([k, v]) => (
               <Chip
                 key={k}
                 label={`${k}: ${v}`}
                 size="small"
                 sx={{ 
                   bgcolor: `${node.color}22`,
                   color: node.color,
                   border: `1px solid ${node.color}33`,
                   height: 18,
                   fontSize: '0.6rem',
                   borderRadius: 1
                 }}
               />
            ))}
          </Box>
        </Box>
        
        {hasChildren && (
          <Box sx={{ color: node.color, display: 'flex', alignItems: 'center' }}>
            {expanded ? <KeyboardArrowDownIcon fontSize="small" /> : <KeyboardArrowRightIcon fontSize="small" />}
          </Box>
        )}
        
        {hasChildren && (
          <Button
            size="small"
            endIcon={<ArrowForwardIcon />}
            onClick={(e) => { e.stopPropagation(); onNavigate(node); }}
            sx={{
              minWidth: 0,
              bgcolor: `${node.color}22`,
              border: `1px solid ${node.color}44`,
              color: node.color,
              borderRadius: 1.5,
              py: 0.25,
              px: 1.5,
              fontSize: '0.7rem',
              '&:hover': { bgcolor: `${node.color}44` }
            }}
          >
            Open
          </Button>
        )}
      </Paper>
      
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        {node.children?.map(child => (
          <PreviewNode key={child.id} node={child} onNavigate={onNavigate} depth={depth + 1} />
        ))}
      </Collapse>
    </Box>
  );
}
