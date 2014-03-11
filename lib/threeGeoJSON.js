/* Draw GeoJSON

Iterates through the latitude and longitude values, converts the values to XYZ coordinates, and draws the geoJSON geometries.

*/

var x_values = [];
var y_values = [];
var z_values = [];

function drawThreeGeo(json, radius, shape, options) {

    var json_geom = createGeometryArray(json);    
    var convertCoordinates = getConversionFunctionName(shape);    
    
    for (var geom_num = 0; geom_num < json_geom.length; geom_num++) {
                
        if (json_geom[geom_num].type == 'Point') {
            convertCoordinates(json_geom[geom_num].coordinates, radius);            
            drawParticle(y_values[0], z_values[0], x_values[0], options);
            
        } else if (json_geom[geom_num].type == 'MultiPoint') {
            for (var point_num = 0; point_num < json_geom[geom_num].coordinates.length; point_num++) {
                convertCoordinates(json_geom[geom_num].coordinates[point_num], radius);            
                drawParticle(y_values[0], z_values[0], x_values[0], options);                
            }
            
        } else if (json_geom[geom_num].type == 'LineString') {
            
            for (var point_num = 0; point_num < json_geom[geom_num].coordinates.length; point_num++) {
                convertCoordinates(json_geom[geom_num].coordinates[point_num], radius);
            }            
            drawLine(y_values, z_values, x_values, options);
            
        } else if (json_geom[geom_num].type == 'Polygon') {
            for (var segment_num = 0; segment_num < json_geom[geom_num].coordinates.length; segment_num++) {
                for (var point_num = 0; point_num < json_geom[geom_num].coordinates[segment_num].length; point_num++) {
                    convertCoordinates(json_geom[geom_num].coordinates[segment_num][point_num], radius); 
                }                
                drawLine(y_values, z_values, x_values, options);
            }
            
        } else if (json_geom[geom_num].type == 'MultiLineString') {
            for (var segment_num = 0; segment_num < json_geom[geom_num].coordinates.length; segment_num++) {
                for (var point_num = 0; point_num < json_geom[geom_num].coordinates[segment_num].length; point_num++) {
                    convertCoordinates(json_geom[geom_num].coordinates[segment_num][point_num], radius); 
                }                
                drawLine(y_values, z_values, x_values);                
            }
            
        } else if (json_geom[geom_num].type == 'MultiPolygon') {
            for (var polygon_num = 0; polygon_num < json_geom[geom_num].coordinates.length; polygon_num++) {
                for (var segment_num = 0; segment_num < json_geom[geom_num].coordinates[polygon_num].length; segment_num++) {
                    for (var point_num = 0; point_num < json_geom[geom_num].coordinates[polygon_num][segment_num].length; point_num++) {
                        convertCoordinates(json_geom[geom_num].coordinates[polygon_num][segment_num][point_num], radius); 
                    }                    
                    drawLine(y_values, z_values, x_values, options);                    
                }
            }
        } else {
            throw new Error('The geoJSON is not valid.');
        }        
    }
    
}       

function createGeometryArray(json) {
    var geometry_array = [];
    
    if (json.type == 'Feature') {
        geometry_array.push(json.geometry);        
    } else if (json.type == 'FeatureCollection') {
        for (var feature_num = 0; feature_num < json.features.length; feature_num++) { 
            geometry_array.push(json.features[feature_num].geometry);            
        }
    } else if (json.type == 'GeometryCollection') {
        for (var geom_num = 0; geom_num < json.geometries.length; geom_num++) { 
            geometry_array.push(json.geometries[geom_num]);
        }
    } else {
        throw new Error('The geoJSON is not valid.');
    }    
    //alert(geometry_array.length);
    return geometry_array;
}

function getConversionFunctionName(shape) {
    var conversionFunctionName;
    
    if (shape == 'sphere') {
        conversionFunctionName = convertToSphereCoords;
    } else if (shape == 'plane') {
        conversionFunctionName = convertToPlaneCoords;
    } else {
        throw new Error('The shape that you specified is not valid.');
    }
    return conversionFunctionName;
}


function convertToSphereCoords(coordinates_array, sphere_radius) {
    var lon = coordinates_array[0];
    var lat = coordinates_array[1];

    x_values.push(Math.cos(lat * Math.PI/180) * Math.cos(lon * Math.PI/180) * sphere_radius);
    y_values.push(Math.cos(lat * Math.PI/180) * Math.sin(lon * Math.PI/180) * sphere_radius);
    z_values.push(Math.sin(lat * Math.PI/180) * sphere_radius);    
}

function convertToPlaneCoords(coordinates_array, radius) {
    var lon = coordinates_array[0];
    var lat = coordinates_array[1];
    var plane_offset = radius / 2;
        
    z_values.push((lat/180) * radius);
    y_values.push((lon/180) * radius);
    
}

function drawParticle(x, y, z, options) {
    var particle_geom = new THREE.Geometry();
    particle_geom.vertices.push(new THREE.Vector3(x, y, z));
    
    var particle_material = new THREE.ParticleSystemMaterial(options);
    
    var particle = new THREE.ParticleSystem(particle_geom, particle_material);
    scene.add(particle);
    
    clearArrays();
}

function drawLine(x_values, y_values, z_values, options) {
    var line_geom = new THREE.Geometry();
    createVertexForEachPoint(line_geom, x_values, y_values, z_values);
                
    var line_material = new THREE.LineBasicMaterial(options);
    var line = new THREE.Line(line_geom, line_material);
    scene.add(line);
    
    clearArrays();
}

function createVertexForEachPoint(object_geometry, values_axis1, values_axis2, values_axis3) {
    for (var i = 0; i < values_axis1.length; i++) {
        object_geometry.vertices.push(new THREE.Vector3(values_axis1[i],
                values_axis2[i], values_axis3[i]));
    }
}

function clearArrays() {
    x_values.length = 0;
    y_values.length = 0;
    z_values.length = 0;    
}
