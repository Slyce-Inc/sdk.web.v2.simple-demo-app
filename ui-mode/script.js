(function() {
    // get references to each image input
    const imageInputs = Array.from(document.querySelectorAll('.image-source-input'));
    const sourceImage = document.querySelector('#source-image');

    // Initialize the Slyce SDK
    const slyce = new slyceSDK();
    // Initialize a Slyce Space. This is an asynchronous call which would get the config object for the given Space and register it in the SDK
    // In other words this call should be performed before any other actions could be taken 
    slyce.initSlyceSpace('slycedemo', 'L9VT1RPiWGBFgHEAH7hgFGeDnZgdBPWL5aCT3zH0JZ0', 'DiiCp2Y2hLyEwggtX4km84');

    // Register a Rivets formatter
    rivets.formatters.length = function(arr){ arr.length };

    // An object that would be bound to the UI, changing any of these properties would result in UI rerendering
    let viewModel = {
        errors: [],
        results: [],
        imageSrc: null,
        showResults: false,
        // rivets would pass event and reference to the clicked item
        findSimilar: function(e, binding) {
            // findSimilar accepts Workflow ID of Find Similar workflow to use
            // 2nd argument is an object of item data. The object can have id or imageUrl properties to identify the target item
            // also you can pass workflowOptions (which is optional) with key value pairs, like {color: 'red'}
            slyce.findSimilar('f8GeavK4BbSvtcDYwX7XNY', {id: binding.item.id})
                .then(function(response) {
                    console.log(response)
                    viewModel.results = response.items;
                })
                .catch(function(e) { console.error(e)});
        },
        // Sends all analytics events that SDK has captured since last events dispatch (which happens every 30s) 
        // It's useful to send analytics events manually when you're about to redirect the user to another page 
        // or the user is about to leave the page, so none of events gets lost 
        dispatchAnalyticsEvents: function() {
            slyce.dispatchAnalyticsEvents()
                .then(function(response) {
                    console.log(response)
                })
                .catch(function(e) { console.error(e)});
        }
    }
    // Bind the object to the page
    rivets.bind(document.getElementById('wrapper'), viewModel);

    // Loop through the input elements and bind event handlers
    imageInputs.forEach(function(imageInput) {
        imageInput.addEventListener('change', function(e) {
            // Fetch the File object from input
            const imageFile = e.target.files[0];
            
            if (imageFile) {
                resetViewModel();

                // Execute the worflow using the image File, and WorkflowId (in this case Universal Workflow)
                slyce.executeWorkflow(imageFile, '8qHmYrvaaVyUyWQMifN2o8', {
                    // This is going to be fired each time the task was updated
                    onTaskUpdated: function(message) {
                        console.log('message: ', message);
                    },
                    // This is going to be fired if the workflow has been completed or an error has appeared during the execution
                    onTaskCompleted: function(message, errors) {
                        viewModel.showResults = true;
                        viewModel.errors = errors;
                        console.log('errors: ', errors);
                        console.log('message: ', message);

                        if (message && message.results) {
                            // Result Items 
                            console.log('items: ', message.results[0].items);
                            viewModel.results = message.results[0].items;
                        }
                    },
                    // This is going to be fired after the SDK processed the File object, rotated the image if needed and image base64 became available
                    // So image can be displayed on the page
                    afterImageProcessed: function(base64) {
                        // update source image src attribute with base64
                        viewModel.imageSrc = base64;
                        // show the source image in the results page
                        sourceImage.style.display = 'inline-block';
                    }
                }, true);     
            } else {
                console.log('no file provided');
            }
        });
    });

    // Go back to the initial View state
    const resetViewModel = function() {
        viewModel.results = [];
        viewModel.errors = [];
        viewModel.showResults = false;
        viewModel.imageSrc = null;
        sourceImage.style.display = 'none';
    }
})();


