const API_TOKEN = 'pk.eyJ1Ijoiam9oYW5raXZpIiwiYSI6ImNrcnl6M25xMDA4aWUyd3BqY3EzYnA1NTEifQ.ve5rEn8ZDwUGKvphMkEdpw';
//9083a395-a31a-4bbd-a61d-1325c68a36ad
const API_KEY = '9083a395-a31a-4bbd-a61d-1325c68a36ad';


const buttonElem = document.querySelector('#get-button');
const stopsElem = document.querySelector('#stop-content')

/*---------------VISA STOP OCH KARTA---------------------- */
function showOnMap(position) {
    mapboxgl.accessToken = API_TOKEN;
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [position.coords.longitude, position.coords.latitude],
        zoom: 13
    });

    new mapboxgl.Marker().
    setLngLat([position.coords.longitude, position.coords.latitude]).
    addTo(map);
}


buttonElem.addEventListener('click', () => {
    if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition((position) => {
        console.log(position);
        console.log(position.coords.longitude)
        console.log(position.coords.latitude)

        //showOnMap(position);
        getStops(position);
        
       });
    }
    
});



async function getStops (position) {
    const respone = await fetch(`https://api.resrobot.se/v2.1/location.nearbystops?format=json&accessId=${API_KEY}&originCoordLat=${position.coords.latitude}&originCoordLong=${position.coords.longitude}`)
    const data = await respone.json();
    const stopList = data.stopLocationOrCoordLocation.map((item) => {
        return item.StopLocation.name;
    });
    const stopTime = data.stopLocationOrCoordLocation.map((item) => {
        return item.StopLocation.extId;
    })
    const stop = data.stopLocationOrCoordLocation;
    
    console.log(data.stopLocationOrCoordLocation)
    console.log(stopTime)
    console.log(stopList);
    printStops(stop);



}

function printStops(stop) {
    stopsElem.innerHTML = stop.map((stop) => {
        return `<li id="stop-time-id" onclick="showStopTimes(${stop.StopLocation.extId})">${stop.StopLocation.name}</li>`;
    }).join("");
}

/*----------------------------------------------------------------------- */

//addeventListner click för fetch av den hållplatsen

async function showStopTimes(id) {
const stopTimesId = document.querySelector("#stop-id");


const respone = await fetch(`https://api.resrobot.se/v2.1/departureBoard?id=${id}&format=json&accessId=${API_KEY}`)
const data = await respone.json();
console.log(data)


let stopsList = [];

for (i = 0; i < 10; i++) {
    if (data.Departure[i].time) {
        stopsList.push({
                time: data.Departure[i].time,
                name: data.Departure[i].name.replace("Länstrafik -", ""),
                direction: data.Departure[i].direction
            })
    }
    
}
console.log(stopsList)

stopTimesId.innerHTML = stopsList.map((item) => {
    return `<p>${item.name}, ${item.direction}, Tid: ${item.time}</p>`
}).join("")



};

//------------PROFILBILD--------------------//

const cameraButton = document.querySelector('#take-pic');
const preVideoElem = document.querySelector('#camera');
const takeProfile = document.querySelector('#take-profile');
const profilePreView = document.querySelector('#picture');
const profilePic = document.querySelector('#profile-picture')

const ctx = profilePreView.getContext('2d');

let video;
const images = [];

cameraButton.addEventListener('click', async () => {
    if ('mediaDevices' in navigator) {
        video = await navigator.mediaDevices.getUserMedia({ video: true, audio: false})
        preVideoElem.srcObject = video;
    }
})

takeProfile.addEventListener('click', () => {
    ctx.drawImage(preVideoElem, 0, 0, 640, 480);
    const imgData = profilePreView.toDataURL('image/png');
    images.push({
        id: "Profile pic",
        image: imgData
    });

    localStorage.setItem('cameraApp', JSON.stringify(images));

    video.getTracks().forEach(track => {
        track.stop();
    });
    cameraButton.style.display = "none";
    preVideoElem.style.display = "none";
    takeProfile.style.display = "none"; 
    //getImages();
})

function createImage(image) {
    const imageElem = document.createElement('img');
    imageElem.setAttribute('src', image.image);

    profilePic.append(imageElem);
}

function getImages() {
 

    const images = JSON.parse(localStorage.getItem('cameraApp'));

    for(const image of images) {
        createImage(image);
    }

}

getImages();
showProfilePic();

function showProfilePic() {
    if (localStorage.getItem('cameraApp') === null) {
        //getImages();
    } else {
        cameraButton.style.display = "none";
        preVideoElem.style.display = "none";
        takeProfile.style.display = "none"; 
        getImages();
    }
}

function dontShow() {
    
}