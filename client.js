import * as alt from "alt-client";
import * as native from "natives";

let pickups = {};
let streamer = new alt.WebView("http://resource/streamer.html");

alt.setInterval(() => {
    let pos = alt.Player.local.pos;
    streamer.emit("updatePlayerPos", pos.x, pos.y, pos.z);
}, 2000);

streamer.on("createObject", (name, model, pos) => {
    pickups[name] = native.createObject(model, pos.x, pos.y, pos.z, false, false, false);
    native.freezeEntityPosition(pickups[name], true);
    native.setEntityCollision(pickups[name], false, false);
});

streamer.on("removeObject", (name) => {
    native.deleteObject(pickups[name]);
    delete pickups[name];
});

alt.onServer("pickups:create", (name, model, pos) => {
    streamer.emit("addObject", name, alt.hash(model), pos.x, pos.y, pos.z);
});

alt.onServer("pickups:remove", (name) => {
    let pickup = pickups[name];
    if(pickup) {
        native.deleteObject(pickup);
        delete pickups[name];
    }
    streamer.emit("removeObject", name);
});

native.setAudioFlag("LoadMPData", true);
alt.onServer("pickups:pickup", (sound, soundSet) => {
    native.playSoundFrontend(-1, sound, soundSet, true);
});

alt.everyTick(() => {
    let frametime = native.timestep();
    for(let name in pickups) {
        let obj = pickups[name];
        let rot = native.getEntityRotation(obj, 2);
        let pos = native.getEntityCoords(obj, true);
        native.setEntityRotation(obj, rot.x, rot.y, rot.z + (90 * frametime), 2, true);
        native.drawLightWithRangeAndShadow(pos.x, pos.y, pos.z, 255, 255, 255, 2.5, 3.5, 15.0);
    }
});