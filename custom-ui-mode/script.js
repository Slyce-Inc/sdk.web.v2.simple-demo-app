(() => {
    const loadingOverlay = document.querySelector('#loading-overlay');
    const cancelButton = document.querySelector('#cancel-workflow-execution');
    const sourceImage = document.querySelector('#source-image');
    const imageInputs = document.querySelectorAll('.image-source-input');

    // Initialize the Slyce SDK
    const slyce = new slyceSDK();
    // Initialize a Slyce Space. This is an asynchronous call which would get the config object for the given Space and register it in the SDK
    // In other words this call should be performed before any other actions could be taken 
    slyce.initSlyceSpace('slycedemo', 'L9VT1RPiWGBFgHEAH7hgFGeDnZgdBPWL5aCT3zH0JZ0', 'DiiCp2Y2hLyEwggtX4km84');

    // Register a Rivets formatter
    rivets.formatters.length = (arr) => arr.length;

    // An object that would be bound to the UI, changing any of these properties would result in UI rerendering
    let viewModel = {
        errors: [],
        results: [],
        tags: [],
        showResults: false,
        imageSrc: null,
        loadingStatus: null,
        cancelExecution: function(e) {
            slyce.cancelWorkflowExecution();
            loadingOverlay.style.display = 'none';
            resetViewModel();
        }
    }
    // Bind the object to the page
    rivets.bind(document.getElementById('wrapper'), viewModel);

    // Loop through the input elements and bind event handlers
    imageInputs.forEach((imageInput) => {
        imageInput.addEventListener('change', (e) => {
            // Fetch the File object from input
            const imageFile = e.target.files[0];
            
            if (imageFile) {
                // Show overlay that would appear above everything else on the page. 
                // You may want to do that before the execution started as the workflow executor would process the picture at the first place, which may take some time (depending on the image size and wether it needs to be rotated or not)
                loadingOverlay.style.display = 'block';
                viewModel.loadingStatus = 'Analyzing the image';
                resetViewModel();
                
                // Execute the worflow using the image File, and WorkflowId (in this case Universal Workflow)                
                slyce.executeWorkflow(imageFile, '8qHmYrvaaVyUyWQMifN2o8', {
                    
                    // This is going to be fired each time the task was updated
                    onTaskUpdated: (message) => {
                        viewModel.loadingStatus = 'Searching for matches';

                        console.log('message: ', message);
                        if (message.progress && message.progress.tag) {
                            viewModel.tags.push(message.progress.tag);
                            console.log(message.progress.tag);
                        }
                    },
                    // This is going to be fired if the workflow has been completed or an error has appeared during the execution
                    onTaskCompleted: (message, errors) => {
                        viewModel.showResults = true;

                        viewModel.errors = errors;
                        console.log('errors: ', errors);

                        if (message && message.results) {
                            console.log('items: ', message.results[0].items);
                            viewModel.results = message.results[0].items;
                        }

                        loadingOverlay.style.display = 'none';
                    },
                    // This is going to be fired after the SDK processed the File object, rotated the image if needed and image base64 became available
                    // So image can be displayed on the page
                    afterImageProcessed: (base64) => {
                        loadingOverlay.style.backgroundImage = 'url(' + base64 + ')';
                        // update source image src attribute with base64
                        viewModel.imageSrc = base64;
                        // show the source image in the results page
                        sourceImage.style.display = 'inline-block';
                    }
                }, false); 
            } else {
                console.log('no file provided');
            }
        });
    });

    // Go back to the initial View state
    const resetViewModel = () => {
        viewModel.results = [];
        viewModel.tags = [];
        viewModel.errors = [];
        viewModel.showResults = false;
        viewModel.imageSrc = null;
        sourceImage.style.display = 'none';
        loadingOverlay.style.backgroundImage = 'none';
    }
})();
