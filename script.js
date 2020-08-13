const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

let imagesLoaded = 0;
let totalImages = 0;
let ready = false;
let photosArray = [];
let initialLoad = true;

//check if all the images were loaded
function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    loader.hidden = true;
    ready = true;
  }
}

//Helper function to set attributes on DOM Elements
function setAttributes(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

//Unsplash API
const apiKey = 'e1r1XQLkAflKrvnvB1OghAxuOs57d5_eM44Nx5A2Nb0';
const count = 5;
const apiUrl = `https://api.unsplash.com/photos/random?client_id=${apiKey}&count=${count}`;

//Create Elements for Photos and Add them to DOM
function displayPhotos() {
  imagesLoaded = 0;
  totalImages = photosArray.length;
  //Run function for each object in photosArray
  photosArray.forEach(photo => {
    //create <a> to link to Unsplash
    const item = document.createElement('a');
    setAttributes(item, {
      href: photo.links.html,
      target: '_blank'
    });
    //create <img> for photo
    const img = document.createElement('img');
    setAttributes(img, {
      src: photo.urls.regular,
      alt: photo.alt_description,
      title: photo.alt_description
    });
    //Event Listener, when image has finished loading
    img.addEventListener('load', imageLoaded);
    //put <img> inside <a>, then put <a> inside image container 
    item.appendChild(img);
    imageContainer.appendChild(item);
  });
}

//Check to see if scrolling near bottom of the page, load more photos
window.addEventListener('scroll', () => {
  if (innerHeight + scrollY >= document.body.offsetHeight - 1000 && ready) {
    ready = false;
    getPhotos();
  }
});

//Get photos from Unsplash API
async function getPhotos() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Something went wrong!!');
    }
    photosArray = await response.json();
    if (initialLoad) {
      count = 30;
      initialLoad = false;
    }
    displayPhotos();
  } catch (error) {
    console.log('whoops:' + error.message);
  }
}

getPhotos();