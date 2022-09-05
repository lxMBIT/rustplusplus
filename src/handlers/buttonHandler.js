const DiscordMessages = require('../discordTools/discordMessages.js');
const DiscordTools = require('../discordTools/discordTools.js');
const SmartSwitchGroupHandler = require('./smartSwitchGroupHandler.js');
const DiscordButtons = require('..//discordTools/discordButtons.js');
const DiscordModals = require('../discordTools/discordModals.js');
const Recycler = require('../util/recycler.js');

module.exports = async (client, interaction) => {
    const instance = client.readInstanceFile(interaction.guildId);
    const guildId = interaction.guildId;
    const rustplus = client.rustplusInstances[guildId];

    if (interaction.customId.startsWith('DiscordNotification')) {
        const ids = JSON.parse(interaction.customId.replace('DiscordNotification', ''));
        const setting = instance.notificationSettings[ids.setting];

        setting.discord = !setting.discord;
        client.writeInstanceFile(guildId, instance);

        if (rustplus) rustplus.notificationSettings[ids.setting].discord = setting.discord;

        await client.interactionUpdate(interaction, {
            components: [DiscordButtons.getNotificationButtons(ids.setting, setting.discord, setting.inGame)]
        });
    }
    else if (interaction.customId.startsWith('InGameNotification')) {
        const ids = JSON.parse(interaction.customId.replace('InGameNotification', ''));
        const setting = instance.notificationSettings[ids.setting];

        setting.inGame = !setting.inGame;
        client.writeInstanceFile(guildId, instance);

        if (rustplus) rustplus.notificationSettings[ids.setting].inGame = setting.inGame;

        await client.interactionUpdate(interaction, {
            components: [DiscordButtons.getNotificationButtons(ids.setting, setting.discord, setting.inGame)]
        });
    }
    else if (interaction.customId === 'AllowInGameCommands') {
        instance.generalSettings.inGameCommandsEnabled = !instance.generalSettings.inGameCommandsEnabled;
        client.writeInstanceFile(guildId, instance);

        if (rustplus) rustplus.generalSettings.inGameCommandsEnabled = instance.generalSettings.inGameCommandsEnabled;

        await client.interactionUpdate(interaction, {
            components: [DiscordButtons.getInGameCommandsEnabledButton(instance.generalSettings.inGameCommandsEnabled)]
        });
    }
    else if (interaction.customId === 'InGameTeammateConnection') {
        instance.generalSettings.connectionNotify = !instance.generalSettings.connectionNotify;
        client.writeInstanceFile(guildId, instance);

        if (rustplus) rustplus.generalSettings.connectionNotify = instance.generalSettings.connectionNotify;

        await client.interactionUpdate(interaction, {
            components: [DiscordButtons.getInGameTeammateNotificationsButtons(guildId)]
        });
    }
    else if (interaction.customId === 'InGameTeammateAfk') {
        instance.generalSettings.afkNotify = !instance.generalSettings.afkNotify;
        client.writeInstanceFile(guildId, instance);

        if (rustplus) rustplus.generalSettings.afkNotify = instance.generalSettings.afkNotify;

        await client.interactionUpdate(interaction, {
            components: [DiscordButtons.getInGameTeammateNotificationsButtons(guildId)]
        });
    }
    else if (interaction.customId === 'InGameTeammateDeath') {
        instance.generalSettings.deathNotify = !instance.generalSettings.deathNotify;
        client.writeInstanceFile(guildId, instance);

        if (rustplus) rustplus.generalSettings.deathNotify = instance.generalSettings.deathNotify;

        await client.interactionUpdate(interaction, {
            components: [DiscordButtons.getInGameTeammateNotificationsButtons(guildId)]
        });
    }
    else if (interaction.customId === 'FcmAlarmNotification') {
        instance.generalSettings.fcmAlarmNotificationEnabled = !instance.generalSettings.fcmAlarmNotificationEnabled;
        client.writeInstanceFile(guildId, instance);

        if (rustplus) rustplus.generalSettings.fcmAlarmNotificationEnabled =
            instance.generalSettings.fcmAlarmNotificationEnabled;

        await client.interactionUpdate(interaction, {
            components: [DiscordButtons.getFcmAlarmNotificationButtons(
                instance.generalSettings.fcmAlarmNotificationEnabled,
                instance.generalSettings.fcmAlarmNotificationEveryone)]
        });
    }
    else if (interaction.customId === 'FcmAlarmNotificationEveryone') {
        instance.generalSettings.fcmAlarmNotificationEveryone = !instance.generalSettings.fcmAlarmNotificationEveryone;
        client.writeInstanceFile(guildId, instance);

        if (rustplus) rustplus.generalSettings.fcmAlarmNotificationEveryone =
            instance.generalSettings.fcmAlarmNotificationEveryone;

        await client.interactionUpdate(interaction, {
            components: [DiscordButtons.getFcmAlarmNotificationButtons(
                instance.generalSettings.fcmAlarmNotificationEnabled,
                instance.generalSettings.fcmAlarmNotificationEveryone)]
        });
    }
    else if (interaction.customId === 'SmartAlarmNotifyInGame') {
        instance.generalSettings.smartAlarmNotifyInGame = !instance.generalSettings.smartAlarmNotifyInGame;
        client.writeInstanceFile(guildId, instance);

        if (rustplus) rustplus.generalSettings.smartAlarmNotifyInGame =
            instance.generalSettings.smartAlarmNotifyInGame;

        await client.interactionUpdate(interaction, {
            components: [DiscordButtons.getSmartAlarmNotifyInGameButton(
                instance.generalSettings.smartAlarmNotifyInGame)]
        });
    }
    else if (interaction.customId === 'LeaderCommandEnabled') {
        instance.generalSettings.leaderCommandEnabled = !instance.generalSettings.leaderCommandEnabled;
        client.writeInstanceFile(guildId, instance);

        if (rustplus) rustplus.generalSettings.leaderCommandEnabled = instance.generalSettings.leaderCommandEnabled;

        await client.interactionUpdate(interaction, {
            components: [DiscordButtons.getLeaderCommandEnabledButton(
                instance.generalSettings.leaderCommandEnabled)]
        });
    }
    else if (interaction.customId === 'TrackerNotifyAllOffline') {
        instance.generalSettings.trackerNotifyAllOffline = !instance.generalSettings.trackerNotifyAllOffline;
        client.writeInstanceFile(guildId, instance);

        if (rustplus) rustplus.generalSettings.trackerNotifyAllOffline =
            instance.generalSettings.trackerNotifyAllOffline;

        await client.interactionUpdate(interaction, {
            components: [getTrackerNotifyButtons(
                instance.generalSettings.trackerNotifyAllOffline,
                instance.generalSettings.trackerNotifyAnyOnline)]
        });
    }
    else if (interaction.customId === 'TrackerNotifyAnyOnline') {
        instance.generalSettings.trackerNotifyAnyOnline = !instance.generalSettings.trackerNotifyAnyOnline;
        client.writeInstanceFile(guildId, instance);

        if (rustplus) rustplus.generalSettings.trackerNotifyAnyOnline =
            instance.generalSettings.trackerNotifyAnyOnline;

        await client.interactionUpdate(interaction, {
            components: [DiscordButtons.getTrackerNotifyButtons(
                instance.generalSettings.trackerNotifyAllOffline,
                instance.generalSettings.trackerNotifyAnyOnline)]
        });
    }
    else if (interaction.customId.startsWith('ServerConnect')) {
        const ids = JSON.parse(interaction.customId.replace('ServerConnect', ''));

        for (const [serverId, content] of Object.entries(instance.serverList)) {
            if (content.active) {
                instance.serverList[serverId].active = false;
                await DiscordMessages.sendServerMessage(guildId, serverId, null);
                break;
            }
        }

        instance.serverList[ids.serverId].active = true;
        client.writeInstanceFile(guildId, instance);
        await DiscordMessages.sendServerMessage(guildId, ids.serverId, null, interaction);

        /* Disconnect previous instance is any */
        if (rustplus) rustplus.disconnect();

        /* Create the rustplus instance */
        const newRustplus = client.createRustplusInstance(
            guildId,
            instance.serverList[ids.serverId].serverIp,
            instance.serverList[ids.serverId].appPort,
            instance.serverList[ids.serverId].steamId,
            instance.serverList[ids.serverId].playerToken
        );

        newRustplus.newConnection = true;
    }
    else if (interaction.customId.startsWith('CreateTracker')) {
        const ids = JSON.parse(interaction.customId.replace('CreateTracker', ''));

        interaction.deferUpdate();

        /* Find an available tracker id */
        const trackerId = client.findAvailableTrackerId(guildId);

        instance.trackers[trackerId] = {
            name: 'Tracker',
            serverId: ids.serverId,
            battlemetricsId: instance.serverList[ids.serverId].battlemetricsId,
            status: false,
            allOffline: true,
            messageId: null,
            active: true,
            everyone: false,
            players: [],
            img: instance.serverList[ids.serverId].img,
            title: instance.serverList[ids.serverId].title
        }
        client.writeInstanceFile(guildId, instance);

        await DiscordMessages.sendTrackerMessage(guildId, trackerId);
    }
    else if (interaction.customId.startsWith('CreateGroup')) {
        const ids = JSON.parse(interaction.customId.replace('CreateGroup', ''));

        interaction.deferUpdate();

        const groupId = client.findAvailableGroupId(interaction.guildId, ids.serverId);

        instance.serverList[ids.serverId].switchGroups[groupId] = {
            name: 'Group',
            command: `${groupId}`,
            switches: [],
            messageId: null
        }
        client.writeInstanceFile(interaction.guildId, instance);

        await DiscordMessages.sendSmartSwitchGroupMessage(interaction.guildId, ids.serverId, groupId);
    }
    else if (interaction.customId.startsWith('ServerDisconnect') ||
        interaction.customId.startsWith('ServerReconnecting')) {
        const ids = JSON.parse(interaction.customId.replace('ServerDisconnect', '')
            .replace('ServerReconnecting', ''));

        instance.serverList[ids.serverId].active = false;
        client.writeInstanceFile(guildId, instance);

        await DiscordMessages.sendServerMessage(guildId, ids.serverId, null, interaction);

        if (rustplus) {
            rustplus.disconnect();
            delete client.rustplusInstances[guildId];
        }
    }
    else if (interaction.customId.startsWith('ServerDelete')) {
        const ids = JSON.parse(interaction.customId.replace('ServerDelete', ''));

        if (rustplus && (rustplus.serverId === ids.serverId || instance.serverList[ids.serverId].active)) {
            await DiscordTools.clearTextChannel(rustplus.guildId, instance.channelId.switches, 100);
            await DiscordTools.clearTextChannel(rustplus.guildId, instance.channelId.storageMonitors, 100);

            for (const [entityId, content] of Object.entries(instance.serverList[ids.serverId].alarms)) {
                await DiscordTools.deleteMessageById(guildId, instance.channelId.alarms,
                    instance.serverList[ids.serverId].alarms[entityId].messageId);
            }

            rustplus.disconnect();
            rustplus.deleted = true;
            delete client.rustplusInstances[guildId];
        }

        await DiscordTools.deleteMessageById(guildId, instance.channelId.servers,
            instance.serverList[ids.serverId].messageId);

        delete instance.serverList[ids.serverId];
        client.writeInstanceFile(guildId, instance);
    }
    else if (interaction.customId.startsWith('SmartSwitchOn') ||
        interaction.customId.startsWith('SmartSwitchOff')) {
        const ids = JSON.parse(interaction.customId.replace('SmartSwitchOn', '').replace('SmartSwitchOff', ''));

        if (!rustplus || (rustplus && (rustplus.serverId !== ids.serverId))) {
            interaction.deferUpdate();
            return;
        }

        clearTimeout(rustplus.currentSwitchTimeouts[ids.entityId]);
        delete rustplus.currentSwitchTimeouts[ids.entityId];

        const active = (interaction.customId.startsWith('SmartSwitchOn')) ? true : false;
        const prevActive = instance.serverList[ids.serverId].switches[ids.entityId].active;
        instance.serverList[ids.serverId].switches[ids.entityId].active = active;
        client.writeInstanceFile(guildId, instance);

        rustplus.interactionSwitches.push(ids.entityId);

        const response = await rustplus.turnSmartSwitchAsync(ids.entityId, active);
        if (!(await rustplus.isResponseValid(response))) {
            if (instance.serverList[ids.serverId].switches[ids.entityId].reachable) {
                await DiscordMessages.sendSmartSwitchNotFoundMessage(guildId, ids.serverId, ids.entityId);
            }
            instance.serverList[ids.serverId].switches[ids.entityId].reachable = false;
            instance.serverList[ids.serverId].switches[ids.entityId].active = prevActive;
            client.writeInstanceFile(guildId, instance);

            rustplus.interactionSwitches = rustplus.interactionSwitches.filter(e => e !== ids.entityId);
        }
        else {
            instance.serverList[ids.serverId].switches[ids.entityId].reachable = true;
            client.writeInstanceFile(guildId, instance);
        }

        DiscordMessages.sendSmartSwitchMessage(guildId, ids.serverId, ids.entityId, interaction);
        SmartSwitchGroupHandler.updateSwitchGroupIfContainSwitch(client, guildId, ids.serverId, ids.entityId);
    }
    else if (interaction.customId.startsWith('SmartSwitchEdit')) {
        const ids = JSON.parse(interaction.customId.replace('SmartSwitchEdit', ''));

        const modal = DiscordModals.getSmartSwitchEditModal(interaction.guildId, ids.serverId, ids.entityId);
        await interaction.showModal(modal);
    }
    else if (interaction.customId.startsWith('SmartSwitchDelete')) {
        const ids = JSON.parse(interaction.customId.replace('SmartSwitchDelete', ''));

        await DiscordTools.deleteMessageById(guildId, instance.channelId.switches,
            instance.serverList[ids.serverId].switches[ids.entityId].messageId);

        delete instance.serverList[ids.serverId].switches[ids.entityId];
        client.writeInstanceFile(guildId, instance);

        if (rustplus) {
            clearTimeout(rustplus.currentSwitchTimeouts[ids.entityId]);
            delete rustplus.currentSwitchTimeouts[ids.entityId];
        }

        for (const [groupId, content] of Object.entries(instance.serverList[ids.serverId].switchGroups)) {
            if (content.switches.includes(ids.entityId)) {
                instance.serverList[ids.serverId].switchGroups[groupId].switches =
                    content.switches.filter(e => e !== ids.entityId);
                client.writeInstanceFile(guildId, instance);
                await DiscordMessages.sendSmartSwitchGroupMessage(guildId, ids.serverId, groupId);
            }
        }
        client.writeInstanceFile(guildId, instance);
    }
    else if (interaction.customId.startsWith('SmartAlarmEveryone')) {
        const ids = JSON.parse(interaction.customId.replace('SmartAlarmEveryone', ''));

        instance.serverList[ids.serverId].alarms[ids.entityId].everyone =
            !instance.serverList[ids.serverId].alarms[ids.entityId].everyone;
        client.writeInstanceFile(guildId, instance);

        await DiscordMessages.sendSmartAlarmMessage(guildId, ids.serverId, ids.entityId, interaction);
    }
    else if (interaction.customId.startsWith('SmartAlarmDelete')) {
        const ids = JSON.parse(interaction.customId.replace('SmartAlarmDelete', ''));

        await DiscordTools.deleteMessageById(guildId, instance.channelId.alarms,
            instance.serverList[ids.serverId].alarms[ids.entityId].messageId);

        delete instance.serverList[ids.serverId].alarms[ids.entityId];
        client.writeInstanceFile(guildId, instance);
    }
    else if (interaction.customId.startsWith('SmartAlarmEdit')) {
        const ids = JSON.parse(interaction.customId.replace('SmartAlarmEdit', ''));

        const modal = DiscordModals.getSmartAlarmEditModal(interaction.guildId, ids.serverId, ids.entityId);
        await interaction.showModal(modal);
    }
    else if (interaction.customId.startsWith('StorageMonitorToolCupboardEveryone')) {
        const ids = JSON.parse(interaction.customId.replace('StorageMonitorToolCupboardEveryone', ''));

        instance.serverList[ids.serverId].storageMonitors[ids.entityId].everyone =
            !instance.serverList[ids.serverId].storageMonitors[ids.entityId].everyone;
        client.writeInstanceFile(guildId, instance);

        await DiscordMessages.sendStorageMonitorMessage(guildId, ids.serverId, ids.entityId, interaction);
    }
    else if (interaction.customId.startsWith('StorageMonitorToolCupboardInGame')) {
        const ids = JSON.parse(interaction.customId.replace('StorageMonitorToolCupboardInGame', ''));

        instance.serverList[ids.serverId].storageMonitors[ids.entityId].inGame =
            !instance.serverList[ids.serverId].storageMonitors[ids.entityId].inGame;
        client.writeInstanceFile(guildId, instance);

        await DiscordMessages.sendStorageMonitorMessage(guildId, ids.serverId, ids.entityId, interaction);
    }
    else if (interaction.customId.startsWith('StorageMonitorEdit')) {
        const ids = JSON.parse(interaction.customId.replace('StorageMonitorEdit', ''));

        const modal = DiscordModals.getStorageMonitorEditModal(interaction.guildId, ids.serverId, ids.entityId);
        await interaction.showModal(modal);
    }
    else if (interaction.customId.startsWith('StorageMonitorToolCupboardDelete')) {
        const ids = JSON.parse(interaction.customId.replace('StorageMonitorToolCupboardDelete', ''));

        await DiscordTools.deleteMessageById(guildId, instance.channelId.storageMonitors,
            instance.serverList[ids.serverId].storageMonitors[ids.entityId].messageId);

        delete instance.serverList[ids.serverId].storageMonitors[ids.entityId];
        client.writeInstanceFile(guildId, instance);
    }
    else if (interaction.customId.startsWith('StorageMonitorRecycle')) {
        const ids = JSON.parse(interaction.customId.replace('StorageMonitorRecycle', ''));

        interaction.deferUpdate();

        if (!rustplus) return;

        const entityInfo = await rustplus.getEntityInfoAsync(ids.entityId);
        if (!(await rustplus.isResponseValid(entityInfo))) return;

        instance.serverList[ids.serverId].storageMonitors[ids.entityId].reachable = true;
        client.writeInstanceFile(interaction.guildId, instance);

        const items = Recycler.calculate(entityInfo.entityInfo.payload.items);

        const message = await DiscordMessages.sendStorageMonitorRecycleMessage(
            guildId, ids.serverId, ids.entityId, items);

        setTimeout(async () => {
            await DiscordTools.deleteMessageById(guildId, instance.channelId.storageMonitors, message.id);
        }, 30000);
    }
    else if (interaction.customId.startsWith('StorageMonitorContainerDelete')) {
        const ids = JSON.parse(interaction.customId.replace('StorageMonitorContainerDelete', ''));

        await DiscordTools.deleteMessageById(guildId, instance.channelId.storageMonitors,
            instance.serverList[ids.serverId].storageMonitors[ids.entityId].messageId);

        delete instance.serverList[ids.serverId].storageMonitors[ids.entityId];
        client.writeInstanceFile(guildId, instance);
    }
    else if (interaction.customId.startsWith('GroupTurnOn') ||
        interaction.customId.startsWith('GroupTurnOff')) {
        const ids = JSON.parse(interaction.customId.replace('GroupTurnOn', '').replace('GroupTurnOff', ''));

        interaction.deferUpdate();

        if (rustplus) {
            clearTimeout(rustplus.currentSwitchTimeouts[ids.group]);
            delete rustplus.currentSwitchTimeouts[ids.group];

            if (rustplus.serverId === ids.serverId) {
                const active = (interaction.customId.startsWith('TurnOnGroup') ? true : false);

                await SmartSwitchGroupHandler.TurnOnOffGroup(
                    client, rustplus, guildId, ids.serverId, ids.group, active);
            }
        }
    }
    else if (interaction.customId.startsWith('GroupEdit')) {
        const ids = JSON.parse(interaction.customId.replace('GroupEdit', ''));

        const modal = DiscordModals.getGroupEditModal(interaction.guildId, ids.serverId, ids.groupId);
        await interaction.showModal(modal);
    }
    else if (interaction.customId.startsWith('GroupDelete')) {
        const ids = JSON.parse(interaction.customId.replace('GroupDelete', ''));

        if (rustplus) {
            clearTimeout(rustplus.currentSwitchTimeouts[ids.groupId]);
            delete rustplus.currentSwitchTimeouts[ids.groupId];
        }

        if (instance.serverList[ids.serverId].switchGroups.hasOwnProperty(ids.groupId)) {
            await DiscordTools.deleteMessageById(guildId, instance.channelId.switches,
                instance.serverList[ids.serverId].switchGroups[ids.groupId].messageId);

            delete instance.serverList[ids.serverId].switchGroups[ids.groupId];
            client.writeInstanceFile(guildId, instance);
        }
    }
    else if (interaction.customId.startsWith('GroupAddSwitch')) {
        const ids = JSON.parse(interaction.customId.replace('GroupAddSwitch', ''));

        const modal = DiscordModals.getGroupAddSwitchModal(guildId, ids.serverId, ids.groupId);
        await interaction.showModal(modal);
    }
    else if (interaction.customId.startsWith('GroupRemoveSwitch')) {
        const ids = JSON.parse(interaction.customId.replace('GroupRemoveSwitch', ''));

        const modal = DiscordModals.getGroupRemoveSwitchModal(guildId, ids.serverId, ids.groupId);
        await interaction.showModal(modal);
    }
    else if (interaction.customId.startsWith('TrackerActive')) {
        const ids = JSON.parse(interaction.customId.replace('TrackerActive', ''));

        if (instance.trackers.hasOwnProperty(ids.trackerId)) {
            instance.trackers[ids.trackerId].active = !instance.trackers[ids.trackerId].active;
            client.writeInstanceFile(guildId, instance);

            await DiscordMessages.sendTrackerMessage(interaction.guildId, ids.trackerId, interaction);
        }
    }
    else if (interaction.customId.startsWith('TrackerEveryone')) {
        const ids = JSON.parse(interaction.customId.replace('TrackerEveryone', ''));

        if (instance.trackers.hasOwnProperty(ids.trackerId)) {
            instance.trackers[ids.trackerId].everyone = !instance.trackers[ids.trackerId].everyone;
            client.writeInstanceFile(guildId, instance);

            await DiscordMessages.sendTrackerMessage(interaction.guildId, ids.trackerId, interaction);
        }
    }
    else if (interaction.customId.startsWith('TrackerEdit')) {
        const ids = JSON.parse(interaction.customId.replace('TrackerEdit', ''));

        const modal = DiscordModals.getTrackerEditModal(interaction.guildId, ids.trackerId);
        await interaction.showModal(modal);
    }
    else if (interaction.customId.startsWith('TrackerDelete')) {
        const ids = JSON.parse(interaction.customId.replace('TrackerDelete', ''));

        if (instance.trackers.hasOwnProperty(ids.trackerId)) {
            await DiscordTools.deleteMessageById(guildId, instance.channelId.trackers,
                instance.trackers[ids.trackerId].messageId);

            delete instance.trackers[ids.trackerId];
            client.writeInstanceFile(guildId, instance);
        }
    }
    else if (interaction.customId.startsWith('TrackerAddPlayer')) {
        const ids = JSON.parse(interaction.customId.replace('TrackerAddPlayer', ''));

        const modal = DiscordModals.getTrackerAddPlayerModal(interaction.guildId, ids.trackerId);
        await interaction.showModal(modal);
    }
    else if (interaction.customId.startsWith('TrackerRemovePlayer')) {
        const ids = JSON.parse(interaction.customId.replace('TrackerRemovePlayer', ''));

        const modal = DiscordModals.getTrackerRemovePlayerModal(interaction.guildId, ids.trackerId);
        await interaction.showModal(modal);
    }
}
