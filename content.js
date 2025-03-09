'use strict';

const verseSelector = '[class^="TranslationViewCell_cellContainer"]';

setTimeout(() => { // Wait a second to add functionality

    // Add functionality to loaded verses
    const verses = document.querySelectorAll(verseSelector);
    if (verses) verses.forEach(verse => addClickableWords(verse));

    // Start observing for newly loaded verses
    const observer = new MutationObserver(checkForNewVerses);
    observer.observe(document.body, { childList: true, subtree: true });

}, 1000);

// Check if a newly added node has a verse inside, then add functionality
function checkForNewVerses(mutations) {
    mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const verse = node.querySelector(verseSelector);
                    if (verse) addClickableWords(verse);
                }
            });
        }
    });
}

// Add event listeners when a word is clicked to set analysis
function addClickableWords(verse) {
    // Find words
    const words = verse.querySelectorAll('[role="button"][data-word-location]');
    
    // Iterate through all words except the last one
    words.forEach((word, index) => {
        if (index === words.length - 1) return; // Skip the last word
        
        const wordId = word.getAttribute('data-word-location');
        word.setAttribute('selected', false);

        // Add a click event listener to each button
        word.addEventListener('click', () => {
            setAnalysis(wordId, word, verse);
        });
    });
}

function setAnalysis(wordid, word, verse) {

    // Check if analysis doesn't exist for this verse yet
    if (!verse.parentNode.querySelector('.analysisbox')) {
        addAnalysisHTML(wordid, verse);
    } else {
        // remove colored word
        verse.querySelector('[selected="true"]').setAttribute('selected', false);
    }

    // color current word
    word.setAttribute('selected', true);

    const analysisbox = verse.parentNode.querySelector('.analysisbox');
    const rightSide = analysisbox.querySelector('.analysisbox_right');
    rightSide.setAttribute('wordid', wordid);

    // Click the first button to open morphology
    analysisbox.querySelector('button').click();
}

