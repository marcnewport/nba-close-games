/**
 * Options handler
 *
 * Available everywhere
 */
var options = {

    // Our default values
    default: {
        'enabled': false,
        'over-time': true,
        'range': true,
        'range-amount': 5,
        'time': true,
        'time-amount': 120,
        'clutch': false,
        'clutch-over-time': false,
        'wiki': true,

        'lead-changes': false,
        'lead-changes-amount': 10,
        'triple-double': false
    },

    cache: {},

    // Getter function
    get: function(key) {
        return options.cache[key];
    },

    // Setter function...
    set: function(key, val) {
        options.cache[key] = val;
        chrome.storage.sync.set({ marc: 'cool' });
        chrome.storage.sync.set({ 'ncge-options': options.cache }, function() {
            // console.log('setting', key, val);
        });
    },

    list: function() {

        var list = [];

        for (var option in options.default) {
            list.push(option);
        }

        return list;
    },

    // Returns an array of all the options
    load: function(callback) {
        chrome.storage.sync.get('ncge-options', function(items) {
             Object.assign(options.cache, options.default, items['ncge-options']);
             if (callback) callback();
        });
    }
};
