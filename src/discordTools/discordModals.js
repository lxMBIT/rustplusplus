/*
    Copyright (C) 2022 Alexander Emanuelsson (alexemanuelol)

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.

    https://github.com/alexemanuelol/rustplusplus

*/

const Discord = require('discord.js');

const Client = require('../../index.ts');
const TextInput = require('./discordTextInputs.js');

module.exports = {
    getModal: function (options = {}) {
        const modal = new Discord.ModalBuilder();

        if (options.customId) modal.setCustomId(options.customId);
        if (options.title) modal.setTitle(options.title);

        return modal;
    },

    getCustomTimersEditModal(guildId, serverId) {
        const instance = Client.client.getInstance(guildId);
        const server = instance.serverList[serverId];
        const identifier = JSON.stringify({ "serverId": serverId });

        const modal = module.exports.getModal({
            customId: `CustomTimersEdit${identifier}`,
            title: Client.client.intlGet(guildId, 'customTimerEditDesc')
        });

        modal.addComponents(
            new Discord.ActionRowBuilder().addComponents(TextInput.getTextInput({
                customId: 'CargoShipEgressTime',
                label: Client.client.intlGet(guildId, 'customTimerEditCargoShipEgressLabel'),
                value: `${server.cargoShipEgressTimeMs / 1000}`,
                style: Discord.TextInputStyle.Short
            })),
            new Discord.ActionRowBuilder().addComponents(TextInput.getTextInput({
                customId: 'OilRigCrateUnlockTime',
                label: Client.client.intlGet(guildId, 'customTimerEditCrateOilRigUnlockLabel'),
                value: `${server.oilRigLockedCrateUnlockTimeMs / 1000}`,
                style: Discord.TextInputStyle.Short
            }))
        );

        return modal;
    },

    getSmartSwitchEditModal(guildId, serverId, entityId) {
        const instance = Client.client.getInstance(guildId);
        const entity = instance.serverList[serverId].switches[entityId];
        const identifier = JSON.stringify({ "serverId": serverId, "entityId": entityId });

        const modal = module.exports.getModal({
            customId: `SmartSwitchEdit${identifier}`,
            title: Client.client.intlGet(guildId, 'editingOfDeviceDesc', {
                device: entity.name.length > 18 ? `${entity.name.slice(0, 18)}..` : entity.name
            })
        });

        modal.addComponents(
            new Discord.ActionRowBuilder().addComponents(TextInput.getTextInput({
                customId: 'SmartSwitchName',
                label: Client.client.intlGet(guildId, 'smartSwitchEditNameLabel'),
                value: entity.name,
                style: Discord.TextInputStyle.Short
            })),
            new Discord.ActionRowBuilder().addComponents(TextInput.getTextInput({
                customId: 'SmartSwitchCommand',
                label: Client.client.intlGet(guildId, 'smartSwitchEditCommandLabel'),
                value: entity.command,
                style: Discord.TextInputStyle.Short
            }))
        );

        return modal;
    },

    getGroupEditModal(guildId, serverId, groupId) {
        const instance = Client.client.getInstance(guildId);
        const group = instance.serverList[serverId].switchGroups[groupId];
        const identifier = JSON.stringify({ "serverId": serverId, "groupId": groupId });

        const modal = module.exports.getModal({
            customId: `GroupEdit${identifier}`,
            title: Client.client.intlGet(guildId, 'editingOfDeviceDesc', {
                device: group.name.length > 18 ? `${group.name.slice(0, 18)}..` : group.name
            })
        });

        modal.addComponents(
            new Discord.ActionRowBuilder().addComponents(TextInput.getTextInput({
                customId: 'GroupName',
                label: Client.client.intlGet(guildId, 'groupEditNameLabel'),
                value: group.name,
                style: Discord.TextInputStyle.Short
            })),
            new Discord.ActionRowBuilder().addComponents(TextInput.getTextInput({
                customId: 'GroupCommand',
                label: Client.client.intlGet(guildId, 'groupEditCommandLabel'),
                value: group.command,
                style: Discord.TextInputStyle.Short
            }))
        );

        return modal;
    },

    getGroupAddSwitchModal(guildId, serverId, groupId) {
        const instance = Client.client.getInstance(guildId);
        const group = instance.serverList[serverId].switchGroups[groupId];
        const identifier = JSON.stringify({ "serverId": serverId, "groupId": groupId });

        const modal = module.exports.getModal({
            customId: `GroupAddSwitch${identifier}`,
            title: Client.client.intlGet(guildId, 'groupAddSwitchDesc', { group: group.name })
        });

        modal.addComponents(
            new Discord.ActionRowBuilder().addComponents(TextInput.getTextInput({
                customId: 'GroupAddSwitchId',
                label: Client.client.intlGet(guildId, 'groupAddSwitchIdLabel'),
                value: '',
                style: Discord.TextInputStyle.Short
            }))
        );

        return modal;
    },

    getGroupRemoveSwitchModal(guildId, serverId, groupId) {
        const instance = Client.client.getInstance(guildId);
        const group = instance.serverList[serverId].switchGroups[groupId];
        const identifier = JSON.stringify({ "serverId": serverId, "groupId": groupId });

        const modal = module.exports.getModal({
            customId: `GroupRemoveSwitch${identifier}`,
            title: Client.client.intlGet(guildId, 'groupRemoveSwitchDesc', { group: group.name })
        });

        modal.addComponents(
            new Discord.ActionRowBuilder().addComponents(TextInput.getTextInput({
                customId: 'GroupRemoveSwitchId',
                label: Client.client.intlGet(guildId, 'groupRemoveSwitchIdLabel'),
                value: '',
                style: Discord.TextInputStyle.Short
            }))
        );

        return modal;
    },

    getSmartAlarmEditModal(guildId, serverId, entityId) {
        const instance = Client.client.getInstance(guildId);
        const entity = instance.serverList[serverId].alarms[entityId];
        const identifier = JSON.stringify({ "serverId": serverId, "entityId": entityId });

        const modal = module.exports.getModal({
            customId: `SmartAlarmEdit${identifier}`,
            title: Client.client.intlGet(guildId, 'editingOfDeviceDesc', {
                device: entity.name.length > 18 ? `${entity.name.slice(0, 18)}..` : entity.name
            })
        });

        modal.addComponents(
            new Discord.ActionRowBuilder().addComponents(TextInput.getTextInput({
                customId: 'SmartAlarmName',
                label: Client.client.intlGet(guildId, 'smartAlarmEditNameLabel'),
                value: entity.name,
                style: Discord.TextInputStyle.Short
            })),
            new Discord.ActionRowBuilder().addComponents(TextInput.getTextInput({
                customId: 'SmartAlarmMessage',
                label: Client.client.intlGet(guildId, 'smartAlarmEditMessageLabel'),
                value: entity.message,
                style: Discord.TextInputStyle.Short
            }))
        );

        return modal;
    },

    getStorageMonitorEditModal(guildId, serverId, entityId) {
        const instance = Client.client.getInstance(guildId);
        const entity = instance.serverList[serverId].storageMonitors[entityId];
        const identifier = JSON.stringify({ "serverId": serverId, "entityId": entityId });

        const modal = module.exports.getModal({
            customId: `StorageMonitorEdit${identifier}`,
            title: Client.client.intlGet(guildId, 'editingOfDeviceDesc', {
                device: entity.name.length > 18 ? `${entity.name.slice(0, 18)}..` : entity.name
            })
        });

        modal.addComponents(
            new Discord.ActionRowBuilder().addComponents(TextInput.getTextInput({
                customId: 'StorageMonitorName',
                label: Client.client.intlGet(guildId, 'storageMonitorEditNameLabel'),
                value: entity.name,
                style: Discord.TextInputStyle.Short
            }))
        );

        return modal;
    },

    getTrackerEditModal(guildId, trackerId) {
        const instance = Client.client.getInstance(guildId);
        const tracker = instance.trackers[trackerId];
        const identifier = JSON.stringify({ "trackerId": trackerId });

        const modal = module.exports.getModal({
            customId: `TrackerEdit${identifier}`,
            title: Client.client.intlGet(guildId, 'editingOfDeviceDesc', {
                device: tracker.name.length > 18 ? `${tracker.name.slice(0, 18)}..` : tracker.name
            })
        });

        modal.addComponents(
            new Discord.ActionRowBuilder().addComponents(TextInput.getTextInput({
                customId: 'TrackerName',
                label: Client.client.intlGet(guildId, 'trackerEditNameLabel'),
                value: tracker.name,
                style: Discord.TextInputStyle.Short
            })),
            new Discord.ActionRowBuilder().addComponents(TextInput.getTextInput({
                customId: 'TrackerBattlemetricsId',
                label: Client.client.intlGet(guildId, 'trackerEditBattlemetricsIdLabel'),
                value: tracker.battlemetricsId,
                style: Discord.TextInputStyle.Short
            }))
        );

        return modal;
    },

    getTrackerAddPlayerModal(guildId, trackerId) {
        const instance = Client.client.getInstance(guildId);
        const tracker = instance.trackers[trackerId];
        const identifier = JSON.stringify({ "trackerId": trackerId });

        const modal = module.exports.getModal({
            customId: `TrackerAddPlayer${identifier}`,
            title: Client.client.intlGet(guildId, 'trackerAddPlayerDesc', { tracker: tracker.name })
        });


        modal.addComponents(
            new Discord.ActionRowBuilder().addComponents(TextInput.getTextInput({
                customId: 'TrackerAddPlayerSteamId',
                label: Client.client.intlGet(guildId, 'trackerAddPlayerIdLabel'),
                value: '',
                style: Discord.TextInputStyle.Short
            }))
        );

        return modal;
    },

    getTrackerRemovePlayerModal(guildId, trackerId) {
        const instance = Client.client.getInstance(guildId);
        const tracker = instance.trackers[trackerId];
        const identifier = JSON.stringify({ "trackerId": trackerId });

        const modal = module.exports.getModal({
            customId: `TrackerRemovePlayer${identifier}`,
            title: Client.client.intlGet(guildId, 'trackerRemovePlayerDesc', { tracker: tracker.name })
        });

        modal.addComponents(
            new Discord.ActionRowBuilder().addComponents(TextInput.getTextInput({
                customId: 'TrackerRemovePlayerSteamId',
                label: Client.client.intlGet(guildId, 'trackerRemovePlayerIdLabel'),
                value: '',
                style: Discord.TextInputStyle.Short
            }))
        );

        return modal;
    },
}