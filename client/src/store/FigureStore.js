import {makeAutoObservable} from "mobx";

export default class FigureStore {
    constructor() {
        this._types = [
            {id: 1, name: 'Набір фігурок'},
            {id: 2, name: 'Святкові'},
            {id: 3, name: 'Тваринки'}
        ];
        this._figures = [
            {id: 1, name: 'Набір метеликів', price: 100, img: 'C://Users/Anton/Desktop/candles site/2.jpg'},
            {id: 2, name: 'Набір машинок', price: 100, img: 'C://Users/Anton/Desktop/candles site/machines.jpg'},
            {id: 3, name: 'Набір ведмедиків', price: 100, img: 'C://Users/Anton/Desktop/candles site/3.jpg'},
            {id: 4, name: 'Зайчик', price: 100, img: 'C://Users/Anton/Desktop/candles site/rabbit.jpg'}
        ];
        makeAutoObservable(this);
    }

    setTypes(types) {
        this._types = types;
    }

    setFigures(figures) {
        this._figures = figures;
    }

    get types() {
        return this._types;
    }

    get figures() {
        return this._figures;
    }
}
