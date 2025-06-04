import {makeAutoObservable} from "mobx";

export default class FigureStore {
    constructor() {
        this._types = [
            {id: 1, name: 'Набір фігурок'},
            {id: 2, name: 'Святкові'},
            {id: 3, name: 'Тваринки'},
        ];
        this._figures = [
            {id: 1, name: 'Набір метеликів', price: 100, img: '../2.jpg'},
            {id: 2, name: 'Набір машинок', price: 100, img: '../machines.jpg'},
            {id: 3, name: 'Набір ведмедиків', price: 100, img: '../3.jpg'},
            {id: 4, name: 'Зайчик', price: 100, img: '../rabbit.jpg'},
            {id: 5, name: 'Набір машинок', price: 100, img: '../machines.jpg'},
            {id: 6, name: 'Набір ведмедиків', price: 100, img: '../3.jpg'},
            {id: 7, name: 'Зайчик', price: 100, img: '../rabbit.jpg'},
        ];
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
