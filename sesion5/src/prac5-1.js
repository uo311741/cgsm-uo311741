import dashjs from './dash.all.min.js';

const url = "http://localhost:60080/sintel_final.mpd";
const url1 = "http://localhost:60080/sintel_480_extracted.mpd";
const url2 = "http://localhost:60080/sintel_720_extracted.mpd";
const url3 = "http://localhost:60080/sintel_1080_extracted.mpd";
const url4 = "http://localhost:60080/counter.mpd";


const player = dashjs.MediaPlayer().create();
player.initialize(document.querySelector("#player"), url, true);


