const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "tyga",
    description: "Responds with a GIF when someone mentions Tyga.",
    category: "fun",
    usage: "{p}tyga"
  },

  onStart: async function ({ api, event }) {
    try {
      const gifUrl = 'https://i.imgur.com/O2kOURf.jpeg'; // GIF URL to display

      const tmpFolderPath = path.join(__dirname, 'tmp');

      if (!fs.existsSync(tmpFolderPath)) {
        fs.mkdirSync(tmpFolderPath);
      }

      const gifResponse = await axios.get(gifUrl, { responseType: 'arraybuffer' });
      const gifPath = path.join(tmpFolderPath, 'tyga_gif.jpeg');
      fs.writeFileSync(gifPath, Buffer.from(gifResponse.data, 'binary'));

      await api.sendMessage({
        body: "Tyga parang sigbin", // Updated message here
        attachment: fs.createReadStream(gifPath)
      }, event.threadID, event.messageID);

    } catch (error) {
      console.error('Error in tyga command:', error);
      return api.sendMessage('An error occurred while processing the command.', event.threadID);
    }
  },

  onChat: async function({ api, event }) {
    try {
      const lowercaseBody = event.body.toLowerCase();
      if (lowercaseBody === "tyga" || lowercaseBody.startsWith("{p}tyga")) {
        await this.onStart({ api, event });
      }
    } catch (error) {
      console.error('Error in onChat function:', error);
    }
  }
};
