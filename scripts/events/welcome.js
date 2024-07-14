const { getTime, drive } = global.utils;

if (!global.temp.welcomeEvent)
    global.temp.welcomeEvent = {};

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
            welcomeMessage: "┏━━ [ 𝗠𝗶𝗰𝗮🎀 ]━━➣\n𝓱𝓮𝓵𝓵𝓸✨{userName}.🎀\n𝐖𝐞𝐥𝐜𝐨𝐦𝐞 𝐲𝐨𝐮 𝐭𝐨 𝐭𝐡𝐞 𝐜𝐡𝐚𝐭 𝐠𝐫𝐨𝐮𝐩:{boxName}🌊\n𝐇𝐚𝐯𝐞 𝐚 𝐧𝐢𝐜𝐞 {session}✨🎀\n┗━━━━━━━━━━━━➢",
            multiple1: "bạn",
            multiple2: "các bạn",
            defaultWelcomeMessage: "Xin chào {userName}.\nChào mừng bạn đến với {boxName}.\nChúc bạn có buổi {session} vui vẻ!"
        },
        en: {
            session1: "morning",
            session2: "noon",
            session3: "afternoon",
            session4: "evening",
            welcomeMessage: "┏━━ [ 𝗠𝗶𝗰𝗮🎀 ]━━➣\n𝓱𝓮𝓵𝓵𝓸✨{userName}.🎀\nWelcome to the chat group: {boxName}\nHave a nice {session} 😁👐\n┗━━━━━━━━━━━━➢",
            multiple1: "you",
            multiple2: "you guys",
            defaultWelcomeMessage: "Hello {userName}.\nWelcome {multiple} to the chat group: {boxName}\nHave a nice {session} 😁👐"
        }
    },

    onStart: async ({ threadsData, message, event, api, getLang }) => {
        if (event.logMessageType == "log:subscribe") {
            return async function () {
                const hours = getTime("HH");
                const { threadID } = event;
                const { nickNameBot } = global.GoatBot.config;
                const prefix = global.utils.getPrefix(threadID);
                const dataAddedParticipants = event.logMessageData.addedParticipants;

                // If new member is bot
                if (dataAddedParticipants.some((item) => item.userFbId == api.getCurrentUserID())) {
                    if (nickNameBot)
                        api.changeNickname(nickNameBot, threadID, api.getCurrentUserID());
                    return message.send(getLang("welcomeMessage", prefix));
                }

                // If new member
                if (!global.temp.welcomeEvent[threadID])
                    global.temp.welcomeEvent[threadID] = {
                        joinTimeout: null,
                        dataAddedParticipants: []
                    };

                // Push new member to array
                global.temp.welcomeEvent[threadID].dataAddedParticipants.push(...dataAddedParticipants);

                // If timeout is set, clear it
                clearTimeout(global.temp.welcomeEvent[threadID].joinTimeout);

                // Set new timeout
                global.temp.welcomeEvent[threadID].joinTimeout = setTimeout(async function () {
                    const threadData = await threadsData.get(threadID);
                    if (threadData.settings.sendWelcomeMessage == false)
                        return;

                    const dataAddedParticipants = global.temp.welcomeEvent[threadID].dataAddedParticipants;
                    const dataBanned = threadData.data.banned_ban || [];
                    const threadName = threadData.threadName;
                    const userName = [];
                    let multiple = false;

                    if (dataAddedParticipants.length > 1)
                        multiple = true;

                    for (const user of dataAddedParticipants) {
                        if (dataBanned.some((item) => item.id == user.userFbId))
                            continue;
                        userName.push(user.fullName);
                    }

                    if (userName.length == 0) return;

                    let { welcomeMessage = getLang("defaultWelcomeMessage") } = threadData.data;

                    welcomeMessage = welcomeMessage
                        .replace(/\{userName\}/g, userName.join(", "))
                        .replace(/\{boxName\}|\{threadName\}/g, threadName)
                        .replace(/\{session\}/g, hours <= 10
                            ? getLang("session1")
                            : hours <= 12
                                ? getLang("session2")
                                : hours <= 18
                                    ? getLang("session3")
                                    : getLang("session4"));

                    message.send(welcomeMessage);

                    delete global.temp.welcomeEvent[threadID];
                }, 1500);
            };
        }
    }
};
