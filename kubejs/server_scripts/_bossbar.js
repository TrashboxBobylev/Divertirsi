// BossBar Utils
// @author @mihoho4466

const $UUID = Java.loadClass("java.util.UUID");
const $ResourceLocation = Java.loadClass('net.minecraft.resources.ResourceLocation')

var _bossbarmanager = null;

ServerEvents.loaded(event => {
    _bossbarmanager = event.server.getCustomBossEvents();
});
ServerEvents.tick(event => {
    if (_bossbarmanager == null)
        _bossbarmanager = event.server.getCustomBossEvents();
});

const BossBarUtils = {
    /**
     * @type {Internal.CustomBossEvents}
     */
    _getManager() {
        return _bossbarmanager;
    },

    /**
     * Create a new BossBar
     * @param {string} id - BossBar's identifier
     * @param {Internal.Component} displayName - BossBar's display name
     * @param {Internal.ServerPlayer} [player] - Optional player parameter for updating the component
     * @returns {Internal.CustomBossEvent}
     * @throws {Error} if the BossBar already exists with the same identifier.
     */
    create(id, displayName, player) {
        /**
         * @type {Internal.CustomBossEvents}
         */
        const manager = this._getManager();
        const resourceLocation = $ResourceLocation.parse(id);
        
        if (manager.get(resourceLocation) != null) {
            throw new Error(`BossBar ${id} already exists!`);
        }

        const ComponentUtils = Java.loadClass("net.minecraft.network.chat.ComponentUtils");
        const updatedName = player 
            ? ComponentUtils.updateForEntity(player.createCommandSourceStack(), displayName, player, 0)
            : displayName;
            
        return manager.create(resourceLocation, updatedName);
    },

    /**
     * Remove the BossBar by its identifier
     * @param {string} id - BossBar's identifier
     */
    remove(id) {
        const manager = this._getManager();
        const bossBar = this.get(id);
        if (bossBar) {
            bossBar.removeAllPlayers();
            manager.remove(bossBar);
        }
    },

    /**
     * Get the BossBar by its identifier
     * @param {string} id - BossBar's identifier
     * @returns {Internal.CustomBossEvent|null}
     */
    get(id) {
        return this._getManager().get($ResourceLocation.parse(id));
    },

    /**
     * Set the visibility of the BossBar
     * @param {string} id - BossBar's identifier
     * @param {boolean} visible - Visibility to set
     */
    setVisible(id, visible) {
        const bossBar = this.get(id);
        if (bossBar) {
            bossBar.setVisible(visible);
        }
    },

    /**
     * Set the progress value of the BossBar
     * @param {string} id - BossBar's identifier
     * @param {number} value - Progress value to set
     */
    setValue(id, value) {
        const bossBar = this.get(id);
        if (bossBar) {
            bossBar.setValue(value);
        }
    },

    /**
     * Set the maximum value of the BossBar
     * @param {string} id - BossBar's identifier
     * @param {number} max - Maximum value to set
     */
    setMax(id, max) {
        const bossBar = this.get(id);
        if (bossBar) {
            bossBar.setMax(max);
        }
    },

    /**
     * Set the color of the BossBar
     * @param {string} id - BossBar's identifier
     * @param {string} color - Color to set ('pink'|'blue'|'red'|'green'|'yellow'|'purple'|'white')
     */
    setColor(id, color) {
        const bossBar = this.get(id);
        if (bossBar) {
            const BossBarColor = Java.loadClass("net.minecraft.world.BossEvent$BossBarColor");
            bossBar.setColor(BossBarColor.valueOf(color.toUpperCase()));
        }
    },

    /**
     * Set the style of the BossBar
     * @param {string} id - BossBar's identifier
     * @param {string} style - Style to set ('progress'|'notched_6'|'notched_10'|'notched_12'|'notched_20')
     */
    setStyle(id, style) {
        const bossBar = this.get(id);
        if (bossBar) {
            const BossBarOverlay = Java.loadClass("net.minecraft.world.BossEvent$BossBarOverlay");
            bossBar.setOverlay(BossBarOverlay.valueOf(style.toUpperCase()));
        }
    },

    /**
     * Set the name of the BossBar
     * @param {string} id - BossBar's identifier
     * @param {Internal.Component} name - Name to set
     * @param {Internal.ServerPlayer} [player] - Optional player parameter for updating the component
     */
    setName(id, name, player) {
        const bossBar = this.get(id);
        if (bossBar) {
            const ComponentUtils = Java.loadClass("net.minecraft.network.chat.ComponentUtils");
            const updatedName = player 
                ? ComponentUtils.updateForEntity(player.createCommandSourceStack(), name, player, 0)
                : name;
            bossBar.setName(updatedName);
        }
    },

    /**
     * Set the players that can see the BossBar
     * @param {string} id - BossBar's identifier
     * @param {Internal.ServerPlayer[]} players - Players to set
     */
    setPlayers(id, players) {
        const bossBar = this.get(id);
        if (bossBar) {
            bossBar.setPlayers(players);
        }
    },

    /**
     * Add a player to the BossBar's visible list
     * @param {string} id - BossBar's identifier
     * @param {Internal.ServerPlayer} player - Player to add
     */
    addPlayer(id, player) {
        const bossBar = this.get(id);
        if (bossBar) {
            bossBar.addPlayer(player);
        }
    },

    /**
     * remove a player from the BossBar's visible list
     * @param {string} id - BossBar's identifier
     * @param {Internal.ServerPlayer} player - Player to remove
     */
    removePlayer(id, player) {
        const bossBar = this.get(id);
        if (bossBar) {
            bossBar.removePlayer(player);
        }
    }
};