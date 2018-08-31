(() => {
    const loadingOverlay = document.querySelector('#loading-overlay');
    const cancelButton = document.querySelector('#cancel-workflow-execution');
    const sourceImage = document.querySelector('#source-image');
    const imageInputs = document.querySelectorAll('.image-source-input');
    const slyce = new slyceSDK('production');

    let viewModel = {
        errors: [],
        results: [],
        showResults: false,
        imageSrc: null,
        cancelExecution: function(e) {
            slyce.cancelWorkflowExecution();
            closeLoadingOverlay();
        }
    }

    rivets.formatters.length = (arr) => arr.length;
    rivets.bind($('#results'), viewModel);
    rivets.bind($('#loading-overlay'), viewModel);

    slyce.initSlyceSpace('slycedemo', 'L9VT1RPiWGBFgHEAH7hgFGeDnZgdBPWL5aCT3zH0JZ0', 'DiiCp2Y2hLyEwggtX4km84');

    imageInputs.forEach((imageInput) => {
        imageInput.addEventListener('change', (e) => {
            const imageFile = e.srcElement.files[0];
            
            slyce.executeWorkflow(imageFile, '8qHmYrvaaVyUyWQMifN2o8', {
                onTaskUpdated: (message) => {
                    console.log('message: ', message);
                },
                onTaskCompleted: (message, errors) => {
                    viewModel.showResults = true;
                    loadingOverlay.style.display = 'none';

                    viewModel.errors = errors;
                    console.log('errors: ', errors);

                    if (errors.length) {
                        closeLoadingOverlay();
                    } 

                    if (message && message.results) {
                        console.log('items: ', message.results[0].items);
                        viewModel.results = message.results[0].items;
                    }
                },
                afterImageProcessed: (base64) => {
                    loadingOverlay.style.backgroundImage = 'url(' + base64 + ')';
                    viewModel.imageSrc = base64;
                    loadingOverlay.style.display = 'block';
                    sourceImage.style.display = 'inline-block';
                }
            }, false); 
        });
    });

    const resetViewModel = () => {
        viewModel.results = [];
        viewModel.showResults = false;
        viewModel.imageSrc = null;
        sourceImage.style.display = 'none';
    }

    const closeLoadingOverlay = () => {
        loadingOverlay.style.display = 'none';
        resetViewModel();
    }    
})();
