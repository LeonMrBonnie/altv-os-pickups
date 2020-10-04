![](https://i.imgur.com/JJ0Fv6A.png)

# Open Source - Pickups

Created by LeonMrBonnie

[:heart: Support me by becoming a Patron](https://www.patreon.com/leonmrbonnie/)<br>
⭐ This repository if you found it useful!

[![Generic badge](https://img.shields.io/badge/.altv_Installer%3F-Yes!-4E753E.svg)](https://shields.io/)

---

# Description

This repository provides an alt:V resource to create interactable pickups.

This resource provides two easy events to create and delete pickups.

## Installing Dependencies / Installation

**I cannot stress this enough. Ensure you have NodeJS 13+ or you will have problems.**

-   [NodeJS 13+](https://nodejs.org/en/download/current/)
-   An Existing or New Gamemode
-   General Scripting Knowledge


After simply add the name of this resource to your `server.cfg` resource section.

`altv-os-pickups`

Then simply clone this repository into your main server resources folder.

```
cd resources
git clone https://github.com/LeonMrBonnie/altv-os-pickups
```

Ensure your `package.json` includes this property:

```json
"type": "module"
```

# Creating and removing pickups

To create or remove a pickup you have two simple events you can use from the serverside:<br>

| Action            | Event                    |
| ----------------- | ------------------------ |
| Create            | `pickups:create`         |
| Remove            | `pickups:remove`         |

---

Arguments for `pickups:create`: (Arguments starting with a `?` are optional)

| Argument          | Description                         | Type      | Default value                        |
| ----------------- | ----------------------------------- | --------- | ------------------------------------ |
| `name`            | The unique name of the pickup       | `String`  |                                      |
| `model`           | The model for the pickup            | `String`  |                                      |
| `position`        | The position for the pickup         | `Vector3` |                                      |
| `?dimension`      | The dimension for the pickup        | `Number`  | `0`                                  |
| `?respawn`        | If the pickup should respawn        | `Boolean` | `false`                              |
| `?respawnTime`    | The time in ms for the respawn      | `Number`  | `30000`                              |
| `?pickupSound`    | The pickup sound name               | `String`  | `Deliver_Pick_Up`                    |
| `?pickupSoundSet` | The pickup sound set name           | `String`  | `HUD_FRONTEND_MP_COLLECTABLE_SOUNDS` |

---

Arguments for `pickups:remove`:

| Argument       | Description                         | Type      | Default value   |
| -------------- | ----------------------------------- | --------- | --------------- |
| `name`         | The unique name of the pickup       | `String`  |                 |

### !! IMPORTANT !!

The pickup names have to be unique. How you create these unique names is up to you.

# Handling picking up pickups

When a pickup created is picked up, it gets removed. If the respawn is enabled it gets respawned after the specified delay.<br>
Picking up a pickup emits the event on the serverside: `pickups:pickedUp`

Parameters for `pickups:pickedUp`:

| Parameter            | Description                   | Type         |
| -------------------- | ----------------------------- | ------------ |
| `player`             | The player that picked it up  | `alt.Player` |
| `pickupName`         | The name of the pickup        | `String`     |

Example:
```js
alt.on("pickups:pickedUp", (player, pickupName) => {
    alt.log(`${player.name} picked up: ${pickupName}`);
});
```

# Credits
- [Splak](https://www.twitch.tv/splaky) - Helping with the object streamer

# Other alt:V Open Source Resources

-   [Authentication by Stuyk](https://github.com/Stuyk/altv-os-auth)
-   [Discord Authentication by Stuyk](https://github.com/Stuyk/altv-discord-auth)
-   [Global Blip Manager by Dzeknjak](https://github.com/jovanivanovic/altv-os-global-blip-manager)
-   [Global Marker Manager by Dzeknjak](https://github.com/jovanivanovic/altv-os-global-marker-manager)
-   [Chat by Dzeknjak](https://github.com/jovanivanovic/altv-os-chat)
-   [Nametags by Stuyk](https://github.com/Stuyk/altv-os-nametags)
-   [Entity Sync for JS by LeonMrBonnie](https://github.com/LeonMrBonnie/altv-os-js-entitysync)
-   [Context Menu by Stuyk](https://github.com/Stuyk/altv-os-context-menu)
-   [Global Textlabels by Stuyk](https://github.com/Stuyk/altv-os-global-textlabels)
-   [Interactions by LeonMrBonnie](https://github.com/LeonMrBonnie/altv-os-interactions)
-   [Noclip by LeonMrBonnie](https://github.com/LeonMrBonnie/altv-os-noclip)
-   [Character Editor by Stuyk](https://github.com/Stuyk/altv-os-character-editor)
