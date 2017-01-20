/**
 * Returns boolean if number is between range
 */
Number.prototype.between = function (min, max) {
    return this > min && this < max;
};




/**
 * Converts a time string "MM:SS" into numeric seconds
 */
function toSeconds(mins) {
    var split = mins.split(':');
    return (parseInt(split[0], 10) * 60) + parseInt(split[1], 10);
}
