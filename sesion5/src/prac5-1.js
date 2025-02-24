import dashjs from './dash.all.min.js';

const url = "http://localhost:8080/mpd/sintel_final.mpd";
const url1 = "http://localhost:8080/sintel_480_extracted.mpd";
const url2 = "http://localhost:8080/sintel_720_extracted.mpd";
const url3 = "http://localhost:8080/sintel_1080_extracted.mpd";
const url4 = "http://localhost:8080/counter.mpd";


const player = dashjs.MediaPlayer().create();
player.initialize(document.querySelector("#player"), url, true);


