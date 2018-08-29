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

    
    const slyce = new slyceSDK('staging');
    slyce.initSlyceSpace('', '', '');
    
    const imageInput = document.querySelector('#image-source-input');
    imageInput.addEventListener('change', (e) => {
        const imageFile = e.srcElement.files[0];
        
        slyce.executeWorkflow(imageFile, '', {
            onTaskUpdated: (message) => {
                console.log('message: ', message);
            },
            onTaskCompleted: (message, errors) => {
                console.log('items: ', message.results[0].items)
                console.log('errors: ', errors);

                viewModel.showResults = true;
                viewModel.errors = errors;
                viewModel.results = message.results[0].items;
            }
        }, true); 
    });
})()


