export class Message {

    id: string;
    parentMessageId: string | null;
    body: string;
    author: string;
    date: string;
    lastEditTime: string;
    channel: number;
    attachment: any;
    channelId: number;

    constructor(
        id: string,
        parentMessageId: string | null,
        body: string,
        author: string,
        date: string,
        lastEditTime: string,
        channel: number,
        attachment: any,
        channelId: number
    ) {
        this.id = id;
        this.parentMessageId = parentMessageId;
        this.body = body;
        this.author = author;
        this.date = date;
        this.lastEditTime = lastEditTime;
        this.channel = channel;
        this.attachment = attachment;
        this.channelId = channelId;
    }

}
