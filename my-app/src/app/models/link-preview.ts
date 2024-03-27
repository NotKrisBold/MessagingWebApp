export class LinkPreview {
    title: string | undefined;
    description: string | undefined;
    image: string | undefined;
    url: string | undefined;
    error: string | undefined;

    constructor(title: string | undefined, description: string | undefined, image: string | undefined, url: string | undefined) {
        this.title = title;
        this.description = description;
        this.image = image;
        this.url = url;
        this.error = '';
    }
}

