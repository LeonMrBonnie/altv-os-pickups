import * as alt from "alt-worker"
const STREAM_RANGE = 200;
const OBJECTS = {};
let LAST_POS = null;

const updatePlayerPos = (x, y, z) => {
    const pos = { x, y, z };
    LAST_POS = pos;
    for(const name in OBJECTS) {
        let object = OBJECTS[name];
        let dist = distance(pos, object.pos);
        if(!object.created && dist <= STREAM_RANGE) {
            object.created = true;
            alt.emit("createObject", name, object.model, object.pos);
        }
        else if(object.created && dist > STREAM_RANGE) {
            object.created = false;
            alt.emit("removeObject", name);
        }
    }
}
const addObject = (name, model, x, y, z) => {
    console.log(`Request Recieved`)
    OBJECTS[name] = {
        model,
        pos: { x, y, z },
        created: false
    };
    if(LAST_POS) updatePlayerPos(LAST_POS.x, LAST_POS.y, LAST_POS.z);
}
const removeObject = (name) => (delete OBJECTS[name]);

const distance = (pointA, pointB) => {
    let dx = pointB.x - pointA.x;
    let dy = pointB.y - pointA.y;
    let dz = pointB.z - pointA.z;
    let dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2) + Math.pow(dz, 2));
    return dist;
}

alt.on("updatePlayerPos", updatePlayerPos);
alt.on("addObject", addObject);
alt.on("removeObject", removeObject);
