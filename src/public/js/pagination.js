let currentPage = getParameterByName("page") || 1;
function prevPage(){
    if(currentPage >1){
        --currentPage;
        window.location.href = `/books?page=${currentPage}`;
    }
}
function nextPage(){
    if(currentPage < $("#pagination").find("li").length - 2){
        ++currentPage;
        window.location.href = `/books?page=${currentPage}`;
    }
}
function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}