Working with React Flow requires a specific schema (an array of nodes and edges), while your backend likely prefers a nested tree or a flat adjacency list.

The most efficient way to handle this is to write two utility functions: one to "flatten" your data for the UI and one to "serialize" it back for storage.

1. Transforming JSON to React Flow (Tree to Flat)
React Flow nodes don't physically "nest" in the data array; they are positioned via coordinates. To create a tree-like layout automatically, you should assign position values based on the node's depth.

The Input JSON
JSON
[
  { "id": "1", "name": "Root", "parentId": null },
  { "id": "2", "name": "Child A", "parentId": "1" },
  { "id": "3", "name": "Child B", "parentId": "1" }
]
The Logic
JavaScript
const transformToFlow = (data) => {
  const nodes = [];
  const edges = [];
  
  data.forEach((item, index) => {
    // 1. Create the Node
    nodes.push({
      id: item.id,
      data: { label: item.name },
      // Simple layout logic: increment Y for each level
      position: { x: Math.random() * 400, y: index * 100 }, 
    });

    // 2. Create the Edge if a parent exists
    if (item.parentId) {
      edges.push({
        id: `e${item.parentId}-${item.id}`,
        source: item.parentId,
        target: item.id,
      });
    }
  });

  return { nodes, edges };
};
2. Converting Back to JSON Array
When the user adds a node or edge in React Flow, you need to reconstruct your original format. The key here is looking at the Edges to determine the parentId.

The Logic
JavaScript
const transformToJSON = (nodes, edges) => {
  return nodes.map((node) => {
    // Find the edge where this node is the target to identify the parent
    const connection = edges.find((edge) => edge.target === node.id);
    
    return {
      id: node.id,
      name: node.data.label,
      parentId: connection ? connection.source : null,
    };
  });
};
3. Best Practices for Tree Layouts
React Flow doesn't automatically position nodes in a tree structure. For a professional "tree" look, I recommend using the Dagre library alongside the functions above.

Initial Load: Run your JSON through transformToFlow, then pass the result to a Dagre layout function to calculate precise x and y coordinates.

On Save: Simply call transformToJSON(nodes, edges) and send that array back to your database.

Node IDs: Ensure your ID generation is consistent (e.g., using UUIDs) so that when you convert back and forth, the parentId references don't break.

Pro Tip: If you want to handle "Sub-flows" (nodes physically inside other nodes), React Flow uses a parentNode property inside the node object itself, which maps perfectly to your parentId field.

Would you like to see how to integrate the Dagre library to make the tree layout look perfectly symmetrical?
