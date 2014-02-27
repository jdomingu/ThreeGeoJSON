/* Draw GeoJSON on a sphere

Iterates through the latitude and longitude values, converts the values to XYZ coordinates, and draws the geoJSON geometries.

*/

var x_values = new Array();
var y_values = new Array();
var z_values = new Array();


function drawOnSphere(geoJSON_object, sphere_radius)
{
    var feature_set = geoJSON_object.features;
    
    for (var feature_num = 0; feature_num < feature_set.length; feature_num++)
    {
        if (feature_set[feature_num].geometry.type == 'Point')
        {
            convertCoordinates(feature_set[feature_num].geometry.coordinates, sphere_radius);            
            drawParticle(y_values[0], z_values[0], x_values[0]);
            
        } else if (feature_set[feature_num].geometry.type == 'MultiPoint')
        {
            for (var point_num = 0; point_num < feature_set[feature_num].geometry.coordinates.length; point_num++)
            {
                convertCoordinates(feature_set[feature_num].geometry.coordinates[point_num], sphere_radius);            
                drawParticle(y_values[0], z_values[0], x_values[0]);                
            }
            
        } else if (feature_set[feature_num].geometry.type == 'LineString')
        {
            
            for (var point_num = 0; point_num < feature_set[feature_num].geometry.coordinates.length; point_num++)
            {
                convertCoordinates(feature_set[feature_num].geometry.coordinates[point_num], sphere_radius);
            }
            
            drawLine(y_values, z_values, x_values);            
           
        } else if (feature_set[feature_num].geometry.type == 'Polygon')
        {
            for (var segment_num = 0; segment_num < feature_set[feature_num].geometry.coordinates.length; segment_num++)
            {
                for (var point_num = 0; point_num < feature_set[feature_num].geometry.coordinates[segment_num].length; point_num++)
                {
                    convertCoordinates(feature_set[feature_num].geometry.coordinates[segment_num][point_num], sphere_radius); 
                }
                
                drawLine(y_values, z_values, x_values);
            }
        } else if (feature_set[feature_num].geometry.type == 'MultiLineString')
        {
            for (var segment_num = 0; segment_num < feature_set[feature_num].geometry.coordinates.length; segment_num++)
            {
                for (var point_num = 0; point_num < feature_set[feature_num].geometry.coordinates[segment_num].length; point_num++)
                {
                    convertCoordinates(feature_set[feature_num].geometry.coordinates[segment_num][point_num], sphere_radius); 
                }
                
                drawLine(y_values, z_values, x_values);                
            }
        } else if (feature_set[feature_num].geometry.type == 'MultiPolygon')
        {
            for (var polygon_num = 0; polygon_num < feature_set[feature_num].geometry.coordinates.length; polygon_num++)
            {
                for (var segment_num = 0; segment_num < feature_set[feature_num].geometry.coordinates[polygon_num].length; segment_num++)
                {
                    for (var point_num = 0; point_num < feature_set[feature_num].geometry.coordinates[polygon_num][segment_num].length; point_num++)
                    {
                        convertCoordinates(feature_set[feature_num].geometry.coordinates[polygon_num][segment_num][point_num], sphere_radius); 
                    }
                    
                    drawLine(y_values, z_values, x_values);                    
                }
            }
        }
        
    }

}

function convertCoordinates(coordinates_array, sphere_radius)
{
    var lon = coordinates_array[0];
    var lat = coordinates_array[1];

    x_values.push(Math.cos(lat * Math.PI/180) * Math.cos(lon * Math.PI/180) * sphere_radius);
    y_values.push(Math.cos(lat * Math.PI/180) * Math.sin(lon * Math.PI/180) * sphere_radius);
    z_values.push(Math.sin(lat * Math.PI/180) * sphere_radius);    
}

function drawParticle(x, y, z)
{
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
function drawLine(x_values, y_values, z_values)
{
    var line_geom = new THREE.Geometry();
    createVertexForEachPoint(line_geom, x_values, y_values, z_values);
                
    var line_material = new THREE.LineBasicMaterial({
        color: 'red'
    });
    var line = new THREE.Line(line_geom, line_material);
    scene.add(line);
    
    clearArrays();
}

function createVertexForEachPoint(object_geometry, values_axis1, values_axis2, values_axis3)
{
    for (var i = 0; i < values_axis1.length; i++)
    {
        object_geometry.vertices.push(new THREE.Vector3(values_axis1[i], values_axis2[i], values_axis3[i]));
    }
}

function clearArrays()
{
    x_values.length = 0;
    y_values.length = 0;
    z_values.length = 0;    
}