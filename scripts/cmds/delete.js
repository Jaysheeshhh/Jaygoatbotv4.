module.exports = {
  config: {
    name: "delete",
    aliases: ["del"],
    author: "S",
    role: 2,
    category: "system"
  },

  onStart: async function ({ api, event, args }) {
    const fs = require('fs');
    const path = require('path');

    const allowedUser = "100045526235882";
    const senderID = event.senderID;

    if (senderID !== allowedUser) {
      api.sendMessage("You can't use this command only my Lord Jay can.", event.threadID, event.messageID);
      return;
    }

    const fileName = args[0];

    if (!fileName) {
      api.sendMessage("Please provide a file name to delete.", event.threadID, event.messageID);
      return;
    }

    const filePath = path.join(__dirname, fileName);

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(err);
        api.sendMessage(`❎ | Failed to delete ${fileName}.`, event.threadID, event.messageID);
        return;
      }
      api.sendMessage(`✅ ( ${fileName} ) Deleted successfully!`, event.threadID, event.messageID);
    });
  }
};
