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
			welcomeMessage: "┏━━ [ 𝗠𝗶𝗰𝗮🎀 ]━━➣\n𝓱𝓮𝓵𝓵𝓸✨{userName}.🎀\n𝐖𝐞𝐥𝐜𝐨𝐦𝐞 𝐲𝐨𝐮 𝐭𝐨 𝐭𝐡𝐞 𝐜𝐡𝐚𝐭 𝐠𝐫𝐨𝐮𝐩:{boxName}🌊\n𝐇𝐚𝐯𝐞 𝐚 𝐧𝐢𝐜𝐞 {session}✨🎀\n┗━━━━━━━━━━━━➢",
			multiple1: "you",
			multiple2: "you guys"
		}
	},

	onStart: async ({ threadsData, message, event, api, getLang }) => {
		if (event.logMessageType == "log:subscribe") {
			return async function () {
				const hours = getTime("HH");
				const { threadID } = event;
				const dataAddedParticipants = event.logMessageData.addedParticipants;

				// Retrieve thread data and settings if needed
				const threadData = await threadsData.get(threadID);
				const { threadName } = threadData;

				let userName = dataAddedParticipants.map(user => user.fullName).join(", ");
				let multiple = dataAddedParticipants.length > 1;

				const welcomeMessage = getLang("welcomeMessage")
					.replace(/\{userName\}/g, userName)
					.replace(/\{boxName\}|\{threadName\}/g, threadName)
					.replace(/\{session\}/g, getLang(hours <= 10 ? "session1" : hours <= 12 ? "session2" : hours <= 18 ? "session3" : "session4"));

				const form = { body: welcomeMessage };

				// Handle attachment if exists
				if (threadData.data.welcomeAttachment) {
					const attachments = threadData.data.welcomeAttachment.map(file => drive.getFile(file, "stream"));
					form.attachment = (await Promise.allSettled(attachments)).filter(({ status }) => status === "fulfilled").map(({ value }) => value);
				} else {
					form.attachment = [{
						type: "animated_image",
						src: "https://i.imgur.com/bnWYYp3.gif"
					}];
				}

				message.send(form);
			};
		}
	}
};
