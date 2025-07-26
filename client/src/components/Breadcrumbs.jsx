import React, {useEffect, useState} from 'react';
import {Breadcrumb} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {fetchOneType} from '../http/typeAPI.js';

const buildTrail = async (typeId, acc = []) => {
    if (!typeId) return acc;
    const type = await fetchOneType(typeId);
    acc.unshift({id: type.id, name: type.name});
    if (type.parentId) {
        return buildTrail(type.parentId, acc);
    }
    return acc;
};

const Breadcrumbs = ({typeId}) => {
    const [trail, setTrail] = useState([]);

    useEffect(() => {
        buildTrail(typeId, []).then(setTrail);
    }, [typeId]);

    return (
        <Breadcrumb>
            <Breadcrumb.Item linkAs={Link} linkProps={{to: '/'}}>
                Головна
            </Breadcrumb.Item>
            {trail.map(({id, name}) => (
                <Breadcrumb.Item
                    key={id}
                    linkAs={Link}
                    linkProps={{to: `/category/${id}`}}
                    active={id === typeId}
                >
                    {name}
                </Breadcrumb.Item>
            ))}
        </Breadcrumb>
    );
};

export default Breadcrumbs;