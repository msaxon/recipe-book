const urlPattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', // fragment locator
    'i'
);

export const isUrl = (url) => {
    return !!urlPattern.test(url);
};

export const getVisibleText = node => {
    if( node.nodeType === Node.TEXT_NODE ) return node.textContent;
    var style = getComputedStyle( node );
    if( style && style.display === 'none' ) return '';
    var text = '';
    for( var i=0; i<node.childNodes.length; i++ ) 
        text += getVisibleText( node.childNodes[i] );
    return text;
}
