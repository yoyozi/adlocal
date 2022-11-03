// Tooltips
const featuredBtn = document.querySelector('.banner__f');
const feature = document.querySelector('.feature');
const mapBtn = document.querySelector('.banner__m');
const speakerBtn = document.querySelector('.banner__sp');

const map = document.querySelector('.map');

// Feature and map switching with svg
let fhtml;
let mhtml;

import mapOn from 'url:../svg/map-on.svg';
import mapOff from 'url:../svg/map-off.svg';
import featureOn from 'url:../svg/star-full.svg';
import featureOff from 'url:../svg/star-empty.svg';

export const myFeatureFunction =  function(event) {

    featuredBtn.addEventListener(event, function(e){
        if(event === 'mouseover'){
            console.log('You moused over');
            const featureTooltip = document.querySelector('.tip_f');
            featureTooltip.classList.add('showtip');
            
        }
        if(event === 'mouseout'){
            console.log('You moused out');
            const featureTooltip = document.querySelector('.tip_f');
            featureTooltip.classList.remove('showtip');
        }

        if(event === 'click'){
            console.log('You clicked');
            e.preventDefault();
            if (featuredBtn.classList.contains('active')) {
                fhtml = `<img class="banner__marker" src="${featureOff}"alt="Turn Off">`;
                featuredBtn.innerHTML = "";
                featuredBtn.innerHTML = fhtml;
                
                featuredBtn.classList.remove('active');
                feature.classList.add('feature-hide')

            } else {
                fhtml = `<img class="banner__marker active" src="${featureOn}" alt="Turn On">`;
                featuredBtn.innerHTML = "";
                featuredBtn.innerHTML = fhtml;

                featuredBtn.classList.add('active');
                feature.classList.remove('feature-hide');
            }
        }
    })
}

export const myMapFunction =  function(event) {

    mapBtn.addEventListener(event, function(e){
        if(event === 'mouseover'){
            console.log('You moused over');
            const featureTooltip = document.querySelector('.tip_m');
            featureTooltip.classList.add('showtip');
            
        }
        if(event === 'mouseout'){
            console.log('You moused out');
            const featureTooltip = document.querySelector('.tip_m');
            featureTooltip.classList.remove('showtip');
        }

        if(event === 'click'){
            console.log('You clicked');
            e.preventDefault();
            if (mapBtn.classList.contains('active')) {
                mhtml = `<img class="banner__marker" src="${mapOff}"alt="Turn Off">`;
                mapBtn.innerHTML = "";
                mapBtn.innerHTML = mhtml;
                
                mapBtn.classList.remove('active');
                map.classList.add('map-hide')

            } else {
                mhtml = `<img class="banner__marker active" src="${mapOn}" alt="Turn On">`;
                mapBtn.innerHTML = "";
                mapBtn.innerHTML = mhtml;

                mapBtn.classList.add('active');
                map.classList.remove('map-hide');
            }
        }
    })
}

export const mySpeakerFunction =  function(event) {

    speakerBtn.addEventListener(event, function(e){
        if(event === 'mouseover'){
            console.log('You moused over');
            const speakerTooltip = document.querySelector('.tip_sp');
            speakerTooltip.classList.add('showtip');
            
        }
        if(event === 'mouseout'){
            console.log('You moused out');
            const speakerTooltip = document.querySelector('.tip_sp');
            speakerTooltip.classList.remove('showtip');
        }

        if(event === 'click'){
            console.log('To do');
            e.preventDefault();
            const notice = document.querySelector('.notice-wrapper');
            const closeNotice = document.querySelector('.notice-close');

            // on click set the display from none to block
            notice.style.display = 'block';
    
            closeNotice.addEventListener('click', () => {
                // on click set the display from none to block
                notice.style.display = 'none';
            })
            
            // Also make the notice close if we click anywhere on the page
            notice.addEventListener('click', () => {
                // on click set the display from none to block
                notice.style.display = 'none';
            })
            
        }
    })
}