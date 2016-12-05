/**
 * Options handler
 *
 * Available everywhere
 */
var options = {

    list: [
        'range-narrow',
        'range-wide',
        'over-time',
        'lead-changes',
        'lead-changes-amount',
        'triple-double',
        'winning-shot'
    ],

    // Our default values
    default: {
        'range-narrow': 3,
        'range-wide': 5,
        'over-time': true,
        'lead-changes': false,
        'lead-changes-amount': 10,
        'triple-double': true,
        'winning-shot': true
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

    load: function() {

        var loaded = {};

        for (var i = 0; i < options.list.length; i++) {
            loaded[options.list[i]] = options.get(options.list[i]);
        }

        return loaded;
    }
};
