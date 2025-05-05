
let data;

async function loadGraphData() {
  data = await get_graph_data();
}

loadGraphData();
console.log("loaded graph data");
let graphData = {};
var map = L.map('map').setView([37.2129486, 28.3630293], 13);



let click = 0;
let latLng1 = {
  latLng: null,
  nodeId: null
} ;

let latLng2= {
  latLng: null,
  nodeId: null
} ;
      L.tileLayer('https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=bDYlnn4DjGOe2QykSWE4', {
        maxZoom: 19,
        attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
      }).addTo(map);
      var marker = L.marker([37.2129486, 28.3630293]).addTo(map);


      var popup = L.popup();


      L.geoJSON
      
      
      async function onMapClick(e) {
        map.off('click', onMapClick);
        console.log(click);
        if (click == 0) {
          latLng1.latLng = e.latlng;
          const snapnode=getNearestNode(latLng1.latLng.lat,latLng1.latLng.lng,data);
          console.log("nearest node: ",snapnode);
          L.marker(snapnode[0]).addTo(map);
          latLng1.latLng = L.latLng(snapnode[0][0], snapnode[0][1]);
          latLng1.nodeId = snapnode[1];
        }
        else if (click == 1) {
          latLng2.latLng = e.latlng;
          const snapnode=getNearestNode(latLng2.latLng.lat,latLng2.latLng.lng,data);
          console.log("nearest node: ",snapnode);
          L.marker(snapnode[0]).addTo(map);
          latLng2.latLng = L.latLng(snapnode[0][0], snapnode[0][1]);
          latLng2.nodeId = snapnode[1];
        }
        click++;
        if (latLng1.latLng != null && latLng2.latLng != null){
          path = await dijkstra(data,latLng1.nodeId,latLng2.nodeId);

          console.log(path);
          var latlngs = [];
          for (let i = 0; i < path.length; i++){
            let point = data.coordinates[path[i]];
            latlngs.push([point[0], point[1]]);
          }
          L.polyline(latlngs, {color: 'red'}).addTo(map);
          click = 0;
          latLng1.latLng = null;
          latLng1.nodeId = null;
          latLng2.latLng = null;
          latLng2.nodeId = null;
        }
        
        map.on('click', onMapClick);
      }

      async function get_graph_data() {
        try {
          const response = await fetch('graph-data.json');
          if (!response.ok) {
            throw new Error('Failed to load graph data');
          }
          const graphData = await response.json();
          

          return graphData;
          
        } catch (error) {
          console.error('Error loading graph data:', error);
          alert('Error loading graph data. Please try again later.');
          return null;
        }
      }

      function getNearestNode(lat, lon, graphData) {
        let minDistance = Infinity;
        let nearestNode = null;
        let nodeId = null;
    

        for (let point in graphData.coordinates) {
            let nodeLat = graphData.coordinates[point][0];
            let nodeLon = graphData.coordinates[point][1];
    

            let difLat = lat - nodeLat;
            let difLon = lon - nodeLon;
            let distance = Math.sqrt(difLat * difLat + difLon * difLon);
    

            if (distance < minDistance) {
                minDistance = distance;
                nearestNode = graphData.coordinates[point];
                nodeId = point;
            }
        }
    
        return [nearestNode, nodeId];
    }
    
      
      map.on('click', onMapClick);


function clearMap() {
  map.eachLayer(function (layer) {
    if (layer instanceof L.Marker || layer instanceof L.Polyline) {
      map.removeLayer(layer);
    }
  });
}
      map.on('keydown',clearMap)