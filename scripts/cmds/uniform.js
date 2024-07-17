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
        const uniformInfo = `𝐔𝐍𝐈𝐅𝐎𝐑𝐌☆\n-BOY/GIRL👭♦️\nSHIRT:18178580102\nPANTS:8843663727\n*/It's up to you if you want to change the pants`;
        message.reply(uniformInfo);
    }
};
