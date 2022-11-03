import '../sass/main.scss';
import { COORDS } from "./config.js";
import { geojson } from "./geojson";
import mapMarker from 'url:../svg/marker.svg';
import { myFeatureFunction } from './handlers';
import { myMapFunction } from '../js/handlers';
import { mySpeakerFunction } from '../js/handlers';


// Import all event listeners and handlers from handlers
myFeatureFunction('click');
myFeatureFunction('mouseover');
myFeatureFunction('mouseout');
myMapFunction('click');
myMapFunction('mouseover');
myMapFunction('mouseout');
mySpeakerFunction('click');
mySpeakerFunction('mouseover');
mySpeakerFunction('mouseout');


// Put the map together and add the markers
const showMapMarkers = function () {
    // Put map on page from position (HARD CODED for now)
    if (navigator.geolocation) {

        const map = L.map('map', {closePopupOnClick: false, scrollWheelZoom: false,}).setView(COORDS, 12);

        // Define the tiling
        const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        });
        
        // Innitialise the map
        osm.addTo(map);

        const geoJsonAdded = L.geoJSON(geojson, {

            pointToLayer: function(feature = {}, latlng) {

                const { properties = {} } = feature;     // define properties as object from feature
                const { busName } = properties;
                    
                // create a marker style / we innitialise it
                const logoMarkerStyle = L.Icon.extend({
                    options: {
                        iconSize: [38, 38],
                        iconAnchor: [16, 38],
                        popupAnchor: [4, -34],
                        // onClick: markerOnClick,
                    }
                });
        
                var logoMarker = new logoMarkerStyle({iconUrl: mapMarker})
                var popup2 = L.popup({maxWidth: 400, className: 'business-popup', closeButton: false})
                    .setLatLng(latlng)
                    .setContent(`${busName}`).openPopup();

                // We return for each the larker on map and add the mouseover for mobile
                return L.marker(latlng, 
                    {icon: logoMarker}) 
                    // {popup: myPopup})
                    // .on('click', markerOnClick)
                    .on('mouseover', function() {
                    this.bindPopup(popup2).openPopup();
                });
                                
            },

            // Using on each: we go through each of the features and add an addEventListener
            // in leaflets way to if clicked run the function "markerOnClick"
            onEachFeature: (feature = {}, layer) => {

                L.featureGroup([layer])
                    .on('click', markerOnClick);
            }

            
        })
        
        // EasyPopup
        var helloPopup = L.popup().setContent('CLICK MARKER TO SEE MORE').openPopup();
        L.easyButton('fa-info', function(btn, map){
            helloPopup.setLatLng(map.getCenter()).openPopup().openOn(map);
        }).addTo(map);


        geoJsonAdded.addTo(map);


        
        // Determine the bounds and extent the map covers when opening based on markers
        map.fitBounds(geoJsonAdded.getBounds(), {
            padding: [60,80]
        });
    }
};


// Main function after reading geojson and runs all others
function markerOnClick(e) {

    // console.log(e.target);
    //console.log("Hi");

    const obj = e.propagatedFrom.feature.properties;
    console.log(obj);
    const sellerClickedName = obj.busName;
    console.log(sellerClickedName);
    // const sellerClickedLc = sellerClickedName.toLowerCase();
    const sellerClickedContact = obj.contact;
    const sellerClickedNumber = obj.number;
    const sellerClickedAddress = obj.address;
    const sellerClickedEmail = obj.email;
    const sellerClickedWww = obj.www;
    const sellerClickedB1 = obj.blurb1;
    const sellerClickedB2 = obj.blurb2;

    const picName = sellerClickedName
    .toLowerCase()
    .split(' ')
    .join('');

    const popup = document.querySelector('.popup-wrapper');
    const close = document.querySelector('.popup-close');
    const popArea = document.querySelector('.popup-wrapper');
    popArea.innerHTML = " ";

    const htm = `

        <div class="popup">
            <div class="popup-close">X</div>
            <div class="popup-content">
                <h2 class="heading-secondary">${sellerClickedName} - ${sellerClickedContact}</h2>
                <h4 class="heading-secondary__sub">${sellerClickedAddress} - ${sellerClickedNumber} - ${sellerClickedEmail}</h4>
                <img class="popup-img" src="https://zenergy.site/storage/adlocal/${picName}.jpg"  alt="${sellerClickedName}" />
                <p class="paragraph"> ${sellerClickedB1} - ${sellerClickedB2}</p>


                ${sellerClickedWww  ? `<a class="popup-link" href="${sellerClickedWww}" target="_blank">Visit our website</a></div></div>` : '</div></div>'}

                `;
                
                // ${sellerClickedWww ? <a class="popup-link" href="${sellerClickedWww}
                // '" target="_blank">View company</a></div></div>'` : `</div></div>'}`
        

    popArea.innerHTML = htm;

        // on click set the display from none to block
        popup.style.display = 'block';

    
        close.addEventListener('click', () => {
            // on click set the display from none to block
            popup.style.display = 'none';
        })
        
        // Also make the popup close if we click anywhere on the page
        popup.addEventListener('click', () => {
            // on click set the display from none to block
            popup.style.display = 'none';
        })

}

