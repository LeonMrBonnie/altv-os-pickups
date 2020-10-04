import * as alt from "alt-server";

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

        if(colshape.isPickupColshape) colshape.ownerPickup.onPickup(entity);
    }
    static handlePlayerConnect(player) {
        for(const name in Pickups._pickups) {
            Pickups._pickups[name].createForPlayer(player);
        }
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

        Pickups._pickups[name] = this;
        this.createColshapes();
        this.createForPlayer(null);
    }
    createColshapes() {
        this._pickupColshape = new alt.ColshapeCylinder(this.position.x, this.position.y, this.position.z, 1.5, 1.5);
        this._pickupColshape.isPickupColshape = true;
        this._pickupColshape.ownerPickup = this;
    }
    removeColshapes() {
        this._pickupColshape.destroy();
    }
    onPickup(player) {
        if(player.dimension !== this.dimension) return;
        if(this._disabled) return;
        this._disabled = true;
        this.removeForPlayer(null);
        alt.emitClient(player, "pickups:pickup", this.pickupSound.name, this.pickupSound.set);
        alt.emit("pickups:pickedUp", player, this.name);
        if(this.respawn) this._respawnTimeout = alt.setTimeout(() => {
            this._disabled = false;
            this.createForPlayer(null);
        }, this.respawnTime);
        else Pickups.remove(this.name);
    }
    createForPlayer(player) {
        alt.emitClient(player, "pickups:create", this.name, this.model, this.position);
    }
    removeForPlayer(player) {
        alt.emitClient(player, "pickups:remove", this.name);
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
alt.on("playerConnect", Pickups.handlePlayerConnect);

alt.on("pickups:create", Pickups.create);
alt.on("pickups:remove", Pickups.remove);
alt.on("pickups:setStreamRange", (range) => {
    STREAM_RANGE = range;
});