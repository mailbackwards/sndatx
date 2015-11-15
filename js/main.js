function validateInputSize() {
    if ($(this)[0].value.length > 140) {
        $(this).parent().parent().addClass('has-error');
    }
    else {
        $(this).parent().parent().addClass('has-success');
    }
};

function appendShare(embed_copy, meta, html_class) {
    var headerCopy = '<article class="'+html_class+'">'
    headerCopy += '<header><img src="http://fillmurray.com/25/25" />'
    headerCopy += '<span><a class="thumbsup"><i class="glyphicon glyphicon-star-empty"></i></a> <span class="like-counter">0</span></span>'
    headerCopy += '<p class="contributor">Recommended by <span class="name">'+meta['userName']+' '+meta['userLastname']+' <span class="role contributor">contributor</span> on November 15, 2015.</p>'
    headerCopy += '<p>'+meta['reason']+'</p></header>'
    headerCopy += '<div class="content">'+embed_copy+'</div></article>'
    $('article').last().append(headerCopy);
}

function scrapeLink() {
    event.preventDefault();
    var meta = {
        'userName': $('#inputUsername').val(),
        'userLastname': $('#inputUserLastname').val(),
        'userEmail': $('#inputUserEmail').val(),
        'reason': $('#inputReason').val(),
    }
    var link = $('#inputLink').val();
    var embed = '';

    if (link.indexOf('youtube.com') > -1 || link.indexOf('youtu.be') > -1) {
        $.getJSON('https://noembed.com/embed?callback=?', {
                format: 'json',
                url: link
            })
            .done(function(data) {
                embed = data.html;
                appendShare(embed, meta, 'video');
            })
    } else if (link.indexOf('twitter.com') > -1 || link.indexOf('t.co') > -1) {
        $.getJSON('http://api.twitter.com/1/statuses/oembed.json?callback=?&url='+link, {
                format: 'json',
                dataType: 'jsonp',
            })
            .done(function(data) {
                embed = data.html;
                appendShare(embed, meta, 'tweet');
            });
    } else {
        $.getJSON('http://api.embed.ly/1/oembed', {
                key: 'd16b64773ea44778a3542f84f8020ce7',
                url: link,
            })
            .done(function(data) {
                embed = '<img src="'+data.thumbnail_url+'" height="180" width="180" /><h1>'+data.title+'</h1><p class="quote"></p>';
                embed += '<p class="source">by '+data.author_name+', '+data.provider_name+'</p>'
                appendShare(embed, meta, 'story content-inner')
            });
    };
};

function toggleFavorite() {
    var icoElem = $(this)[0].firstChild;
        counterElem = $(this)[0].nextElementSibling;
    var count = parseInt(counterElem.innerHTML);
    if ($.inArray('glyphicon-star-empty', icoElem.classList) > -1) {
        // it's not favorited yet
        count += 1;
        icoElem.className = 'glyphicon glyphicon-star'
    } else {
        // it's already favorited
        count -= 1;
        icoElem.className = 'glyphicon glyphicon-star-empty'
    }
    counterElem.innerHTML = count.toString();
};

$(document).ready(function() {
    $('#inputReason').on('keyup', validateInputSize);
    $('#submitNewLink').on('click', scrapeLink);
    $('.thumbsup').on('click', toggleFavorite);
});