function addAnalysisHTML(wordid, verse) {

    // Create Analysis Box
    const analysisbox = verse.cloneNode(true);
    analysisbox.classList.add('analysisbox');

    // Left Side
    const leftSide = analysisbox.childNodes[0];
    const actionitem = leftSide.querySelectorAll(
        '[class^="TranslationViewCell_actionItem"]');

    // Format Action Items
    actionitem[0].remove();
    actionitem[1].remove();
    actionitem[3].remove();
    actionitem[2].querySelector('svg').setAttribute("viewBox", "0 0 448 512");
    actionitem[2].querySelector('path').setAttribute("fill", "currentColor");
    actionitem[2].querySelector('path').setAttribute('d', "M254 52.8C249.3 40.3 237.3 32 224 32s-25.3 8.3-30 20.8L57.8 416 32 416c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-1.8 0 18-48 159.6 0 18 48-1.8 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-25.8 0L254 52.8zM279.8 304l-111.6 0L224 155.1 279.8 304z")
    actionitem[4].querySelector('svg').setAttribute("viewBox", "0 0 512 512");
    actionitem[4].querySelector('path').setAttribute("fill", "currentColor");
    actionitem[4].querySelector('path').setAttribute('d', "M123.6 391.3c12.9-9.4 29.6-11.8 44.6-6.4c26.5 9.6 56.2 15.1 87.8 15.1c124.7 0 208-80.5 208-160s-83.3-160-208-160S48 160.5 48 240c0 32 12.4 62.8 35.7 89.2c8.6 9.7 12.8 22.5 11.8 35.5c-1.4 18.1-5.7 34.7-11.3 49.4c17-7.9 31.1-16.7 39.4-22.7zM21.2 431.9c1.8-2.7 3.5-5.4 5.1-8.1c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208s-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6c-15.1 6.6-32.3 12.6-50.1 16.1c-.8 .2-1.6 .3-2.4 .5c-4.4 .8-8.7 1.5-13.2 1.9c-.2 0-.5 .1-.7 .1c-5.1 .5-10.2 .8-15.3 .8c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c4.1-4.2 7.8-8.7 11.3-13.5c1.7-2.3 3.3-4.6 4.8-6.9l.3-.5z")
    actionitem[5].querySelector('svg').setAttribute("viewBox", "0 0 640 512");
    actionitem[5].querySelector('path').setAttribute("fill", "currentColor");
    actionitem[5].querySelector('path').setAttribute('d', "M88.2 309.1c9.8-18.3 6.8-40.8-7.5-55.8C59.4 230.9 48 204 48 176c0-63.5 63.8-128 160-128s160 64.5 160 128s-63.8 128-160 128c-13.1 0-25.8-1.3-37.8-3.6c-10.4-2-21.2-.6-30.7 4.2c-4.1 2.1-8.3 4.1-12.6 6c-16 7.2-32.9 13.5-49.9 18c2.8-4.6 5.4-9.1 7.9-13.6c1.1-1.9 2.2-3.9 3.2-5.9zM208 352c114.9 0 208-78.8 208-176S322.9 0 208 0S0 78.8 0 176c0 41.8 17.2 80.1 45.9 110.3c-.9 1.7-1.9 3.5-2.8 5.1c-10.3 18.4-22.3 36.5-36.6 52.1c-6.6 7-8.3 17.2-4.6 25.9C5.8 378.3 14.4 384 24 384c43 0 86.5-13.3 122.7-29.7c4.8-2.2 9.6-4.5 14.2-6.8c15.1 3 30.9 4.5 47.1 4.5zM432 480c16.2 0 31.9-1.6 47.1-4.5c4.6 2.3 9.4 4.6 14.2 6.8C529.5 498.7 573 512 616 512c9.6 0 18.2-5.7 22-14.5c3.8-8.8 2-19-4.6-25.9c-14.2-15.6-26.2-33.7-36.6-52.1c-.9-1.7-1.9-3.4-2.8-5.1C622.8 384.1 640 345.8 640 304c0-94.4-87.9-171.5-198.2-175.8c4.1 15.2 6.2 31.2 6.2 47.8l0 .6c87.2 6.7 144 67.5 144 127.4c0 28-11.4 54.9-32.7 77.2c-14.3 15-17.3 37.6-7.5 55.8c1.1 2 2.2 4 3.2 5.9c2.5 4.5 5.2 9 7.9 13.6c-17-4.5-33.9-10.7-49.9-18c-4.3-1.9-8.5-3.9-12.6-6c-9.5-4.8-20.3-6.2-30.7-4.2c-12.1 2.4-24.8 3.6-37.8 3.6c-61.7 0-110-26.5-136.8-62.3c-16 5.4-32.8 9.4-50 11.8C279 439.8 350 480 432 480z")
    actionitem[6].querySelector('svg').setAttribute("viewBox", "0 0 384 512");
    actionitem[6].querySelector('path').setAttribute("fill", "currentColor");
    actionitem[6].querySelector('path').setAttribute('d', "M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z")
    
    // Right Side
    const rightSide = analysisbox.childNodes[1];
    rightSide.setAttribute('class', 'analysisbox_right');
    rightSide.setAttribute('wordid', wordid);
    rightSide.innerHTML = '';

    // Add Button Functionality
    const buttons = analysisbox.querySelectorAll('button');

    buttons[0].addEventListener('click', async function() {
        const wordid = rightSide.getAttribute('wordid');
        const morph = await fetchWordMorphology(wordid);
        rightSide.innerHTML = wordDescriptionHTML(morph);
    });

    buttons[1].addEventListener('click', async function() {
        const wordid = rightSide.getAttribute('wordid');
        rightSide.innerHTML = lemmaSearchHTML(await fetchLemmaSearch(wordid));
    });

    buttons[2].addEventListener('click', async function() {
        const wordid = rightSide.getAttribute('wordid');
        rightSide.innerHTML = rootSearchHTML(await fetchRootSearch(wordid));
    });

    buttons[3].addEventListener('click', function() {
        verse.querySelector('[selected="true"]').setAttribute('selected', false);
        analysisbox.remove();
    });

    // Insert Above Verse
    verse.insertAdjacentElement(
        "beforebegin", analysisbox
    );
}

function wordDescriptionHTML(morph) {
    return `        
    <div style="display:flex; justify-content:center;">
        <div style='float:left; max-width:250px; margin-right:50px; padding-top:5px'">
            ${morphwordHTML(morph.segments, morph.translation)}
        </div>
        <div style='flex:1; max-width:600px; max-height:175px; overflow-y:scroll;'">
            ${wordSummaryHTML(morph.segments)}
        </div>
    </div>`
}

function morphwordHTML(segments, translation) {
    
    let html_element = '<p class="morph-arabic-word">';
    for (let segment of segments) {
        const seg_name = segment.name.replaceAll(' ','_');
        html_element += segment.arabic ? 
        `<span seg_name="${seg_name}">${fixTajweedLetters(segment.arabic)}</span>` : '';
    }
    html_element += '</p>';
    html_element += '<br>'
    html_element += '<p class="morph_transliteration">';
    for (let segment of segments) {
        const seg_name = segment.name.replaceAll(' ','_');
        html_element += segment.phonetic ? 
        `<span seg_name="${seg_name}">${segment.phonetic}</span>` : '';
    }
    html_element += `<br>${translation}`;
    html_element += '</p>';
    
    return html_element;
}

function wordSummaryHTML(segments) {

    let html_element = '';

    for (let segment of segments) {
        const seg_name = segment.name.replaceAll(' ','_');
        html_element += `
        <span class="seg_bullet_point" seg_name="${seg_name}">
            • ${capitalizeFirstLetter(segment.name)}: 
        </span>
        <span>
            ${capitalizeFirstLetter(segment.description)}
        </span>
        <br>`
    }
    return html_element;
}

