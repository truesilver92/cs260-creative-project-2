// api key: 285841-6b80b863a4aaf11d4dab01bf0
const baseurl = "https://pixabay.com/api/?key=285841-6b80b863a4aaf11d4dab01bf0";
const search_box = document.getElementById("search-box");

const keyup_f = () => {
    let search_text = search_box.value;
    let debounce = _.debounce(
        async () => {
            console.log(baseurl + '&q=' + escape(search_text));
            let results = await fetch(baseurl + '&q=' + escape(search_text));
            console.log(results);
            search_box.removeEventListener('keyup', debounce.cancel);
        }, 300);
    _.defer(debounce);
    search_box.addEventListener('keyup', debounce.cancel);
    return true;
};

search_box.addEventListener('keyup', keyup_f);
