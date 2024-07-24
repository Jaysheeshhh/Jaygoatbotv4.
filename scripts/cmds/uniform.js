const { getPrefix } = global.utils;

module.exports = {
    config: {
        name: "uniform",
        version: "1.0",
        author: "Jay", // wag mo palitan author,laplapin ko kiffy nyoo..
        countDown: 5,
        role: 0,
        description: {
            vi: "Gửi thông tin về đồng phục nhóm",
            en: "Send information about group uniform"
        },
        category: "box chat",
        guide: {
            vi: "{pn}: gửi thông tin về đồng phục nhóm.",
            en: "{pn}: send information about group uniform."
        }
    },

    onStart: async function ({ message }) {
        const uniformInfo = `𝐔𝐍𝐈𝐅𝐎𝐑𝐌☆🥋\n-BOYS♦️\nSHIRT👔:18555900580\nPANTS👖:18569230680\nSCYTHE🗡️:18275328462\n\nGIRLS🎀\nSHIRT👔:18555900580\nPANTS👖:18556765249\nSCYTHE🗡️:18275328462\n*/It's up to you if you want to change the pants`;
        message.reply(uniformInfo);
    }
};