function lemmaSearchHTML(response) {
    
    const titleText = response.matchingSegments == null ?
        'is unique to this verse!':
        'also appears in these verses:';

    return `
    <div style=" max-height:250px; overflow-y:scroll; display:flex; text-align:center; flex-direction:column; align-items:center;">
        <p style="padding-top:5px;">
            <span style="font-size:25px;">The word </span>
            <span style="font-size:35px;" class="highlighted_word similar-arabic-word">
                ${response.search}
            </span>
            <span style="font-size:25px;"> ${titleText}</span>
        </p>
        <br>
        ${verseSegmentsHTML(response.matchingSegments)}
    </div>`;
}

function rootSearchHTML(response) {
    
    let titleText = '';

    if (response.search == null) {
        titleText += `
        <span style="font-size:25px;">
            This word does not have a root.
        </span>`;
    } else {
        titleText += `
        <span style="font-size:25px;">The root </span>
        <span style="font-size:35px;" class="highlighted_word similar-arabic-word">
            ${response.search.split('').join(' ')}
        </span>
        <span style="font-size:25px;"> ${
            response.matchingSegments == null ?
            'is unique to this word form!':
            'also takes these forms:'
        }</span>`;
    }

    return `
    <div style=" max-height:250px; overflow-y:scroll; display:flex; text-align:center; flex-direction:column; align-items:center;">
        <p style="padding-top:5px;">
            ${titleText}
        </p>
        <br>
        ${verseSegmentsHTML(response.matchingSegments)}
    </div>`;
}

function verseSegmentsHTML(segments) {

    let html_element = '';

    if (segments == null) return '';

    for (let segment of segments) {

        let location = '<p>';

        if (segment.highlightedTokenLemma != null) {
            location += `
            <span>As the word </span>
            <span style="font-size:25px;" class="highlighted_word similar-arabic-word">
                ${segment.highlightedTokenLemma}
            </span>
            `;
        }

        let arabic = '<p style="max-width:500px;" class="similar-arabic-word">';
        let translation = '<p style="max-width:500px;">';

        if (segment.firstTokenIncluded == false) { translation += '... '; }
        if (segment.firstTokenIncluded == false) { arabic += '... '; }

        for (let token of segment.tokens) {

            if (token.location.tokenNumber === segment.highlightedTokenNumber) {

                arabic += `<span class="highlighted_word">${fixTajweedLetters(token.arabic)} </span>`;
                translation += `<span class="highlighted_word">${token.translation} </span>`;
                const c = token.location.chapterNumber;
                const v = token.location.verseNumber;
                const t = token.location.tokenNumber;
                
                location += `<a href=https://www.quran.com/${c}?startingVerse=${v}> in ${c}:${v}, word number ${t}:</a>`;

            } else {

                arabic += fixTajweedLetters(token.arabic) + ' ';
                translation += token.translation + ' ';
            }
        }

        if (segment.lastTokenIncluded == false) { translation += ' ... '; }
        if (segment.lastTokenIncluded == false) { arabic += ' ... '; }

        location += '</p>'
        arabic += '</p>';
        translation += '</p>';

        html_element += location + arabic + translation + '<br>';
    }

    return html_element;
}

function capitalizeFirstLetter(str) {
    if (str.length === 0) return str; // Return an empty string if input is empty
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function fixTajweedLetters(word) {
    word = word.replaceAll('\u{06DF}','\u{0652}'); // @
    word = word.replaceAll('\u{06E3}','\u{06DC}'); // ;
    word = word.replaceAll('\u{06EB}','\u{06EC}'); // +
    // meem ??
    return word;
}

const _FETCH_DOMAIN = 'https://quran-word-api-991bb13e306b.herokuapp.com';
// const _FETCH_DOMAIN = 'http://127.0.0.1:8080';

function fetchWordMorphology(location) {
    return new Promise((resolve, reject) => {
    fetch(`${_FETCH_DOMAIN}/morphology/word?location=${location}`,
    {method:'GET', headers:{'Content-Type':'application/json'}, mode:'cors'})
    .then(response => response.json()).then (data => {
        resolve(data);
    }).catch(error => {
        console.error('Error fetching word morphology:', error);
        reject(error);
    });})
}

function fetchLemmaSearch(location) {
    return new Promise((resolve, reject) => {
    fetch(`${_FETCH_DOMAIN}/morphology/lemmasearch?location=${location}`,
    {method:'GET', headers:{'Content-Type':'application/json'}, mode:'cors'})
    .then(response => response.json()).then (data => {
        resolve(data);
    }).catch(error => {
        console.error('Error fetching lemma search:', error);
        reject(error);
    });})
}

function fetchRootSearch(location) {
    return new Promise((resolve, reject) => {
    fetch(`${_FETCH_DOMAIN}/morphology/rootsearch?location=${location}`,
    {method:'GET', headers:{'Content-Type':'application/json'}, mode:'cors'})
    .then(response => response.json()).then (data => {
        resolve(data);
    }).catch(error => {
        console.error('Error fetching root search:', error);
        reject(error);
    });})
}
