// === Customizable Color Scheme ===
const COLOR_DIM = "rgba(220,220,220,0.3)";             // Faded background for non-relevant nodes
const COLOR_SECOND_DEGREE = "rgba(0, 0, 243, 0.6)";
const COLOR_FIRST_DEGREE = "rgba(178, 25, 221, 0.85)";
const COLOR_SELECTED = "rgba(0,180,255,1)";         // Selected node

function neighbourhoodHighlight(params) {
  allNodes = nodes.get({ returnType: "Object" });

  if (params.nodes.length > 0) {
    highlightActive = true;
    const selectedNode = params.nodes[0];
    const degrees = 2;

    // Dim all nodes and hide labels
    for (let nodeId in allNodes) {
      allNodes[nodeId].color = COLOR_DIM;
      if (allNodes[nodeId].hiddenLabel === undefined) {
        allNodes[nodeId].hiddenLabel = allNodes[nodeId].label;
        allNodes[nodeId].label = undefined;
      }
    }

    // First-degree neighbors
    let connectedNodes = network.getConnectedNodes(selectedNode);
    let allConnectedNodes = [];

    // Get second-degree neighbors
    for (let i = 1; i < degrees; i++) {
      for (let j = 0; j < connectedNodes.length; j++) {
        allConnectedNodes = allConnectedNodes.concat(
          network.getConnectedNodes(connectedNodes[j])
        );
      }
    }

    // Restore second-degree neighbors with lighter color
    for (let nodeId of allConnectedNodes) {
      allNodes[nodeId].color = COLOR_SECOND_DEGREE;
      if (allNodes[nodeId].hiddenLabel !== undefined) {
        allNodes[nodeId].label = allNodes[nodeId].hiddenLabel;
        delete allNodes[nodeId].hiddenLabel;
      }
    }

    // Restore first-degree neighbors
    for (let nodeId of connectedNodes) {
      allNodes[nodeId].color = COLOR_FIRST_DEGREE;
      if (allNodes[nodeId].hiddenLabel !== undefined) {
        allNodes[nodeId].label = allNodes[nodeId].hiddenLabel;
        delete allNodes[nodeId].hiddenLabel;
      }
    }

    // Restore selected node
    allNodes[selectedNode].color = COLOR_SELECTED;
    if (allNodes[selectedNode].hiddenLabel !== undefined) {
      allNodes[selectedNode].label = allNodes[selectedNode].hiddenLabel;
      delete allNodes[selectedNode].hiddenLabel;
    }

  } else if (highlightActive === true) {
    // Reset node colors and labels
    for (let nodeId in allNodes) {
      allNodes[nodeId].color = nodeColors[nodeId];
      if (allNodes[nodeId].hiddenLabel !== undefined) {
        allNodes[nodeId].label = allNodes[nodeId].hiddenLabel;
        delete allNodes[nodeId].hiddenLabel;
      }
    }
    highlightActive = false;
  }

  // Update graph
  const updateArray = Object.values(allNodes);
  nodes.update(updateArray);
}

function filterHighlight(params) {
  allNodes = nodes.get({ returnType: "Object" });

  if (params.nodes.length > 0) {
    filterActive = true;
    const selectedNodes = params.nodes;

    // Hide all nodes and remove labels
    for (let nodeId in allNodes) {
      allNodes[nodeId].hidden = true;
      if (allNodes[nodeId].savedLabel === undefined) {
        allNodes[nodeId].savedLabel = allNodes[nodeId].label;
        allNodes[nodeId].label = undefined;
      }
    }

    // Unhide only selected nodes and restore labels
    for (let nodeId of selectedNodes) {
      allNodes[nodeId].hidden = false;
      if (allNodes[nodeId].savedLabel !== undefined) {
        allNodes[nodeId].label = allNodes[nodeId].savedLabel;
        delete allNodes[nodeId].savedLabel;
      }
    }

  } else if (filterActive === true) {
    // Reset all nodes to visible
    for (let nodeId in allNodes) {
      allNodes[nodeId].hidden = false;
      if (allNodes[nodeId].savedLabel !== undefined) {
        allNodes[nodeId].label = allNodes[nodeId].savedLabel;
        delete allNodes[nodeId].savedLabel;
      }
    }
    filterActive = false;
  }

  // Update graph
  const updateArray = Object.values(allNodes);
  nodes.update(updateArray);
}

function selectNode(nodes) {
  network.selectNodes(nodes);
  neighbourhoodHighlight({ nodes: nodes });
  return nodes;
}

function selectNodes(nodes) {
  network.selectNodes(nodes);
  filterHighlight({ nodes: nodes });
  return nodes;
}

// Filter function: highlights nodes or edges based on a property-value pair
function highlightFilter(filter) {
  const selectedNodes = [];
  const selectedProp = filter['property'];

  if (filter['item'] === 'node') {
    const allNodes = nodes.get({ returnType: "Object" });
    for (let nodeId in allNodes) {
      const propValue = allNodes[nodeId][selectedProp];
      if (propValue && filter['value'].includes(String(propValue))) {
        selectedNodes.push(nodeId);
      }
    }

  } else if (filter['item'] === 'edge') {
    const allEdges = edges.get({ returnType: "object" });
    for (let edgeId in allEdges) {
      const edge = allEdges[edgeId];
      const propValue = edge[selectedProp];
      if (propValue && filter['value'].includes(String(propValue))) {
        selectedNodes.push(edge.from, edge.to);
      }
    }
  }

  // Remove duplicates before selecting
  selectNodes([...new Set(selectedNodes)]);
}
