const NP_URL = 'https://api.novaposhta.ua/v2.0/json/';

async function np(method, modelName, methodProperties = {}) {
    const body = {
        apiKey: import.meta.env.VITE_NP_API_KEY,
        modelName,
        calledMethod: method,
        methodProperties
    };
    const res = await fetch(NP_URL, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.errors?.[0] || 'Nova Poshta API error');
    return data.data;
}

// автокомпліт міст
export async function searchCities(query) {
    if (!query?.trim()) return [];
    const [result] = await np('searchSettlements', 'Address', {
        CityName: query.trim(),
        Limit: 10
    });
    return result?.Addresses || [];
}

// відділення/поштомати по місту
export async function getWarehouses({cityRef, type = 'Branch'}) {
    const typeOfWarehouseRef = type === 'Postomat'
        ? 'f9316480-5f2d-425d-bc2c-ac7cd29decf0' // поштомат
        : '';
    return await np('getWarehouses', 'AddressGeneral', {
        CityRef: cityRef,
        TypeOfWarehouseRef: typeOfWarehouseRef,
        Page: 1,
        Limit: 100
    });
}