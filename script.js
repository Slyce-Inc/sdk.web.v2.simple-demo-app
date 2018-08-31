(() => {
    rivets.formatters.length = function(arr) {
        return arr.length
    }
    let viewModel = {
        errors: [],
        results: [],
        showResults: false
    }
    rivets.bind($('#results'), viewModel);

    
    const slyce = new slyceSDK('production');
    slyce.initSlyceSpace('slycedemo', 'L9VT1RPiWGBFgHEAH7hgFGeDnZgdBPWL5aCT3zH0JZ0', 'DiiCp2Y2hLyEwggtX4km84');
    
    const imageInputs = document.querySelectorAll('.image-source-input');
    console.log(imageInputs)
    imageInputs.forEach((imageInput) => {
        imageInput.addEventListener('change', (e) => {
            const imageFile = e.srcElement.files[0];
            
            slyce.executeWorkflow(imageFile, '8qHmYrvaaVyUyWQMifN2o8', {
                onTaskUpdated: (message) => {
                    console.log('message: ', message);
                },
                onTaskCompleted: (message, errors) => {
                    viewModel.showResults = true;

                    viewModel.errors = errors;
                    console.log('errors: ', errors);

                    if (message && message.results) {
                        console.log('items: ', message.results[0].items);
                        viewModel.results = message.results[0].items;
                    }
                }
            }, true); 
        });
    });
})()


