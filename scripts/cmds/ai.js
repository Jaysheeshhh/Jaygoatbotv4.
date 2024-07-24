const axios = require('axios');

module.exports = {
  config: {
    name: 'ai',
    version: '1.0',
    author: 'LiANE @nealianacagara',
    role: 0,
    category: 'Ai-Chat',
    shortDescription: {
      en: `A custom artificial intelligence designed and created by Liane Cagara with purpose to interact with users like you in a personalized and informative manner. Trained on a vast amount of text data.`
    },
    longDescription: {
      en: `A custom artificial intelligence designed and created by Liane Cagara with purpose to interact with users like you in a personalized and informative manner. Trained on a vast amount of text data.`
    },
    guide: {
      en: '[query]'
    },
  },

  onStart: async function ({ api, event, args, usersData }) {
    try {
      const query = args.join(" ") || "hello";
      const user = await usersData.get(event.senderID);
      const name = user ? user.name : "a user";
      const currentDateTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Manila", hour12: true });

      api.setMessageReaction("⏳", event.messageID, (err) => console.log(err), true);
      const processingMessage = await api.sendMessage(
        `Asking. Please wait a moment...`,
        event.threadID
      );

      const apiUrl = `https://liaspark.chatbotcommunity.ltd/@LianeAPI_Reworks/api/axis?key=j86bwkwo-8hako-12C&userName=${encodeURIComponent(name)}&query=${encodeURIComponent(query)}`;
      const response = await axios.get(apiUrl);

      if (response.data && response.data.message) {
        const trimmedMessage = response.data.message.trim();
        const responseMessage = `𝗠𝗶𝗰𝗮🎀\n━━━━━━━━━━━━━━━━\n➤𝘼𝙘𝙚 𝘼𝙙𝙫𝙤𝙘𝙖𝙩𝙚𝙨 (𝘼𝘼𝙂)♦\n\n${trimmedMessage}\n━━━━━━━━━━━━━━━━\n🗣 Asked by: ${name}\n⏰ 𝑅𝑒𝑠𝑝𝑜𝑛𝑑 𝑇𝑖𝑚𝑒: ${currentDateTime}`;

        api.setMessageReaction("✅", event.messageID, (err) => console.log(err), true);
        await api.sendMessage({ body: responseMessage }, event.threadID, event.messageID);

        console.log(`Sent 𝗠𝗶𝗰𝗮🎀's response to the user`);
      } else {
        throw new Error(`Invalid or missing response from 𝗠𝗶𝗰𝗮🎀 API`);
      }

      await api.unsendMessage(processingMessage.messageID);
    } catch (error) {
      console.error(`❌ | Failed to get 𝗠𝗶𝗰𝗮🎀's response: ${error.message}`);
      const currentDateTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Manila", hour12: true });
      const errorMessage = `𝗠𝗶𝗰𝗮🎀\n━━━━━━━━━━━━━━━━\n⛔ 𝗡𝗼𝘁 𝗙𝗼𝘂𝗻𝗱\n\nThe AI you're trying to access doesn't exist or is unavailable, please try again later!\n━━━━━━━━━━━━━━━━\n🗣 Asked by: ${name}\n⏰ 𝑅𝑒𝑠𝑝𝑜𝑛𝑑 𝑇𝑖𝑚𝑒: ${currentDateTime}`;
      api.sendMessage(errorMessage, event.threadID);
    }
  },
};
