/* Process GeoJSON

Gets the bounds of the image, computes the scale value, and calls the drawGeoJSON function.

*/
var max_value_array1;
var min_value_array1;
var max_value_array2;
var min_value_array2;
var x_offset;
var y_offset;
    
function processGeoJSON(geoJSON_object, desired_plane_size)
{
    var feature_set = geoJSON_object.features;
    
    var x_values = new Array();
    var y_values = new Array();
        
    //Iterate through all coordinates to build an array of x values and an array of y values
    for (var feature_num = 0; feature_num < feature_set.length; feature_num++)
    {
        if (feature_set[feature_num].geometry.type == 'Point')
        {
            x_values.push(feature_set[feature_num].geometry.coordinates[0]);
            y_values.push(feature_set[feature_num].geometry.coordinates[1]);
            
        } else if (feature_set[feature_num].geometry.type == 'MultiPoint' || feature_set[feature_num].geometry.type == 'LineString')
        {
            for (var point_num = 0; point_num < feature_set[feature_num].geometry.coordinates.length; point_num++)
            {
                x_values.push(feature_set[feature_num].geometry.coordinates[point_num][0]);
                y_values.push(feature_set[feature_num].geometry.coordinates[point_num][1]);
            }
        } else if (feature_set[feature_num].geometry.type == 'Polygon' || feature_set[feature_num].geometry.type == 'MultiLineString')
        {
            for (var segment_num = 0; segment_num < feature_set[feature_num].geometry.coordinates.length; segment_num++)
            {
                for (var point_num = 0; point_num < feature_set[feature_num].geometry.coordinates[segment_num].length; point_num++)
                {
                    x_values.push(feature_set[feature_num].geometry.coordinates[segment_num][point_num][0]);
                    y_values.push(feature_set[feature_num].geometry.coordinates[segment_num][point_num][1]);
                }
            }
        } else if (feature_set[feature_num].geometry.type == 'MultiPolygon')
        {
            for (var polygon_num = 0; polygon_num < feature_set[feature_num].geometry.coordinates.length; polygon_num++)
            {
                for (var segment_num = 0; segment_num < feature_set[feature_num].geometry.coordinates[polygon_num].length; segment_num++)
                {
                    for (var point_num = 0; point_num < feature_set[feature_num].geometry.coordinates[segment_num].length; point_num++)
                    {
                        x_values.push(feature_set[feature_num].geometry.coordinates[polygon_num][segment_num][point_num][0]);
                        y_values.push(feature_set[feature_num].geometry.coordinates[polygon_num][segment_num][point_num][1]);
                    }
                }
            }
        }
        
    }
    
    //Use the arrays of values to determine the bounds and to to get max and min values.
    var scale_value = getScaleValue(x_values, y_values, desired_plane_size);
    
    //Draw the GeoJSON in ThreeJS
    drawOnPlane(geoJSON_object, scale_value);
    
}

function getScaleValue(value_array1, value_array2, desired_plane_size)
{
    max_value_array1 = getMaxValue(value_array1);
    min_value_array1 = getMinValue(value_array1);
    max_value_array2 = getMaxValue(value_array2);
    min_value_array2 = getMinValue(value_array2);
    
    var range_array1 = getRange(max_value_array1, min_value_array1);
    var range_array2 = getRange(max_value_array2, min_value_array2);
    
    var scale_value; 
    
    if (range_array1 >= range_array2)
    {
        scale_value = desired_plane_size / range_array1;
        x_offset = desired_plane_size / 2;
        y_offset = (desired_plane_size * (range_array2 / range_array1)) / 2;
    } else {
        scale_value = desired_plane_size / range_array2;
        y_offset = desired_plane_size / 2;
        x_offset = (desired_plane_size * (range_array1 / range_array2)) / 2;
    }
    
    //var return_string = "Max X: " + max_value_array1 + "<br>Min X: " + min_value_array1 + "<br>Max Y: " + max_value_array2 + "<br>Min Y: " + min_value_array2 + "<br>Scale Value: " + scale_value;
    //return return_string;
    return scale_value;
}

function getMaxValue(value_array) 
{
    var max_value = value_array[0];
    
    for (var i = 1; i < value_array.length; i++)
    {
        if (max_value < value_array[i])
        {
            max_value = value_array[i];
        }                 
    }
    return max_value;
}

function getMinValue(value_array) 
{
    var min_value = value_array[0];
    
    for (var i = 1; i < value_array.length; i++)
    {
        if (min_value > value_array[i])
        {
            min_value = value_array[i];
        }                 
    }
    return min_value;
}

function getRange(max_value, min_value) 
{
    var distance = max_value - min_value;
    return distance;
}