const showFeatured = (dta) => { 

    const featuredArea = document.querySelector('.feature'); 
    featuredArea.innerHTML = "";

    const { features: companies = [] } = dta;
    const companiesRegistered = companies.length;

    // let companySelectedTwo
    // Get a random number between 1 and companyRegistered
    const companySelectedOne = (Math.trunc(Math.random() * companiesRegistered) + 1);
    
    let companySelectedTwo = (Math.trunc(Math.random() * companiesRegistered) + 1);
    
    while (companySelectedOne === companySelectedTwo){
        companySelectedTwo = (Math.trunc(Math.random() * companiesRegistered) + 1)
    }

    const nOne = companySelectedOne -1;
    const nTwo = companySelectedTwo -1;

    const compOne = companies[nOne].properties;
    const compTwo = companies[nTwo].properties;

    // console.log(compOne.busName);
    // console.log(compTwo.busName);

    const picNameOne = compOne.busName
    .toLowerCase()
    .split(' ')
    .join('');

    const picNameTwo = compTwo.busName
    .toLowerCase()
    .split(' ')
    .join('');

    // console.log(picNameOne);
    // console.log(picNameTwo);

    let html = `

        <div class="feature__box"><div class="feature__box--splash">Featured</div>
            <h2 class="feature__box--cardheader">${compOne.busName}</h2>
            <img class="feature__box--cardimg" src="https://zenergy.site/storage/adlocal/${picNameOne}.jpg" alt="${compOne.busName}" />
            <p class="feature__box--cardtext">${compOne.blurb2}</p>
        </div>

        <div class="feature__box"><div class="feature__box--splash">Featured</div>
            <h2 class="feature__box--cardheader">${compTwo.busName}</h2>
            <img class="feature__box--cardimg" src="https://zenergy.site/storage/adlocal/${picNameTwo}.jpg" alt="${compTwo.busName}" />
            <p class="feature__box--cardtext">${compTwo.blurb2}</p>
        </div>
        
    `;

    featuredArea.innerHTML = html;


};

const listingArea = document.querySelector('.listing');

const showListing = (dta) => {

    const { features: companies = [] } = dta;
    const companiesRegistered = companies.length;



    // const { properties: list } = companies;
    listingArea.innerHTML = "";
    companies.forEach(company => {
        const dta = company.properties;

        const picName = dta.busName
        .toLowerCase()
        .split(' ')
        .join('');

        // console.log(picName);

  
        let html = `
            <div class="box">
                <img src="https://zenergy.site/storage/adlocal/${picName}-logo.png" alt="${dta.busName}" class="box__right--img">
                <div class="box__ad">
                    <h3 class="box__left--company">${dta.busName} - ${dta.contact}</h3>
                    <p class="box__left--location">${dta.address} - ${dta.number}</p>
                    <p class="box__left--text">${dta.blurb1} - ${dta.blurb2}</p>
                </div>  
            </div>
        `;

        listingArea.insertAdjacentHTML("afterbegin", html);
    });
    

};

    // console.log(property.properties.busName));

showMapMarkers();
showListing(geojson)
showFeatured(geojson);
// showActiveSellerThumbs();
// eventHandler();




