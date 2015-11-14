function validateInputSize() {
    if ($(this)[0].value.length > 140) {
        $(this).parent().parent().addClass('has-error');
    }
    else {
        $(this).parent().parent().addClass('has-success');
    }
};

function appendShare(embed_copy, meta) {
    var headerCopy = '<div class="col-lg-4 col-sm-12"><article class="tweet">'
    headerCopy += '<header><img src="http://fillmurray.com/25/25" />'
    headerCopy += '<p class="contributor">Recommended by <span class="name">'+meta['userName']+' '+meta['userLastname']+' on November 15, 2015.</p>'
    headerCopy += '<p>'+meta['reason']+'</p></header>'
    headerCopy += '<div class="content">'+embed_copy+'</div></article></div>'
    console.log(headerCopy);
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
                appendShare(embed, meta);
            })
    } else if (link.indexOf('twitter.com') > -1 || link.indexOf('t.co') > -1) {
        $.getJSON('http://api.twitter.com/1/statuses/oembed.json?callback=?&url='+link, {
                format: 'json',
                dataType: 'jsonp',
            })
            .done(function(data) {
                embed = data.html;
                appendShare(embed, meta);
            });
    } else {
        embed = "<div><p>"+link+"</p></div>";
        appendShare(embed, meta);
    }
    //console.log(embed);
};

$(document).ready(function() {
    $('#inputReason').on('keyup', validateInputSize);
    $('#submitNewLink').on('click', scrapeLink);
});
