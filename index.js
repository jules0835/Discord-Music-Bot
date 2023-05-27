const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior, AudioPlayerStatus } = require('@discordjs/voice');
const { voice, VoiceConnectionStatus } = require('discord.js');
// Import necessary modules from the 'discord.js' library for creating a Discord bot

const ytdl = require('ytdl-core');
// Import the 'ytdl-core' library for downloading YouTube audio

const TOKEN = 'YOUR_DISCORD_BOT_TOKEN_HERE';
// Replace 'YOUR_DISCORD_BOT_TOKEN_HERE' with your actual Discord bot token obtained from the Discord Developer Portal : https://discord.com/developers/applications

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildVoiceStates
    ]
});
// Create a new Discord client instance with specified intents

client.on('messageCreate', async message => {
    if (message.author.bot) return; // Ignore messages sent by bots

    if (message.content.startsWith('!play')) {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.reply('You must be in a voice channel to use this command!');
        }
        // Check if the user is in a voice channel

        const args = message.content.split(' ');
        if (args.length < 2) {
            return message.reply('You must specify a YouTube music URL or playlist!');
        }
        // Check if the user provided a valid YouTube URL or playlist

        const videoUrl = args[1];
        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator
        });
        // Join the voice channel specified by the user

        const stream = ytdl(videoUrl, { filter: 'audioonly' });

        const resource = createAudioResource(stream);
$
        const player = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Play } });

        player.on(AudioPlayerStatus.Idle, () => {
            connection.destroy();
        });

        player.play(resource);
        // Start playing the audio resource

        connection.subscribe(player);

        message.reply(`🎶 Playing ${videoUrl} in the channel ${voiceChannel.name}`);
        // Reply with a confirmation message
    }

    else if (message.content === '!stopplay') {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.reply('You must be in a voice channel to use this command!');
        }
        // Check if the user is in a voice channel

        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator
        });
        // Join the voice channel specified by the user

        connection.destroy();
        // Destroy the voice connection

        message.reply(`Playback stopped in the channel ${voiceChannel.name}`);
        // Reply with a confirmation message
    }

    else if (message.content === '!helpplay') {
        message.reply(`Hi ${message.author}! \nHere are the commands to use this bot in voice mode: \n!play <YouTube URL> : Play the music/playlist from YouTube in the voice channel \n!stopplay : Stop the music \n\n-!- If you want this bot to join your voice channel, you must be in a voice channel. \n-!- If you want this bot to play music, you must be in a voice channel. \n-!- If you want the Bot to stop playing music, you must be in a voice channel. \n-!- Remember to adjust the bot's volume by right-clicking on the bot in the voice channel to adjust the sound!`);
        // Reply with the help message explaining the available commands
    }
});

client.on('ready', () => {
    client.user.setPresence({
        activities: [{ name: `!play`, type: ActivityType.Listening }],
        status: 'online'
    });
    // Set the bot's presence status and activity you can change the status and activity to whatever you want

    console.log(`Logged in as ${client.user.tag}!`);
    // Log a message to the console indicating that the bot has successfully logged in
});

client.login(TOKEN);
// Log in to Discord using the specified bot token 
