import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Card, Row} from "react-bootstrap";
import {Context} from "../main.jsx";

const TypeBar = observer(() => {
    const {figure} = useContext(Context);

    return (
        <Row className="d-flex flex-wrap">
            {figure.types.map(type =>
                <Card
                    key={type.id}
                    className="figure__typeBar__item p-2 m-2"
                    style={{width: "150px", textAlign: "center", cursor: "pointer", borderWidth: "2px"}}
                    onClick={() => figure.setSelectedType(type)}
                    border={type.id === figure.selectedType.id ? "success" : "secondary"}
                >
                    {type.name}
                </Card>
            )}
        </Row>
    );
});

export default TypeBar;
