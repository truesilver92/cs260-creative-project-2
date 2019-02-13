// api key: 285841-6b80b863a4aaf11d4dab01bf0
const baseurl = "https://pixabay.com/api/?key=285841-6b80b863a4aaf11d4dab01bf0";
const search_box = document.getElementById("search-box");
var image_index = 0;

// Search box event listener
const keyup_f = () => {

    let search_text = search_box.value;

	// "fetch" wrapper function
    let api_search = async () => {
        let results = await fetch(baseurl + '&q=' + escape(search_text));
		let json = await results.json();
        console.log(json);
		search_box.removeEventListener('keyup', debounce.cancel);

		// Format results
		let DOM_Node = document.getElementById("content");
		setBackgroundImage(json.hits[0]);
		setImageMeta(json.hits[0]);


    };

	// Call fetch wrapper only once
    let debounce = _.debounce(api_search, 300);
    _.defer(debounce);

    search_box.addEventListener('keyup', debounce.cancel);
    return true;
};

search_box.addEventListener('keyup', keyup_f);

const setBackgroundImage = (jsonImage) => {
	let imageDOM = document.getElementById('mainImage');
	imageDOM.src = jsonImage.largeImageURL;
}

const setImageMeta = (jsonImage) => {
	let str = "Views: " + jsonImage.views.toLocaleString();
	str += " | By: " + jsonImage.user;
	str += " | Tags: " + jsonImage.tags;
	str += ' | <a target="new" href="' + jsonImage.pageURL + '">View Original</a>';

	let DOM_Node = document.getElementById('imageMeta');
	DOM_Node.innerHTML = str;
}
