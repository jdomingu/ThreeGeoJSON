ThreeGeoJSON
=======================

This project aims to be a simple way to render geojson data in 3D with three.js.

Work in progress...

Enter the following code to render a geoJSON file in 3D:

var x = new ThreeGeo.Layer(json, radius, shape, {options});
x.drawGeometry();

Where:
-json is variable that contains the geoJSON that you want to render.
-radius is the radius of the sphere that you want to render.
-shape is either 'sphere' or 'plane'.
-options are threeJS options that you want to use to style the line or particle material. 

For example, you might enter:

var my_json = new ThreeGeo.Layer(countries_states, 10, 'sphere', {
    color: 'green'
});
my_json.drawGeometry();  
           
This creates a geoJSON object on a sphere. See ThreeGeoJSON.html for a complete example.

