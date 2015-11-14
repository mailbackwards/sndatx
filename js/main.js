function validateInputSize() {
    if ($(this)[0].value.length > 140) {
        $(this).parent().parent().addClass('has-error');
    }
    else {
        $(this).parent().parent().addClass('has-success');
    }
};

function renderYoutube(url) {

}
function renderTwitter(url) {
    console.log('HERE');
    $.getJSON('http://api.twitter.com/1/statuses/oembed.json?callback=?&url='+url, {
        format: 'json',
        dataType: 'jsonp',
    })
    .done(function(data) {
        return data.html;
    });
}

function scrapeLink() {
    event.preventDefault();
    var userName = $('#inputUserName').val();
        userEmail = $('#inputUserEmail').val();
        link = $('#inputLink').val();
        reason = $('#inputReason').val();
        embed = '';

    if (link.indexOf('youtube.com') > -1 || link.indexOf('youtu.be') > -1) {
        $.getJSON('https://noembed.com/embed?callback=?', {
                format: 'json',
                url: link
            })
            .done(function(data) {
                embed = data.html;
            })
    } else if (link.indexOf('twitter.com') > -1 || link.indexOf('t.co') > -1) {
        $.getJSON('http://api.twitter.com/1/statuses/oembed.json?callback=?&url='+link, {
                format: 'json',
                dataType: 'jsonp',
            })
            .done(function(data) {
                embed = data.html;
            });
    } else {
        embed = "<div><p>"+link+"</p></div>";
        console.log(embed);
    }
    //console.log(embed);
};

$(document).ready(function() {
    $('#inputReason').on('keyup', validateInputSize);
    $('#submitNewLink').on('click', scrapeLink);
});
