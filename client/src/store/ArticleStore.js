import {makeAutoObservable, runInAction} from "mobx";
import {fetchArticles} from "../http/articleAPI.js";

export default class ArticleStore {
    articles = [];
    total = 0;
    page = 1;
    limit = 8;

    constructor() {
        makeAutoObservable(this);
    }

    async loadArticles(p = this.page) {
        this.page = p;
        const {rows, count} = await fetchArticles(p, this.limit);
        runInAction(() => {
            this.articles = rows;
            this.total = count;
        });
    }
}