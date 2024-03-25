export class Message {

    id: string;
    parentMessageId: string | null;
    body: string;
    author: string;
    date: string;
    lastEditTime: string;
    channelId: number;
    attachment: any;
    linkPreview?: { title: string, description: string, image: string, url: string, error: string };

    constructor(
        id: string,
        parentMessageId: string | null,
        body: string,
        author: string,
        date: string,
        lastEditTime: string,
        channelId: number,
        attachment: any
    ) {
        this.id = id;
        this.parentMessageId = parentMessageId;
        this.body = body;
        this.author = author;
        this.date = date;
        this.lastEditTime = lastEditTime;
        this.channelId = channelId;
        this.attachment = attachment;
    }

}
