import {makeAutoObservable} from "mobx";
import {fetchTypes as _fetchTypesAPI} from "../http/typeAPI.js";

export default class FigureStore {
    constructor() {
        this._types = [];
        this._figures = [];
        this._selectedType = {};
        this._totalCount = 0;
        this._currentPage = 1;
        this._figuresCountOnCurrentRequest = 0;
        this._figuresLimitOnOnePage = 8;
        makeAutoObservable(this);
    }

    setTypes(types) {
        this._types = types;
    }

    setFigures(figures) {
        this._figures = figures;
    }

    setSelectedType(type) {
        this._selectedType = type;
    }

    setCurrentPage(page) {
        this._currentPage = page;
    }

    setFiguresCountOnCurrentRequest(count) {
        this._figuresCountOnCurrentRequest = count;
    }

    setTotalCount(count) {
        this._totalCount = count;
    }

    setFiguresLimitOnOnePage(limit) {
        this._figuresLimitOnOnePage = limit;
    }

    get types() {
        return this._types;
    }

    async fetchTypes() {
        const data = await _fetchTypesAPI();
        this.setTypes(data);
    }

    get figures() {
        return this._figures;
    }

    get selectedType() {
        return this._selectedType;
    }

    get currentPage() {
        return this._currentPage;
    }

    get totalCount() {
        return this._totalCount;
    }

    get figuresCountOnCurrentRequest() {
        return this._figuresCountOnCurrentRequest;
    }

    get figuresLimitOnOnePage() {
        return this._figuresLimitOnOnePage;
    }
}
