export class Message {

    id: string;
    parentMessageId: string | null;
    body: string;
    author: string;
    date: string;
    lastEditTime: string;
    channel: number;
    attachment: any;

    constructor(
        id: string,
        parentMessageId: string | null,
        body: string,
        author: string,
        date: string,
        lastEditTime: string,
        channel: number,
        attachment: any,
    ) {
        this.id = id;
        this.parentMessageId = parentMessageId;
        this.body = body;
        this.author = author;
        this.date = date;
        this.lastEditTime = lastEditTime;
        this.channel = channel;
        this.attachment = attachment;
    }

}
