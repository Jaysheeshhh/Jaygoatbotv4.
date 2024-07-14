const { getTime, drive } = global.utils;

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
			multiple2: "các bạn"
		},
		en: {
			session1: "morning",
			session2: "noon",
			session3: "afternoon",
			session4: "evening",
			welcomeMessage: "┏━━ [ 𝗠𝗶𝗰𝗮🎀 ]━━➣\n𝓱𝓮𝓵𝓵𝓸✨{userName}.🎀\n𝐖𝐞𝐥𝐜𝐨𝐦𝐞 𝐲𝐨𝐮 𝐭𝐨 𝐭𝐡𝐞 𝐜𝐡𝐚𝐭 𝐠𝐫𝐨𝐮𝐩:{boxName}🌊\n𝐇𝐚𝐯𝐞 𝐚 𝐧𝐢𝐜𝐞 {session}✨🎀\n┗━━━━━━━━━━━━➢"
		}
	},

	onStart: async ({ threadsData, message, event, api, getLang }) => {
		if (event.logMessageType == "log:subscribe") {
			return async function () {
				try {
					const hours = getTime("HH");
					const { threadID } = event;
					const { nickNameBot } = global.GoatBot.config;
					const dataAddedParticipants = event.logMessageData.addedParticipants;

					// if new member is bot
					if (dataAddedParticipants.some((item) => item.userFbId == api.getCurrentUserID())) {
						if (nickNameBot)
							api.changeNickname(nickNameBot, threadID, api.getCurrentUserID());
						return message.send(getLang("welcomeMessage"));
					}

					// if new member
					if (!global.temp.welcomeEvent[threadID])
						global.temp.welcomeEvent[threadID] = {
							joinTimeout: null,
							dataAddedParticipants: []
						};

					// push new member to array
					global.temp.welcomeEvent[threadID].dataAddedParticipants.push(...dataAddedParticipants);

					// if timeout is set, clear it
					clearTimeout(global.temp.welcomeEvent[threadID].joinTimeout);

					// set new timeout
					global.temp.welcomeEvent[threadID].joinTimeout = setTimeout(async function () {
						const threadData = await threadsData.get(threadID);

						if (!threadData || threadData.settings.sendWelcomeMessage === false)
							return;

						const dataAddedParticipants = global.temp.welcomeEvent[threadID].dataAddedParticipants;
						const dataBanned = threadData.data.banned_ban || [];
						const threadName = threadData.threadName;
						let { welcomeMessage } = getLang();

						let multiple = false;
						const userName = [];

						if (dataAddedParticipants.length > 1)
							multiple = true;

						for (const user of dataAddedParticipants) {
							if (dataBanned.some((item) => item.id == user.userFbId))
								continue;
							userName.push(user.fullName);
						}

						welcomeMessage = welcomeMessage
							.replace("{userName}", userName.join(", "))
							.replace("{boxName}", threadName)
							.replace("{session}", hours <= 10 ? getLang("session1") : hours <= 12 ? getLang("session2") : hours <= 18 ? getLang("session3") : getLang("session4"));

						const gifUrl = "https://i.imgur.com/pRzNLnR.gif"; // Replace with your GIF URL
						const attachment = await drive.getFile(gifUrl, "stream");

						message.send({
							body: welcomeMessage,
							attachment: attachment
						});

						delete global.temp.welcomeEvent[threadID];
					}, 1500);
				} catch (error) {
					console.error("Error in welcome.js:", error);
				}
			};
		}
	}
};
