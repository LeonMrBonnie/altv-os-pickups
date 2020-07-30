import * as alt from "alt-client";
import * as native from "natives";

let pickups = {};

alt.onServer("pickups:create", (name, model, pos) => {
    if(pickups[name]) return;
    // Create pickup
    let pickup = {
        pos: pos,
        object: native.createObject(alt.hash(model), pos.x, pos.y, pos.z, false, false, false)
    };
    native.freezeEntityPosition(pickup.object, true);
    native.setEntityCollision(pickup.object, false, false);
    pickups[name] = pickup;
});

alt.onServer("pickups:remove", (name) => {
    let pickup = pickups[name];
    if(!pickup) return;
    // Remove pickup
    native.deleteObject(pickup.object);
    delete pickups[name];
});

native.setAudioFlag("LoadMPData", true);
alt.onServer("pickups:pickup", (sound, soundSet) => {
    // Play pickup sound
    native.playSoundFrontend(-1, sound, soundSet, true);
});

alt.everyTick(() => {
    let frametime = native.timestep();
    for(let name in pickups) {
        let pickup = pickups[name];
        let obj = pickup.object;
        let rot = native.getEntityRotation(obj, 2);
        native.setEntityRotation(obj, rot.x, rot.y, rot.z + (90 * frametime), 2, true);
        native.drawLightWithRangeAndShadow(pickup.pos.x, pickup.pos.y, pickup.pos.z, 255, 255, 255, 2.5, 3.5, 15.0);
    }
});