const { GoatWrapper } = require('fca-liane-utils');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
	config: {
		name: "mica",
		author: "Tokodori",
		role: 0,
		shortDescription: " ",
		longDescription: "",
		category: "admin",
		guide: "{pn}"
	},

	onStart: async function ({ api, event }) {
		try {
			const ownerInfo = {
				name: '𝗠𝗶𝗰𝗮🎀',
				gender: '𝗙𝗲𝗺𝗮𝗹𝗲',
				hobby: '𝗦𝗲𝗿𝘃𝗶𝗻𝗴 𝘂𝘀𝗲𝗿𝘀',
				Fb: '𝗜 𝘄𝗼𝗻'𝘁 𝘁𝗲𝗹𝗹 𝗶𝘁',
				Relationship: '𝗦𝗶𝗻𝗴𝗹𝗲',
				bio: '𝗜 𝘄𝗮𝘀 𝗱𝗲𝗽𝗹𝗼𝘆𝗲𝗱 𝗯𝘆 𝗺𝘆 𝗮𝗱𝗺𝗶𝗻 𝗷𝗮𝘆..'
			};

			const bold = 'https://i.imgur.com/yevluzl.mp4';
			const tmpFolderPath = path.join(__dirname, 'tmp');

			if (!fs.existsSync(tmpFolderPath)) {
				fs.mkdirSync(tmpFolderPath);
			}

			const videoResponse = await axios.get(bold, { responseType: 'arraybuffer' });
			const videoPath = path.join(tmpFolderPath, 'owner_video.mp4');

			fs.writeFileSync(videoPath, Buffer.from(videoResponse.data, 'binary'));

			const response = `
◈ MICA'S 𝖨𝖭𝖥𝖮𝖱𝖬𝖠𝖳𝖨𝖮𝖭:\n
Name: ${ownerInfo.name}
Gender: ${ownerInfo.gender}
Relationship: ${ownerInfo.Relationship}
Hobby: ${ownerInfo.hobby}
Fb: ${ownerInfo.Fb}
Bio: ${ownerInfo.bio}
			`;

			await api.sendMessage({
				body: response,
				attachment: fs.createReadStream(videoPath)
			}, event.threadID, event.messageID);

			fs.unlinkSync(videoPath);

			api.setMessageReaction('🌊', event.messageID, (err) => {}, true);
		} catch (error) {
			console.error('Error in ownerinfo command:', error);
			return api.sendMessage('An error occurred while processing the command.', event.threadID);
		}
	}
};

const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });
