export default class Origin {
    constructor(ownerId, authorName, url, website) {
        this.ownerId = ownerId;
        this.authorName = authorName;
        this.url = url;
        this.website = website;
    }

    static HOMEMADE_RECIPE_URL() {
        return 'Original';
    }
}
