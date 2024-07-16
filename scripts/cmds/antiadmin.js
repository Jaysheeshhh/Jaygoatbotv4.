const fs = require('fs');

const exemptedUsers = ["61562102967389", "100045526235882"];

function l() {
  try {
    const d = fs.readFileSync("admin.json", "utf8");
    return JSON.parse(d);
  } catch (e) {
    return {};
  }
}

function s(s) {
  fs.writeFileSync("admin.json", JSON.stringify(s, null, 2));
}

let a = l();

module.exports = {
  config: {
    name: "antiadmin",
    version: "1.0",
    author: "Kshitiz", // may pinalitan si Jay HAHAHAH.
    countDown: 5,
    role: 1,
    shortDescription: "",
    longDescription: "anti gc admin: If someone removes you from admin, the bot will add you again as admin. If the bot is removed from admin, moye moye.",
    category: "box",
    guide: "{pn} off or on - current state always on.",
  },

  onStart: async function({ message, event, threadsData, args }) {
    if (args[0] === "off") {
      a[event.threadID] = 'off';
      s(a);
      return message.reply(`Disabled.`);
    } else if (args[0] === "on") {
      delete a[event.threadID];
      s(a);
      return message.reply(`Enabled.`);
    } else {
      return message.reply(`Usage: {pn} off to turn off`);
    }
  },

  onEvent: async function({ api, event, threadsData }) {
    if (a[event.threadID] === 'off' || !event.logMessageData || event.logMessageData.ADMIN_EVENT !== "remove_admin") {
      return;
    }

    const threadID = event.threadID;
    const targetID = event.logMessageData.TARGET_ID;
    const authorID = event.author;

    try {
      // Check if the author or the target is in the exempted list
      if (!exemptedUsers.includes(authorID) && !exemptedUsers.includes(targetID)) {
        await api.changeAdminStatus(threadID, targetID, true);
        await api.changeAdminStatus(threadID, authorID, false);
      }
    } catch (error) {
      console.error("Error", error);
    }
  }
};
