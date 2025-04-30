

async function dijkstra(graph, startNode, endNode) {
    const distances = {};
    const previous = {};
    const visited = new Set(); 
    const queue = new Set(graph.nodes);
    
    graph.nodes.forEach(node => {
      distances[node] = Infinity;
      previous[node] = null;
    });

    
    distances[startNode] = 0; 

  
    while (queue.size > 0) {

      let currentNode = [...queue].reduce((minNode, node) => (
        distances[node] < distances[minNode] ? node : minNode
      ));
  
      if (currentNode === endNode) {
        break;
      }
  
      queue.delete(currentNode);
      visited.add(currentNode);
  
      if (!graph.edges[currentNode]) continue; 
  
      for (const neighbor of graph.edges[currentNode]) {
        const alt = distances[currentNode] + neighbor.weight;
        if (alt < distances[neighbor.node]) {
          distances[neighbor.node] = alt;
          previous[neighbor.node] = currentNode;
        }
      }
    }
  
    // Reconstruct the shortest path
    const path = [];
    let current = endNode;
    while (current) {
      path.unshift(current);
      current = previous[current];
    }
  
    if (path.length === 1 && path[0] !== startNode) {
      return []; // No path found
    }
  
    return path;
  }
  