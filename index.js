

let graphData = {};
var map = L.map('map').setView([51.507033, -0.127029], 13);
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
      var marker = L.marker([51.507033, -0.127029]).addTo(map);


      var popup = L.popup();

      async function onMapClick(e) {
        map.off('click', onMapClick);
        let data;
        console.log(click);
        if (click == 0) {
          latLng1.latLng = e.latlng;
          data= await get_graph_data(latLng1.latLng.lat,latLng1.latLng.lng,0,0);
          if (data == 1000){
            alert("No graph data available for this location");
            map.on('click', onMapClick);
            latLng1.latLng != null
            return;
        }
          const snapnode=getNearestNode(latLng1.latLng.lat,latLng1.latLng.lng,data);
          console.log("nearest node: ",snapnode);
          L.marker(snapnode[0]).addTo(map);
          latLng1.latLng = L.latLng(snapnode[0][0], snapnode[0][1]);
          latLng1.nodeId = snapnode[1];
        }
        else if (click == 1) {
          latLng2.latLng = e.latlng;
          data=await get_graph_data(latLng2.latLng.lat,latLng2.latLng.lng,0,0);
          if (data == 1000){
            alert("No graph data available for this location");
            map.on('click', onMapClick);
            latLng2.latLng != null
            click = 1;
            return;
          }
          const snapnode=getNearestNode(latLng2.latLng.lat,latLng2.latLng.lng,data);
          console.log("nearest node: ",snapnode);
          L.marker(snapnode[0]).addTo(map);
          latLng2.latLng = L.latLng(snapnode[0][0], snapnode[0][1]);
          latLng2.nodeId = snapnode[1];
        }
        click++;
        if (latLng1.latLng != null && latLng2.latLng != null){
          data=await get_graph_data(latLng1.latLng.lat,
                                    latLng1.latLng.lng,
                                    latLng2.latLng.lat,
                                    latLng2.latLng.lng);
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


      async function get_graph_data(lat1, lon1, lat2, lon2){
        const response = await fetch(`http://localhost:5000/get_graph_data?lat1=${lat1}&lon1=${lon1}&lat2=${lat2}&lon2=${lon2}&click=${click}`);
        const data = await response.json();
        if (data.error !== undefined){
          return 1000;
          
        }
        return data;
        
      }





      function getNearestNode(lat,lon,graphData){
        let difLatBef = Infinity;
        let difLonBef = Infinity;
        let nearestNode = null;
        let nodeId = null;
        for(let point in graphData.coordinates){
          let difLatCurr = Math.abs(lat - graphData.coordinates[point][0]);
          let difLonCurr = Math.abs(lon - graphData.coordinates[point][1]);
          if (difLatBef > difLatCurr || difLonBef > difLonCurr){
            difLatBef = difLatCurr;
            difLonBef = difLonCurr;
            nearestNode = graphData.coordinates[point];
            nodeId = point;
      }
    }
    return [nearestNode,nodeId];
    
  }
      
      map.on('click', onMapClick);


function clearMap() {
  map.eachLayer(layer)
}
      map.on('keydown')