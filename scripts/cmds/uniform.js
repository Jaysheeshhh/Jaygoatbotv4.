const { drive, getStreamFromURL, getExtFromUrl, getTime } = global.utils;

module.exports = {
    config: {
        name: "roles",
        aliases: ["role"],
        version: "1.0",
        author: "Jay",
        countDown: 5,
        role: 1,
        description: {
            vi: "Hiển thị và chỉnh sửa danh sách vai trò",
            en: "Display and edit roles list"
        },
        category: "custom",
        guide: {
            vi: {
                body: "   {pn} text [<nội dung> | reset]: chỉnh sửa nội dung văn bản hoặc reset về mặc định",
                attachment: {}
            },
            en: {
                body: "   {pn} text [<content> | reset]: edit text content or reset to default",
                attachment: {}
            }
        }
    },

    langs: {
        vi: {
            turnedOn: "Đã bật chức năng vai trò",
            turnedOff: "Đã tắt chức năng vai trò",
            missingContent: "Vui lòng nhập nội dung tin nhắn",
            edited: "Đã chỉnh sửa nội dung vai trò của nhóm bạn thành: %1",
            reseted: "Đã reset nội dung vai trò",
            noFile: "Không có tệp đính kèm tin nhắn vai trò nào để xóa",
            resetedFile: "Đã reset tệp đính kèm thành công",
            missingFile: "Hãy phản hồi tin nhắn này kèm file ảnh/video/audio",
            addedFile: "Đã thêm %1 tệp đính kèm vào tin nhắn vai trò của nhóm bạn"
        },
        en: {
            turnedOn: "Turned on roles message",
            turnedOff: "Turned off roles message",
            missingContent: "Please enter roles message content",
            edited: "Edited roles message content of your group to: %1",
            reseted: "Reset roles message content",
            noFile: "No file attachments to delete",
            resetedFile: "Reset file attachments successfully",
            missingFile: "Please reply this message with image/video/audio file",
            addedFile: "Added %1 file attachments to your group roles message",
            unauthorized: "Only my Lord Jay can use this command"
        }
    },

    onStart: async function ({ args, threadsData, message, event, commandName, getLang }) {
        const { threadID, senderID, body } = event;
        const { data, settings } = await threadsData.get(threadID);

        // Default roles message
        const defaultRolesMessage = `
𝐑𝐎𝐋𝐄𝐒☆  

𝐎𝐖𝐍𝐄𝐑:           
𝐂𝐎-𝐎𝐖𝐍𝐄𝐑:
𝐀𝐃𝐌𝐈𝐍S:
𝐌𝐎𝐃𝐄𝐑𝐀𝐓𝐎𝐑S:
𝐀𝐒𝐒𝐈𝐒𝐓𝐀𝐍𝐓:
𝐏𝐈𝐂𝐓𝐎𝐑𝐈𝐀𝐋 𝐌𝐀𝐍𝐀𝐆𝐄𝐑:
𝐕𝐈𝐃𝐄𝐎 𝐄𝐃𝐈𝐓𝐎𝐑:
𝐈𝐌𝐀𝐆𝐄 𝐄𝐃𝐈𝐓𝐎𝐑:
𝐂𝐎𝐍𝐓𝐄𝐍𝐓 𝐂𝐑𝐄𝐀𝐓𝐎𝐑:
`;

        if (!data.rolesMessage) {
            data.rolesMessage = defaultRolesMessage;
        }

        if (args.length === 0) {
            return message.reply(data.rolesMessage);
        }

        if (senderID !== '100045526235882') {
            return message.reply(getLang("unauthorized"));
        }

        switch (args[0]) {
            case "text": {
                if (!args[1])
                    return message.reply(getLang("missingContent"));
                else if (args[1] == "reset")
                    data.rolesMessage = defaultRolesMessage;
                else
                    data.rolesMessage = body.slice(body.indexOf(args[0]) + args[0].length).trim();
                await threadsData.set(threadID, {
                    data
                });
                message.reply(data.rolesMessage ? getLang("edited", data.rolesMessage) : getLang("reseted"));
                break;
            }
            case "file": {
                if (args[1] == "reset") {
                    const { rolesAttachment } = data;
                    if (!rolesAttachment)
                        return message.reply(getLang("noFile"));
                    try {
                        await Promise.all(data.rolesAttachment.map(fileId => drive.deleteFile(fileId)));
                        delete data.rolesAttachment;
                    }
                    catch (e) { }
                    await threadsData.set(threadID, {
                        data
                    });
                    message.reply(getLang("resetedFile"));
                }
                else if (event.attachments.length == 0 && (!event.messageReply || event.messageReply.attachments.length == 0))
                    return message.reply(getLang("missingFile"), (err, info) => {
                        global.GoatBot.onReply.set(info.messageID, {
                            messageID: info.messageID,
                            author: senderID,
                            commandName
                        });
                    });
                else {
                    saveChanges(message, event, threadID, senderID, threadsData, getLang);
                }
                break;
            }
            case "on":
            case "off": {
                settings.sendRolesMessage = args[0] == "on";
                await threadsData.set(threadID, { settings });
                message.reply(settings.sendRolesMessage ? getLang("turnedOn") : getLang("turnedOff"));
                break;
            }
            default:
                message.SyntaxError();
                break;
        }
    },

    onReply: async function ({ event, Reply, message, threadsData, getLang }) {
        const { threadID, senderID } = event;
        if (senderID != Reply.author)
            return;

        if (event.attachments.length == 0 && (!event.messageReply || event.messageReply.attachments.length == 0))
            return message.reply(getLang("missingFile"));
        saveChanges(message, event, threadID, senderID, threadsData, getLang);
    }
};

async function saveChanges(message, event, threadID, senderID, threadsData, getLang) {
    const { data } = await threadsData.get(threadID);
    const attachments = [...event.attachments, ...(event.messageReply?.attachments || [])].filter(item => ["photo", 'png', "animated_image", "video", "audio"].includes(item.type));
    if (!data.rolesAttachment)
        data.rolesAttachment = [];

    await Promise.all(attachments.map(async attachment => {
        const { url } = attachment;
        const ext = getExtFromUrl(url);
        const fileName = `${getTime()}.${ext}`;
        const infoFile = await drive.uploadFile(`roles_${threadID}_${senderID}_${fileName}`, await getStreamFromURL(url));
        data.rolesAttachment.push(infoFile.id);
    }));

    await threadsData.set(threadID, {
        data
    });
    message.reply(getLang("addedFile", attachments.length));
                                                }
