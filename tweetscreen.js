// https://github.com/jasonmayes/Twitter-Post-Fetcher
var TFconfig = {
    "id": '737239900194492416',
    "domId": '',
    "maxTweets": 20,
    "enableLinks": true,
    "showUser": true,
    "showTime": false,
    "showInteraction": false,
    "showImages": true,
    "showPermalinks": false,
    "customCallback": handleTweets,
};

/*var removeElements = function(text, selector) {
    var wrapped = $("<div>" + text + "</div>");
    wrapped.find(selector).remove();
    return wrapped.html();
}*/

var tweetTexts = [];

function handleTweets(tweets){
    var n = 0,
        element = $('#main'),
        html = '<ul>';
    shuffle(tweets);
    while (n < tweets.length) {
        var tweet = tweets[n], // string
            dummyElement = $('<div></div>');
        // Create dummy element in order to edit the HTML using jQuery before displaying
        dummyElement.html(tweet);
        var userLink = $('a[data-scribe="element:user_link"]', dummyElement),
            avatar = $('img[data-scribe="element:avatar"]', dummyElement);

        /* Edit the HTML */
        $('span[data-scribe="element:verified_badge"]', dummyElement).remove();
        // Replace pointless span containing avatar with the avatar
        $('span:has(img)', dummyElement).replaceWith(avatar);
        // Wrap display name & @username in a div to control display
        $('a[data-scribe="element:user_link"] > span', dummyElement).wrapAll('<div></div>');
        // Remove URLs to keep a clean appearance
        $('p.tweet a[data-scribe="element:url"], p.tweet a[data-scribe=""]', dummyElement).remove();
        // Unwrap spans within anchors so typed.js is smoother
        $('p.tweet a > span', dummyElement).contents().unwrap();
        // Remove emoji
        $('p.tweet img', dummyElement).remove();


        var tweetText = $('p.tweet', dummyElement)[0].innerHTML;
//        console.log("tweet text", tweetText);
        tweetTexts.push(tweetText);
//        $('p.tweet', dummyElement).wrap('<div class="typed-strings"></div>').parent();

        html += '<li>' + dummyElement.html() + '</li>';
//        var img = $('img[data-scribe="element:avatar"]'),
//            imgSizeRegex = /(_bigger)(?=\.jpg|\.jpeg|\.png|\.gif)/;
//        img.replace(imgSizeRegex);
        n++;
    }
    html += '</ul>';

//    console.log(tweetTexts);
    element.html(html);
}

twitterFetcher.fetch(TFconfig);

// https://github.com/coolaj86/knuth-shuffle
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue,
        randomIndex;
    while (0 !== currentIndex) { // While there remain elements to shuffle
        // Pick a remaining element
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function getCurrentSlide() {
    return $('ul li:first-of-type');
}
funciton getCurrentTweet() {
    return $("ul li:first-of-type p.tweet");
}


$(window).load(function() {
    var slides = $('ul li'),
        numSlides = slides.length,
        timer = 10000,
        index = 0,
        typeRate = -30,
        slideRate = 400;

    getCurrentSlide().fadeIn(200);
    // https://github.com/mattboldt/typed.js/
    getCurrentTweet().typed({
        strings: [tweetTexts[index]],
        typeSpeed: typeRate,
        showCursor: false,
        contentType: 'html'
    });
    var intervalID = setInterval(function() {
        getCurrentSlide().slideUp(slideRate, function() {
            console.log(index);
            getCurrentSlide().remove();
            index++;
            getCurrentSlide().slideDown(slideRate);
//            console.log("foo", tweetTexts[index]);
            getCurrentTweet().typed({
                strings: [tweetTexts[index]],
                typeSpeed: typeRate,
                showCursor: false,
                contentType: 'html'
            });

            if (index === numSlides) {
                clearInterval(intervalID);
            }
        });
    }, timer);

    /*function transition() {
        $('ul li:first-of-type div.media').fadeIn

    }*/


    /*$('#play-pause').click(function() {
        if (this === "Pause") {
            clearInterval(intervalID);
            this.html('Play');
        }

    })

        function sleep(time) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > time){
                break;
            }
        }
    }*/

});
