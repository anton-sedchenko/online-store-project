import {makeAutoObservable} from "mobx";

export default class FigureStore {
    constructor() {
        this._types = [];
        this._figures = [];
        this._selectedType = {};
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

    get types() {
        return this._types;
    }

    get figures() {
        return this._figures;
    }

    get selectedType() {
        return this._selectedType;
    }
}
