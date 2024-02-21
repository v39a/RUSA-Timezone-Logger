require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ]
});

client.once('ready', (client) => {
    console.log(`${client.user.username} [${client.user.id}] is up and running.`);
});

/** The below is detect if a message was sent in any channel of the guild (discord server - RUSA) */
client.on('messageCreate', async (message) => {
    /** Detecting if the message is sent by a bot. */
    if (!message.author.bot) return;

    const guild_id = message.guildId;
    /** Checking if the message was sent in the correct guild (discord server - RUSA) */
    if (guild_id !== '1097165219274432695') return;

    const channel_id = message.channelId;
    /** Checking if the message was sent in the correct channel (timezone_logger) */
    if (channel_id !== '1206739020416294943') return;

    const is_timezone_message = message.content.search('GMT');
    /** Checking if the message is a timezone message (containing a word like GMT) */
    if (is_timezone_message == -1) return;

    const timezones = [
        { key: 'EST', value: ['GMT-12', 'GMT-11', 'GMT-10', 'GMT-9', 'GMT-8', 'GMT-7', 'GMT-6', 'GMT-5', 'GMT-4'] },
        { key: 'GMT', value: ['GMT-3', 'GMT-2', 'GMT-1', 'GMT-0', 'GMT+1', 'GMT+2', 'GMT+3', 'GMT+4'] },
        { key: 'AEST', value: ['GMT+5', 'GMT+6', 'GMT+7', 'GMT+8', 'GMT+9', 'GMT+10', 'GMT+11', 'GMT+12', 'GMT+13'] },
    ];

    let user_timezone = message.content.split('\n')[1];
    /** user_timezone = GMT-5, for example */  
      
    for (const item of timezones) {
        const item_timezone = item.key;
        const item_timezones = item.value;

        if (item_timezones.includes(user_timezone)) {
            user_timezone = item_timezone;
            /** Formatting the user_timezone, so instead of it being "GMT-5", for example, it'll be "EST" */
            break;
        };
    };
    
    const player_name = message.content.split('(')[0].trim();
    /** player_name = ahwargamer10, for example */

    const guild = await client.guilds.fetch('1097165219274432695');
    /** Fetching all the members and roles before looping */
    await guild.members.fetch();
    await guild.roles.fetch();

    let member;
    await guild.members.cache.forEach((server_member) => {
        if (server_member.nickname && !server_member.bot && server_member.nickname.includes(player_name)) {
            /** If the server member is not a bot and if the bot finds the "player_name" in the server member's nickname then found */
            member = server_member;
            return;
            /** Exit out of loop */
        };
    });
    if (!member) return;
    /** If no member was found containing the player_name then exit to prevent errors */

    await guild.roles.cache.forEach((server_role) => {
        if (server_role && server_role.name == user_timezone) {
            /** If the server_role's name is equal to the "user_timezone" timezone then role member the timezone role */
            member.roles.add(server_role.id);
            return;
             /** Exit out of loop */
        };
    });
});

client.login(process.env.TOKEN)