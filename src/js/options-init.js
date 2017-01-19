(function() {
    /**
     * Inserts all the default options and handles the updating
     *
     * @todo update options
     */
    var init = function() {
        // Loop through all the input elements
        var inputs = document.querySelectorAll('input');

        inputs.forEach(function(el) {
            // Get the option name from the id
            var option = el.id;

            switch (el.type) {
                case 'checkbox':
                    // Insert the default value
                    el.checked = options.get(option);

                    // Listen for update
                    el.addEventListener('change', function() {
                        options.set(option, el.checked);
                    });
                    break;

                case 'number':
                    // Insert the default value
                    el.value = options.get(option);

                    // Listen for update
                    el.addEventListener('input', function() {
                        options.set(option, el.value);
                    });
                    break;
            }
        });
    };


    /**
     * Wait for the page to be ready
     */
    document.addEventListener('DOMContentLoaded', init, false);
})();
