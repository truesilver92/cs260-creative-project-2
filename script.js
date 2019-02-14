// api key: 285841-6b80b863a4aaf11d4dab01bf0
const baseurl = "https://pixabay.com/api/?key=285841-6b80b863a4aaf11d4dab01bf0";
const search_box = document.getElementById("search-box");
var image_index = 0;
var imgs = [];

const on_window_resize = () => {
    setBackgroundImage(imgs[image_index]);
};
window.addEventListener('resize', on_window_resize);

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

                imgs = json.hits;
    };

	// Call fetch wrapper only once
    let debounce = _.debounce(api_search, 300);
    _.defer(debounce);

    search_box.addEventListener('keyup', debounce.cancel);
    return true;
};

search_box.addEventListener('keyup', keyup_f);

const setBackgroundImage = async (jsonImage) => {
    let start_time = Date.now();
    let imageDOM = document.getElementById('imageWrapper');
    imageDOM.classList.add('faded');

    let newImage = document.createElement('img');
    newImage.src = jsonImage.largeImageURL;
    newImage.id = 'mainImage';

    let clientWidth = document.documentElement.clientWidth;
    let clientHeight = document.documentElement.clientHeight;
    let width = jsonImage.imageWidth;
    let height = jsonImage.imageHeight;

    // scale images down/up keeping aspect ratio
    const width_match_screen = () => {
        let factor = clientWidth / width;
        width = clientWidth;
        height = factor * height;
    };
    const height_match_screen = () => {
        let factor = clientHeight / height;
        height = clientHeight;
        width = factor * width;
    };
    width_match_screen();
    height_match_screen();
    if(width < clientWidth)
        width_match_screen();
    newImage.style.width = width.toString() + 'px';
    newImage.style.height = height.toString() + 'px';

    // move image so image center = screen center
    newImage.style.marginLeft = (width / -2).toString() + 'px';
    newImage.style.marginTop = (height / -2).toString() + 'px';

    newImage.onload = () => {
        let loaded_time = Date.now();
        let elapsed_time = loaded_time - start_time;

        const switch_imgs = () => {
            imageDOM.innerHTML = '';
            imageDOM.appendChild(newImage);
            imageDOM.classList.remove('faded');
            setImageMeta(jsonImage);
        };
        
        if(elapsed_time < 800) {
            let wait_time = 800 - elapsed_time;
            setTimeout(switch_imgs, wait_time);
        }
        else
            switch_imgs();
    };
};

const setImageMeta = (jsonImage) => {
	let str = "Views: " + jsonImage.views.toLocaleString();
	str += " | By: " + jsonImage.user;
	str += " | Tags: " + jsonImage.tags;
	str += ' | <a target="new" href="' + jsonImage.pageURL + '">View Original</a>';

	let DOM_Node = document.getElementById('imageMeta');
	DOM_Node.innerHTML = str;
};

const next_image = () => {
    image_index = (image_index + 1) % imgs.length;
    setBackgroundImage(imgs[image_index]);
};
document.getElementById("next").addEventListener('click', next_image);

const previous_image = () => {
    if(image_index === 0)
        image_index = imgs.length - 1;
    else
        image_index -= 1;
    setBackgroundImage(imgs[image_index]);
};
document.getElementById("previous").addEventListener('click', previous_image);
