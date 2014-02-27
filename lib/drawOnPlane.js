/* Draw GeoJSON

Iterates through the values, converts the values to XY coordinates, and draws the geoJSON geometries.

*/

function drawOnPlane(geoJSON_object, scale_value)
{
    var feature_set = geoJSON_object.features;
        
    for (var feature_num = 0; feature_num < feature_set.length; feature_num++)
    {
        if (feature_set[feature_num].geometry.type == 'Point')
        {
            var x = (feature_set[feature_num].geometry.coordinates[0] - min_value_array1) * scale_value - x_offset;
            var y = (feature_set[feature_num].geometry.coordinates[1] - min_value_array2) * scale_value - y_offset;
            
            drawParticle(x, y);
            
        } else if (feature_set[feature_num].geometry.type == 'MultiPoint')
        {
            for (var point_num = 0; point_num < feature_set[feature_num].geometry.coordinates.length; point_num++)
            {
                var x = (feature_set[feature_num].geometry.coordinates[point_num][0] - min_value_array1) * scale_value - x_offset;
                var y = (feature_set[feature_num].geometry.coordinates[point_num][1] - min_value_array2) * scale_value - y_offset;
                
               drawParticle(x, y);
                
            }
            
        } else if (feature_set[feature_num].geometry.type == 'LineString')
        {
            var x_values = new Array();
            var y_values = new Array();
            
            for (var point_num = 0; point_num < feature_set[feature_num].geometry.coordinates.length; point_num++)
            {
                x_values.push((feature_set[feature_num].geometry.coordinates[point_num][0] - min_value_array1) * scale_value - x_offset);
                y_values.push((feature_set[feature_num].geometry.coordinates[point_num][1] - min_value_array2) * scale_value - y_offset);
                
            }
            
            drawLine(x_values, y_values);
            
           
        } else if (feature_set[feature_num].geometry.type == 'Polygon')
        {
            var x_values = new Array();
            var y_values = new Array();
            
            for (var segment_num = 0; segment_num < feature_set[feature_num].geometry.coordinates.length; segment_num++)
            {
                for (var point_num = 0; point_num < feature_set[feature_num].geometry.coordinates[segment_num].length; point_num++)
                {
                    x_values.push((feature_set[feature_num].geometry.coordinates[segment_num][point_num][0] - min_value_array1) * scale_value - x_offset);
                    y_values.push((feature_set[feature_num].geometry.coordinates[segment_num][point_num][1] - min_value_array2) * scale_value - y_offset);
                }
                
                drawLine(x_values, y_values);
            }
        } else if (feature_set[feature_num].geometry.type == 'MultiLineString')
        {
            for (var segment_num = 0; segment_num < feature_set[feature_num].geometry.coordinates.length; segment_num++)
            {
                var x_values = new Array();
                var y_values = new Array();
                
                for (var point_num = 0; point_num < feature_set[feature_num].geometry.coordinates[segment_num].length; point_num++)
                {
                    x_values.push((feature_set[feature_num].geometry.coordinates[segment_num][point_num][0] - min_value_array1) * scale_value - x_offset);
                    y_values.push((feature_set[feature_num].geometry.coordinates[segment_num][point_num][1] - min_value_array2) * scale_value - y_offset);
                }
                
                drawLine(x_values, y_values);
                
            }
        } else if (feature_set[feature_num].geometry.type == 'MultiPolygon')
        {
            for (var polygon_num = 0; polygon_num < feature_set[feature_num].geometry.coordinates.length; polygon_num++)
            {
                for (var segment_num = 0; segment_num < feature_set[feature_num].geometry.coordinates[polygon_num].length; segment_num++)
                {
                    var x_values = new Array();
                    var y_values = new Array();
    
                    for (var point_num = 0; point_num < feature_set[feature_num].geometry.coordinates[polygon_num][segment_num].length; point_num++)
                    {
                        x_values.push((feature_set[feature_num].geometry.coordinates[polygon_num][segment_num][point_num][0] - min_value_array1) * scale_value - x_offset);
                        y_values.push((feature_set[feature_num].geometry.coordinates[polygon_num][segment_num][point_num][1] - min_value_array2) * scale_value - y_offset);
                    }
                    
                    drawLine(x_values, y_values);
                    
                }
            }
        }
        
    }

}

function drawParticle(x, y)
{
    var particle_geom = new THREE.Geometry();
    var particle_material = new THREE.ParticleSystemMaterial({color: 'green', size: 0.5});
    particle_geom.vertices.push(new THREE.Vector3(x, 0, y));
    var particle = new THREE.ParticleSystem(particle_geom, particle_material);
    scene.add(particle);
    
}
function drawLine(x_values, y_values)
{
    var line_geom = new THREE.Geometry();
    createVertexForEachPoint(line_geom, x_values, y_values);
                
    var line_material = new THREE.LineBasicMaterial({
        color: 'red'
    });
    var line = new THREE.Line(line_geom, line_material);
    scene.add(line);
}

function createVertexForEachPoint(object_geometry, values_axis1, values_axis2)
{
    for (var i = 0; i < values_axis1.length; i++)
    {
        object_geometry.vertices.push(new THREE.Vector3(values_axis1[i], 0, values_axis2[i]));
    }
}