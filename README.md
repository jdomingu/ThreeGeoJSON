ThreeGeoJSON
=======================

This project aims to be a simple way to render geojson data in 3D with three.js.

**Work in progress...**

Demo:
http://jdomingu.github.io/ThreeGeoJSON/

Enter the following code to render a geoJSON file in 3D:
```
var x = new ThreeGeo.Layer(json, radius, shape, {options});
x.drawGeometry();

drawThreeGeo(json, radius, shape, {options});   
```
You can enter the following parameters: 

| Parameter | Description |
| ------------- | ----------- |
| json | The variable that contains the geoJSON that you want to render. |
| radius | The radius of the sphere that you want to render. |
| shape | The 3D shape to use when rendering the geoJSON. Either 'sphere' or 'plane'. |
| options | The threeJS options that you want to use to style the line or particle material. |

For example, you might enter:
```
drawThreeGeo(json, 10, 'sphere', {
    color: 'green'
}); 
```

This creates a geoJSON object on a sphere. 

**Important:**
The demo uses the jquery $.getJSON method to pass the geoJSON to the function. You can only use this method if the geoJSON is hosted on a server that allows requests for json data. To test this code locally, complete the following steps: 

Add ```var json =``` to the beginning of the geoJSON file that you want to display.
Change the file extension of your geoJSON files to ".js".
Add the json.js file to the head of your HTML page. For example, you might add the following line:
```
<script src="test_geojson/json.js"></script>
```


