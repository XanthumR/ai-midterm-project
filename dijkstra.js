async function dijkstra(graph, startNode, endNode) {

  class PriorityQueue {
    constructor() {
      this.heap = [];
    }

    enqueue(element, priority) {
      this.heap.push({ element, priority });
      this.bubbleUp(this.heap.length - 1);
    }

    dequeue() {
      const min = this.heap[0];
      const end = this.heap.pop();
      if (this.heap.length > 0) {
        this.heap[0] = end;
        this.bubbleDown(0);
      }
      return min;
    }

    bubbleUp(idx) {
      const element = this.heap[idx];
      while (idx > 0) {
        const parentIdx = Math.floor((idx - 1) / 2);
        const parent = this.heap[parentIdx];
        if (element.priority >= parent.priority) break;
        this.heap[idx] = parent;
        idx = parentIdx;
      }
      this.heap[idx] = element;
    }

    bubbleDown(idx) {
      const length = this.heap.length;
      const element = this.heap[idx];
      while (true) {
        let leftIdx = 2 * idx + 1;
        let rightIdx = 2 * idx + 2;
        let swap = null;

        if (leftIdx < length) {
          const left = this.heap[leftIdx];
          if (left.priority < element.priority) swap = leftIdx;
        }

        if (rightIdx < length) {
          const right = this.heap[rightIdx];
          if (
            (swap === null && right.priority < element.priority) ||
            (swap !== null && right.priority < this.heap[swap].priority)
          ) {
            swap = rightIdx;
          }
        }

        if (swap === null) break;
        this.heap[idx] = this.heap[swap];
        idx = swap;
      }
      this.heap[idx] = element;
    }

    isEmpty() {
      return this.heap.length === 0;
    }
  }

  const distances = {};
  const previous = {};
  const visited = new Set();
  const pq = new PriorityQueue();

  graph.nodes.forEach(node => {
    distances[node] = Infinity;
    previous[node] = null;
  });

  distances[startNode] = 0;
  pq.enqueue(startNode, 0);

  while (!pq.isEmpty()) {
    const { element: currentNode } = pq.dequeue();

    if (visited.has(currentNode)) continue;
    visited.add(currentNode);

    if (currentNode === endNode) break;

    if (!graph.edges[currentNode]) continue;

    for (const neighbor of graph.edges[currentNode]) {
      const alt = distances[currentNode] + neighbor.weight;
      if (alt < distances[neighbor.node]) {
        distances[neighbor.node] = alt;
        previous[neighbor.node] = currentNode;
        pq.enqueue(neighbor.node, alt);
      }
    }
  }

  // Reconstruct path
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
