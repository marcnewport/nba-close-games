(function() {

    /**
     * Inserts all the default options and handles the updating
     *
     * @todo update options
     */
    function init() {

        // Loop through all the input elements
        var inputs = document.querySelectorAll('input');

        inputs.forEach(function(el) {
            // Get the option name from the id
            var key = el.name;

            console.log(key, options.get(key));

            switch (el.type) {
                case 'checkbox':
                    // Insert the default value
                    el.checked = options.get(key);

                    // Listen for update
                    el.addEventListener('change', function() {
                        options.set(key, el.checked);
                    });
                    break;

                case 'number':
                    // Insert the default value
                    el.value = options.get(key);

                    // Listen for update
                    el.addEventListener('input', function() {
                        options.set(key, el.value);
                    });
                    break;
            }
        });
    }


    /**
     * Wait for the page to be ready
     */
    document.addEventListener('DOMContentLoaded', options.load(init), false);
})();
