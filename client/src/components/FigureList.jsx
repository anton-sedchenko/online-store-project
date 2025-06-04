import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../main.jsx";
import {Row} from "react-bootstrap";
import FigureItem from "./FigureItem.jsx";

const FigureList = observer(() => {
    const {figure} = useContext(Context);

    return (
        <Row className="d-flex">
            {figure.figures.map(figure =>
                <FigureItem key={figure.id} figure={figure}/>
            )}
        </Row>
    );
});

export default FigureList;