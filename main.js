(function() {

    const inputElement = document.querySelector('input');
    inputElement.focus();
    const resultsElement = document.querySelector('#results');
    let previousServerResponse = '';
    let previousRequest;
    let selectedIndex = -1;

    function getResults() {

        const request = new XMLHttpRequest();
        const stringToSend = encodeURIComponent(inputElement.value);

        request.onreadystatechange = function() {
            
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {

                const serverResponse = this.responseText;

                if (serverResponse === '') {

                    resultsElement.style.display = 'none';

                } else {

                    resetCurrentResults();
                    const serverResponseArray = serverResponse.split('|');
        
                    serverResponseArray.forEach(function(item) {

                        const newElement = document.createElement('div');
                        newElement.classList.add('current-results');
                        newElement.innerText = item;
                        resultsElement.appendChild(newElement);

                        newElement.addEventListener('mouseover', function(e) {
                            e.target.classList.add('current-results-pointer');
                        })

                        newElement.addEventListener('mouseout', function(e) {
                            e.target.classList.remove('current-results-pointer');
                        })

                        // Display selected city in input element
                        newElement.addEventListener('click', function() {

                            inputElement.value = this.innerText;
                            resetCurrentResults();
                            resultsElement.style.display = 'none';
                            inputElement.focus();
                        });
                    });

                    resultsElement.style.display = 'block';
                }

                previousServerResponse = serverResponse;
            }
        };

        // Dev
        request.open('GET', 'http://localhost:8888/city-autocomplete/search.php?input=' + stringToSend);
        // Prod
        // request.open('GET', 'https://city-autocomplete.rg-dev.fr/search.php?input=' + stringToSend);
        request.send();

        // Returns initialiazed XHR object
        return request;
    }

    function resetCurrentResults() {

        const previousSearchElements = document.querySelectorAll('.current-results');
        previousSearchElements.forEach(function(element) {
            element.remove();
        });

        selectedIndex = -1;
    }

    inputElement.addEventListener('keyup', function(e) {

        // Verify if KeyboardEvent.keyCode is not supported anymore
        const key = e.key;
        const keyCode = e.keyCode;

        if (key && e.key === 'ArrowUp' || keyCode && e.keyCode === 38) {

            if (selectedIndex > -1) {

                const previousSelectedResult = document.querySelector('.selected-result');
                previousSelectedResult.classList.remove('selected-result');

                selectedIndex--;

                // To avoid currentResultsElements[-1] which doesn't exist
                if (selectedIndex > -1) {

                    const currentResultsElements = document.querySelectorAll('.current-results');
                    currentResultsElements[selectedIndex].classList.add('selected-result');
                }
            }

        } else if (key && e.key === 'ArrowDown' || keyCode && e.keyCode === 40) {

            const currentResultsElements = document.querySelectorAll('.current-results');

            if (currentResultsElements) {

                if (selectedIndex < currentResultsElements.length - 1) {

                    const previousSelectedResult = document.querySelector('.selected-result');
                    
                    if (previousSelectedResult) {
                        previousSelectedResult.classList.remove('selected-result');
                    }

                    selectedIndex++;
                    currentResultsElements[selectedIndex].classList.add('selected-result');
                }
            }

        } else if (key && e.key === 'Enter' || keyCode && e.keyCode === 13) {

            const selectedResult = document.querySelector('.selected-result');

            if (selectedResult) {

                // Display selected city in input element
                inputElement.value = selectedResult.innerText;
                resetCurrentResults();
                resultsElement.style.display = 'none';
            }

        } else if (!/^[a-z]+\S*$/i.test(inputElement.value)) {

            const selectedResult = document.querySelector('.selected-result');

            if (selectedResult) {
                selectedResult.classList.remove('selected-result');
            }

            resultsElement.style.display = 'none';

        } else if (inputElement.value != previousServerResponse) {

            // Abort previous request if XHR object is not initialized and if it's not done before submitting a new one
            if (previousRequest && previousRequest.readyState < XMLHttpRequest.DONE) {
                previousRequest.abort();
            }

            previousRequest = getResults();
        }
    });
})();
