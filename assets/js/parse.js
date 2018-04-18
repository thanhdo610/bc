var cvt = new showdown.Converter();
var content 
$( document ).ready(function() {
    $('a.nav-link').click(function(){
        var dcnt = $(this).attr('data-content');
        parsingContent(dcnt);
    });

    
    if(window.location.hash) {
        var hash = window.location.hash.substring(1);
        parsingContent(hash);
        // hash found
    } else {
        parsingContent('get_start');
    }
});

function parsingContent(dcnt){
    var content = '';
    switch(dcnt) {
        case 'env_hfabric':
            content = env_hfabric;
            break;
        case 'env_eth':
            content = env_eth;
            break;
        case 'dev_hfabric':
            content = dev_hfabric;
            break;
        case 'dev_eth':
            content = dev_eth;
            break;
        case 'get_start':
            content = get_start;
            break;
        default:
            content = get_start;
    }
    $('main').html(cvt.makeHtml(content));
}