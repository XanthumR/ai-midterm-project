import osmnx as ox
from osmnx._errors import InsufficientResponseError,ResponseStatusCodeError
import json
from flask import Flask, request, jsonify
from flask_cors import CORS 

app = Flask(__name__)
CORS(app)






@app.route('/get_graph_data', methods=['GET'])
def get_graph_data():
    click = int(request.args.get('click'))
    lat1 = float(request.args.get('lat1'))
    lon1 = float(request.args.get('lon1'))
    if click == 2:
        lat2 = float(request.args.get('lat2'))
        lon2 = float(request.args.get('lon2'))
        north = max(lat1, lat2) + 0.02
        south = min(lat1, lat2) - 0.02
        east = max(lon1, lon2) + 0.02
        west = min(lon1, lon2) - 0.02


    
    print("started downloading")
    if click <= 1:
            try:
                G = ox.graph_from_point((lat1,lon1), dist=100,network_type='drive', simplify=True)
            except Exception:
                 return jsonify({"error": 1000})
    else:
        G = ox.graph_from_bbox((west,south,east,north), network_type='drive', simplify=True)
    print("downloaded")
    
    if len(G.nodes) == 0:
        return 1000

    nodes = {}
    edges = {}

    for node, data in G.nodes(data=True):
        nodes[str(node)] = [data['y'], data['x']] 

    for u, v, data in G.edges(data=True):
        u, v = str(u), str(v)
        if u not in edges:
            edges[u] = []
        edges[u].append({"node": v, "weight": data['length']})  


    graph_data = {
        "nodes": list(nodes.keys()),
        "edges": edges,
        "coordinates": nodes
    }


    with open("graph-data.json", "w") as f:
        json.dump(graph_data, f, indent=2)

    return jsonify(graph_data)
    
    
    

if __name__ == '__main__':
    app.run(debug=False)