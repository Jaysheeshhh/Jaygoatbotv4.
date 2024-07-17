function toBoldFont(text) {
    const boldMap = {
        'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛',
        'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣',
        'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫',
        'Y': '𝗬', 'Z': '𝗭', 'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳',
        'g': '𝗴', 'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻',
        'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃',
        'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇'
    };
    return text.split('').map(char => boldMap[char] || char).join('');
}

async function checkShortCut(nickname, uid, usersData) {
    try {
        const userName = await usersData.getName(uid);
        const firstName = userName.split(' ')[0];
        const boldFirstName = toBoldFont(firstName);
        /\{userName\}/gi.test(nickname) ? nickname = nickname.replace(/\{userName\}/gi, boldFirstName) : null;
        /\{userID\}/gi.test(nickname) ? nickname = nickname.replace(/\{userID\}/gi, uid) : null;
        return nickname;
    } catch (e) {
        return nickname;
    }
}

module.exports = {
    config: {
        name: "setname",
        version: "1.5",
        author: "Jay",
        countDown: 5,
        role: 0,
        description: {
            vi: "Đổi biệt danh của tất cả thành viên trong nhóm chat hoặc những thành viên được tag theo một định dạng",
            en: "Change nickname of all members in chat or members tagged by a format"
        },
        category: "box chat",
        guide: {
            vi: {
                body: "   {pn} <nick name>: thay đổi biệt danh của bản thân"
                    + "\n   {pn} @tags <nick name>: thay đổi biệt danh của những thành viên được tag"
                    + "\n   {pn} all <nick name>: thay đổi biệt danh của tất cả thành viên trong nhóm chat"
                    + "\n\n   Với các shortcut có sẵn:"
                    + "\n   + {userName}: tên của thành viên"
                    + "\n   + {userID}: ID của thành viên"
                    + "\n\n   Ví dụ: (xem ảnh)",
                attachment: {
                    [`${__dirname}/assets/guide/setname_1.png`]: "https://i.ibb.co/gFh23zb/guide1.png",
                    [`${__dirname}/assets/guide/setname_2.png`]: "https://i.ibb.co/BNWHKgj/guide2.png"
                }
            },
            en: {
                body: "   {pn} <nick name>: change nickname of yourself"
                    + "\n   {pn} @tags <nick name>: change nickname of members tagged"
                    + "\n   {pn} all <nick name>: change nickname of all members in chat"
                    + "\n\nWith available shortcuts:"
                    + "\n   + {userName}: name of member"
                    + "\n   + {userID}: ID of member"
                    + "\n\n   Example: (see image)",
                attachment: {
                    [`${__dirname}/assets/guide/setname_1.png`]: "https://i.ibb.co/gFh23zb/guide1.png",
                    [`${__dirname}/assets/guide/setname_2.png`]: "https://i.ibb.co/BNWHKgj/guide2.png"
                }
            }
        }
    },

    langs: {
        vi: {
            error: "Đã có lỗi xảy ra, thử tắt tính năng liên kết mời trong nhóm và thử lại sau"
        },
        en: {
            error: "An error has occurred, try turning off the invite link feature in the group and try again later"
        }
    },

    onStart: async function ({ args, message, event, api, usersData, getLang }) {
        const mentions = Object.keys(event.mentions);
        let uids = [];
        let nickname = args.join(" ");

        if (args[0] === "all" || mentions.includes(event.threadID)) {
            uids = (await api.getThreadInfo(event.threadID)).participantIDs;
            nickname = args[0] === "all" ? args.slice(1).join(" ") : nickname.replace(event.mentions[event.threadID], "").trim();
        } else if (mentions.length) {
            uids = mentions;
            const allName = new RegExp(
                Object.values(event.mentions)
                    .map(name => name.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")) // fix error when name has special characters
                    .join("|")
                , "g"
            );
            nickname = nickname.replace(allName, "").trim();
        } else {
            uids = [event.senderID];
            nickname = nickname.trim();
        }

        try {
            const uid = uids.shift();
            await api.changeNickname(await checkShortCut(nickname, uid, usersData), event.threadID, uid);
        } catch (e) {
            return message.reply(getLang("error"));
        }

        for (const uid of uids) {
            try {
                await api.changeNickname(await checkShortCut(nickname, uid, usersData), event.threadID, uid);
            } catch (e) {
                return message.reply(getLang("error"));
            }
        }
    }
};
