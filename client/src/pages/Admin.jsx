import React, {useState} from 'react';
import {Button, Container} from "react-bootstrap";
import CreateType from "../components/modals/CreateType.jsx";
import CreateFigure from "../components/modals/CreateFigure.jsx";

const Admin = () => {
    const [typeVisible, setTypeVisible] = useState(false);
    const [figureVisible, setFigureVisible] = useState(false);

    return (
        <Container className="d-flex flex-column">
            <Button
                variant={"outline-dark"}
                className="admin__page__action-btn"
                onClick={() => setTypeVisible(true)}
            >
                Додати тип
            </Button>
            <Button
                variant={"outline-dark"}
                className="admin__page__action-btn"
                onClick={() => setFigureVisible(true)}
            >
                Додати фігурку
            </Button>
            <CreateFigure show={figureVisible} onHide={() => setFigureVisible(false)}/>
            <CreateType show={typeVisible} onHide={() => setTypeVisible(false)}/>
        </Container>
    );
};

export default Admin;
