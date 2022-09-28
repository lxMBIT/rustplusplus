const Builder = require('@discordjs/builders');

const DiscordEmbeds = require('../discordTools/discordEmbeds.js');
const DiscordMessages = require('../discordTools/discordMessages.js');
const InstanceUtils = require('../util/instanceUtils.js');
const SmartSwitchGroupHandler = require('../handlers/smartSwitchGroupHandler.js');

module.exports = {
    name: 'switch',

    getData(client, guildId) {
        return new Builder.SlashCommandBuilder()
            .setName('switch')
            .setDescription(client.intlGet(guildId, 'commandsSwitchDesc'))
            .addSubcommand(subcommand => subcommand
                .setName('edit')
                .setDescription(client.intlGet(guildId, 'commandsSwitchEditDesc'))
                .addStringOption(option => option
                    .setName('id')
                    .setDescription(client.intlGet(guildId, 'commandsSwitchEditIdDesc'))
                    .setRequired(true))
                .addStringOption(option => option
                    .setName('image')
                    .setDescription(client.intlGet(guildId, 'commandsSwitchEditImageDesc'))
                    .setRequired(true)
                    .addChoices(
                        { name: client.intlGet(guildId, 'autoturret'), value: 'autoturret' },
                        { name: client.intlGet(guildId, 'boomBox'), value: 'boombox' },
                        { name: client.intlGet(guildId, 'broadcaster'), value: 'broadcaster' },
                        { name: client.intlGet(guildId, 'ceilingLight'), value: 'ceiling_light' },
                        { name: client.intlGet(guildId, 'discoFloor'), value: 'discofloor' },
                        { name: client.intlGet(guildId, 'doorController'), value: 'door_controller' },
                        { name: client.intlGet(guildId, 'elevator'), value: 'elevator' },
                        { name: client.intlGet(guildId, 'hbhfSensor'), value: 'hbhf_sensor' },
                        { name: client.intlGet(guildId, 'heater'), value: 'heater' },
                        { name: client.intlGet(guildId, 'samsite'), value: 'samsite' },
                        { name: client.intlGet(guildId, 'sirenLight'), value: 'siren_light' },
                        { name: client.intlGet(guildId, 'smartAlarm'), value: 'smart_alarm' },
                        { name: client.intlGet(guildId, 'smartSwitch'), value: 'smart_switch' },
                        { name: client.intlGet(guildId, 'sprinkler'), value: 'sprinkler' },
                        { name: client.intlGet(guildId, 'storageMonitor'), value: 'storage_monitor' },
                        { name: client.intlGet(guildId, 'christmasLights'), value: 'xmas_light' })));
    },

    async execute(client, interaction) {
        const instance = client.getInstance(interaction.guildId);
        const rustplus = client.rustplusInstances[interaction.guildId];

        if (!await client.validatePermissions(interaction)) return;
        await interaction.deferReply({ ephemeral: true });

        switch (interaction.options.getSubcommand()) {
            case 'edit': {
                const entityId = interaction.options.getString('id');
                const image = interaction.options.getString('image');

                const device = InstanceUtils.getSmartDevice(interaction.guildId, entityId);
                if (device === null) {
                    const str = client.intlGet(interaction.guildId, 'invalidId', { id: entityId });
                    await client.interactionEditReply(interaction, DiscordEmbeds.getActionInfoEmbed(1, str,
                        instance.serverList[device.serverId].title));
                    client.log(client.intlGet(null, 'warningCap'), str);
                    return;
                }

                const entity = instance.serverList[device.serverId].switches[entityId];

                if (image !== null) instance.serverList[device.serverId].switches[entityId].image = `${image}.png`;
                client.setInstance(interaction.guildId, instance);

                if (rustplus && rustplus.serverId === device.serverId) {
                    DiscordMessages.sendSmartSwitchMessage(interaction.guildId, device.serverId, entityId);
                    SmartSwitchGroupHandler.updateSwitchGroupIfContainSwitch(
                        client, interaction.guildId, device.serverId, entityId);
                }

                const str = client.intlGet(interaction.guildId, 'smartSwitchEditSuccess', {
                    name: entity.name
                });
                await client.interactionEditReply(interaction, DiscordEmbeds.getActionInfoEmbed(0, str,
                    instance.serverList[device.serverId].title));
                client.log(client.intlGet(null, 'infoCap'), str);
            } break;

            default: {
            } break;
        }
    },
};
