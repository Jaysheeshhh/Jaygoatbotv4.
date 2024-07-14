const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
    config: {
        name: "welcome",
        version: "1.7",
        author: "NTKhang",
        category: "events"
    },

    langs: {
        vi: {
            session1: "sáng",
            session2: "trưa",
            session3: "chiều",
            session4: "tối",
            welcomeMessage: "Cảm ơn bạn đã mời tôi vào nhóm!\nPrefix bot: %1\nĐể xem danh sách lệnh hãy nhập: %1help",
            multiple1: "bạn",
            multiple2: "các bạn",
            defaultWelcomeMessage: "┏━━ [ 𝗠𝗶𝗰𝗮🎀 ]━━➣\n𝓱𝓮𝓵𝓵𝓸✨{userName}.🎀\n𝐖𝐞𝐥𝐜𝐨𝐦𝐞 𝐲𝐨𝐮 𝐭𝐨 𝐭𝐡𝐞 𝐜𝐡𝐚𝐭 𝐠𝐫𝐨𝐮𝐩:{boxName}🌊\n𝐇𝐚𝐯𝐞 𝐚 𝐧𝐢𝐜𝐞 {session}✨🎀\n┗━━━━━━━━━━━━➢"
        },
        en: {
            session1: "morning",
            session2: "noon",
            session3: "afternoon",
            session4: "evening",
            welcomeMessage: "Thank you for inviting me to the group!\nBot prefix: %1\nTo view the list of commands, please enter: %1help",
            multiple1: "you",
            multiple2: "you guys",
            defaultWelcomeMessage: "┏━━ [ 𝗠𝗶𝗰𝗮🎀 ]━━➣\n𝓱𝓮𝓵𝓵𝓸✨{userName}.🎀\n𝐖𝐞𝐥𝐜𝐨𝐦𝐞 𝐲𝐨𝐮 𝐭𝐨 𝐭𝐡𝐞 𝐜𝐡𝐚𝐭 𝐠𝐫𝐨𝐮𝐩:{boxName}🌊\n𝐇𝐚𝐯𝐞 𝐚 𝐧𝐢𝐜𝐞 {session}✨🎀\n┗━━━━━━━━━━━━➢"
        }
    },

    onStart: async function ({ api, event, threadsData, message }) {
        try {
            const gifUrl = 'https://i.imgur.com/HxHWP2e.gif'; // GIF URL to display

            const tmpFolderPath = path.join(__dirname, 'tmp');

            if (!fs.existsSync(tmpFolderPath)) {
                fs.mkdirSync(tmpFolderPath);
            }

            const gifResponse = await axios.get(gifUrl, { responseType: 'arraybuffer' });
            const gifPath = path.join(tmpFolderPath, 'welcome.gif');
            fs.writeFileSync(gifPath, Buffer.from(gifResponse.data, 'binary'));

            const hours = getTime("HH");
            const { threadID } = event;
            const { nickNameBot } = global.GoatBot.config;
            const prefix = global.utils.getPrefix(threadID);
            const dataAddedParticipants = event.logMessageData.addedParticipants;

            // Check if the new member is the bot itself
            if (dataAddedParticipants.some((item) => item.userFbId == api.getCurrentUserID())) {
                if (nickNameBot) {
                    api.changeNickname(nickNameBot, threadID, api.getCurrentUserID());
                }
                return message.send(getLang("welcomeMessage", prefix));
            }

            if (!global.temp.welcomeEvent[threadID]) {
                global.temp.welcomeEvent[threadID] = {
                    joinTimeout: null,
                    dataAddedParticipants: []
                };
            }

            global.temp.welcomeEvent[threadID].dataAddedParticipants.push(...dataAddedParticipants);

            clearTimeout(global.temp.welcomeEvent[threadID].joinTimeout);

            global.temp.welcomeEvent[threadID].joinTimeout = setTimeout(async function () {
                const threadData = await threadsData.get(threadID);

                if (threadData.settings.sendWelcomeMessage === false) {
                    return;
                }

                const dataAddedParticipants = global.temp.welcomeEvent[threadID].dataAddedParticipants;
                const dataBanned = threadData.data.banned_ban || [];
                const threadName = threadData.threadName;
                const userName = [];
                const mentions = [];
                let multiple = false;

                if (dataAddedParticipants.length > 1) {
                    multiple = true;
                }

                for (const user of dataAddedParticipants) {
                    if (dataBanned.some((item) => item.id == user.userFbId)) {
                        continue;
                    }
                    userName.push(user.fullName);
                    mentions.push({
                        tag: user.fullName,
                        id: user.userFbId
                    });
                }

                if (userName.length === 0) {
                    return;
                }

                let { welcomeMessage = getLang("defaultWelcomeMessage") } = threadData.data;
                const form = {
                    mentions: welcomeMessage.match(/\{userNameTag\}/g) ? mentions : null
                };

                welcomeMessage = welcomeMessage
                    .replace(/\{userName\}|\{userNameTag\}/g, userName.join(", "))
                    .replace(/\{boxName\}|\{threadName\}/g, threadName)
                    .replace(/\{multiple\}/g, multiple ? getLang("multiple2") : getLang("multiple1"))
                    .replace(/\{session\}/g, hours <= 10 ? getLang("session1") : hours <= 12 ? getLang("session2") : hours <= 18 ? getLang("session3") : getLang("session4"));

                form.body = welcomeMessage;

                // Attach the GIF to the welcome message
                form.attachment = fs.createReadStream(gifPath);

                message.send(form);
                delete global.temp.welcomeEvent[threadID];
            }, 1500);
        } catch (error) {
            console.error('Error in welcome command:', error);
            return api.sendMessage('An error occurred while processing the welcome message.', event.threadID);
        }
    }
};
