/* Draw GeoJSON on a sphere

Iterates through the latitude and longitude values, converts the values to XYZ coordinates, and draws the geoJSON geometries.

*/

var x_values = [];
var y_values = [];
var z_values = [];

function drawOnSphere(geoJSON_object, sphere_radius) {
    
    var json_geom = createGeometriesArray(geoJSON_object);
        
    for (var geom_num = 0; geom_num < json_geom.length; geom_num++) {
                
        if (json_geom[geom_num].type == 'Point') {
            convertCoordinates(json_geom[geom_num].coordinates, sphere_radius);            
            drawParticle(y_values[0], z_values[0], x_values[0]);
            
        } else if (json_geom[geom_num].type == 'MultiPoint') {
            for (var point_num = 0; point_num < json_geom[geom_num].coordinates.length; point_num++) {
                convertCoordinates(json_geom[geom_num].coordinates[point_num], sphere_radius);            
                drawParticle(y_values[0], z_values[0], x_values[0]);                
            }
            
        } else if (json_geom[geom_num].type == 'LineString') {
            
            for (var point_num = 0; point_num < json_geom[geom_num].coordinates.length; point_num++) {
                convertCoordinates(json_geom[geom_num].coordinates[point_num], sphere_radius);
            }            
            drawLine(y_values, z_values, x_values);
            
        } else if (json_geom[geom_num].type == 'Polygon') {
            for (var segment_num = 0; segment_num < json_geom[geom_num].coordinates.length; segment_num++) {
                for (var point_num = 0; point_num < json_geom[geom_num].coordinates[segment_num].length; point_num++) {
                    convertCoordinates(json_geom[geom_num].coordinates[segment_num][point_num], sphere_radius); 
                }                
                drawLine(y_values, z_values, x_values);
            }
            
        } else if (json_geom[geom_num].type == 'MultiLineString') {
            for (var segment_num = 0; segment_num < json_geom[geom_num].coordinates.length; segment_num++) {
                for (var point_num = 0; point_num < json_geom[geom_num].coordinates[segment_num].length; point_num++) {
                    convertCoordinates(json_geom[geom_num].coordinates[segment_num][point_num], sphere_radius); 
                }                
                drawLine(y_values, z_values, x_values);                
            }
            
        } else if (json_geom[geom_num].type == 'MultiPolygon') {
            for (var polygon_num = 0; polygon_num < json_geom[geom_num].coordinates.length; polygon_num++) {
                for (var segment_num = 0; segment_num < json_geom[geom_num].coordinates[polygon_num].length; segment_num++) {
                    for (var point_num = 0; point_num < json_geom[geom_num].coordinates[polygon_num][segment_num].length; point_num++) {
                        convertCoordinates(json_geom[geom_num].coordinates[polygon_num][segment_num][point_num], sphere_radius); 
                    }                    
                    drawLine(y_values, z_values, x_values);                    
                }
            }
        }
        
    }

}

function createGeometriesArray(geoJSON_object) {
    var json_geom = [];
    
    if (geoJSON_object.type == 'Feature') {
        json_geom.push(geoJSON_object.geometry);        
    } else if (geoJSON_object.type == 'FeatureCollection') {
        for (var feature_num = 0; feature_num < geoJSON_object.features.length; feature_num++) { 
            json_geom.push(geoJSON_object.features[feature_num].geometry);            
        }
    } else if (geoJSON_object.type == 'GeometryCollection') {
        for (var geom_num = 0; geom_num < geoJSON_object.geometries.length; geom_num++) { 
            json_geom.push(geoJSON_object.geometries[geom_num]);
        }
    } else {
        throw new Error('The geoJSON is not valid.');
    }    
    return json_geom;
}

function convertCoordinates(coordinates_array, sphere_radius) {
    var lon = coordinates_array[0];
    var lat = coordinates_array[1];

    x_values.push(Math.cos(lat * Math.PI/180) * Math.cos(lon * Math.PI/180) * sphere_radius);
    y_values.push(Math.cos(lat * Math.PI/180) * Math.sin(lon * Math.PI/180) * sphere_radius);
    z_values.push(Math.sin(lat * Math.PI/180) * sphere_radius);    
}

function drawParticle(x, y, z) {
    var particle_geom = new THREE.Geometry();
    particle_geom.vertices.push(new THREE.Vector3(x, y, z));
    
    var particle_material = new THREE.ParticleSystemMaterial({
        color: 'green',
        size: 0.1
    });
    
    var particle = new THREE.ParticleSystem(particle_geom, particle_material);
    scene.add(particle);
    
    clearArrays();
}
function drawLine(x_values, y_values, z_values) {
    var line_geom = new THREE.Geometry();
    createVertexForEachPoint(line_geom, x_values, y_values, z_values);
                
    var line_material = new THREE.LineBasicMaterial({
        color: 'red'
    });
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