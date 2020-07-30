import * as alt from "alt-server";

let STREAM_RANGE = 200;

class Pickups {
    static _pickups = {};
    
    static create(name, model, position, dimension = 0, respawn = false, respawnTime = 30000, pickupSound = "Deliver_Pick_Up", pickupSoundSet = "HUD_FRONTEND_MP_COLLECTABLE_SOUNDS") {
        if(Pickups._pickups[name]) return;
        new Pickups(name, model, position, dimension, respawn, respawnTime, pickupSound, pickupSoundSet);
    }
    static remove(name) {
        let pickup = Pickups._pickups[name];
        if(!pickup) return;
        pickup.removeColshapes();
        if(pickup._respawnTimeout) alt.clearTimeout(pickup._respawnTimeout);

        delete Pickups._pickups[name];
        alt.emitClient(null, "pickups:remove", name);
    }
    static handleEnterColshape(colshape, entity) {
        if(!entity instanceof alt.Player) return;

        if(colshape.isStreamColshape) colshape.ownerPickup.onEnterStreamRange(entity);
        else if(colshape.isPickupColshape) colshape.ownerPickup.onPickup(entity);
    }
    static handleLeaveColshape(colshape, entity) {
        if(!entity instanceof alt.Player) return;

        if(colshape.isStreamColshape) colshape.ownerPickup.onLeaveStreamRange(entity);
    }

    constructor(name, model, position, dimension, respawn, respawnTime, pickupSound, pickupSoundSet) {
        this._name = name;
        this._model = model;
        this._position = position;
        this._dimension = dimension;
        this._respawn = respawn;
        this._respawnTime = respawnTime;
        this._disabled = false;
        this._pickupSound = {
            name: pickupSound,
            set: pickupSoundSet
        };

        this.createColshapes();
    }
    createColshapes() {
        this._streamColshape = new alt.ColshapeCylinder(this.position.x, this.position.y, this.position.z, STREAM_RANGE, STREAM_RANGE / 2);
        this._streamColshape.isStreamColshape = true;
        this._streamColshape.ownerPickup = this;

        this._pickupColshape = new alt.ColshapeCylinder(this.position.x, this.position.y, this.position.z, 1.25, 1.25);
        this._pickupColshape.isPickupColshape = true;
        this._pickupColshape.ownerPickup = this;
    }
    removeColshapes() {
        this._streamColshape.destroy();
        this._pickupColshape.destroy();
    }
    onEnterStreamRange(player) {
        if(this._disabled) return;
        if(player.dimension !== this.dimension) return;
        alt.emitClient(player, "pickups:create", this.name, this.model, this.position);
    }
    onLeaveStreamRange(player) {
        alt.emitClient(player, "pickups:remove", this.name);
    }
    onPickup(player) {
        if(player.dimension !== this.dimension) return;
        if(this._disabled) return;
        this._disabled = true;
        alt.emitClient(null, "pickups:remove", this.name);
        alt.emitClient(player, "pickups:pickup", this.pickupSound.name, this.pickupSound.set);
        alt.emit("pickups:pickedUp", player, this.name);
        if(this.respawn) this._respawnTimeout = alt.setTimeout(() => {
            this._disabled = false;
            alt.Player.all.forEach((ply) => {
                if(this._streamColshape.isEntityIn(ply)) alt.emitClient(ply, "pickups:create", this.name, this.model, this.position);
            });
        }, this.respawnTime);
        else Pickups.remove(this.name);
    }

    get name() {
        return this._name;
    }
    get model() {
        return this._model;
    }
    get position() {
        return this._position;
    }
    get dimension() {
        return this._dimension;
    }
    get respawn() {
        return this._respawn;
    }
    get respawnTime() {
        return this._respawnTime;
    }
    get pickupSound() {
        return this._pickupSound;
    }
}

alt.on("entityEnterColshape", Pickups.handleEnterColshape);
alt.on("entityLeaveColshape", Pickups.handleLeaveColshape);

alt.on("pickups:create", Pickups.create);
alt.on("pickups:remove", Pickups.remove);
alt.on("pickups:setStreamRange", (range) => {
    STREAM_RANGE = range;
});