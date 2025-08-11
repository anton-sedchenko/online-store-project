const Router = require('express');
const axios = require('axios');
const router = new Router();

const NP_URL = 'https://api.novaposhta.ua/v2.0/json/';
const NP_KEY = process.env.NP_API_KEY;

router.post('/np/cities', async (req, res, next) => {
    try {
        const {search = ''} = req.body;
        const {data} = await axios.post(NP_URL, {
            apiKey: NP_KEY,
            modelName: 'Address',
            calledMethod: 'getCities',
            methodProperties: {FindByString: search}
        });
        res.json(data);
    } catch (e) { next(e); }
});

router.post('/np/warehouses', async (req, res, next) => {
    try {
        const {cityRef, type = 'Warehouse'} = req.body; // type: 'Warehouse' | 'Postomat'
        const {data} = await axios.post(NP_URL, {
            apiKey: NP_KEY,
            modelName: 'AddressGeneral',
            calledMethod: 'getWarehouses',
            methodProperties: {
                CityRef: cityRef,
                TypeOfWarehouseRef: type === 'Postomat' ? 'f9316480-5f2d-425d-bc2c-ac7cd29decf0' : undefined
            }
        });
        res.json(data);
    } catch (e) {next(e);}
});

module.exports = router;