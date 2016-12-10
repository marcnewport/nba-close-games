/**
 * Options handler
 *
 * Available everywhere
 */
var options = {

    // Our default values
    default: {
        'over-time': true,
        'range-narrow': true,
        'range-narrow-amount': 3,
        'range-wide': true,
        'range-wide-amount': 5,
        'lead-changes': false,
        'lead-changes-amount': 10,
        'triple-double': false,
        'winning-shot': false
    },

    // Getter function that returns default values if nothing is already saved
    get: function(key) {

        var val = options.default[key];

        if (localStorage[key]) {
            val = JSON.parse(localStorage[key]);
        }

        return val;
    },

    // Setter function...
    set: function(key, val) {
        localStorage[key] = val;
    },

    list: function() {

        var list = [];

        for (var option in options.default) {
            list.push(option);
        }

        return list;
    },

    // Returns an array of all the options
    load: function() {

        var loaded = {};

        for (var option in options.default) {
            loaded[option] = options.get(option);
        }

        return loaded;
    }
};
