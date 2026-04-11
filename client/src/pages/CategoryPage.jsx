import React from 'react';
import { Navigate } from 'react-router-dom';
import { HOME_ROUTE } from '../utils/consts.js';

const CategoryPage = () => {
    return <Navigate to={HOME_ROUTE} replace />;
};

export default CategoryPage;