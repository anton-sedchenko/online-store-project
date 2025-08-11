import {$host} from './index.js';

// автокомпліт міст
export async function searchCities(query) {
    if (!query?.trim()) return [];
    const { data } = await $host.post('/shipping/np/cities', { search: query.trim() });
    // Бек віддає або data.data (як відповідь НП), або одразу масив
    const payload = data?.data ?? data;
    return payload?.[0]?.Addresses ? payload[0].Addresses : payload;
}

// відділення/поштомати по місту
export async function getWarehouses({ cityRef, type = 'Branch' }) {
    const kind = type === 'Postomat' ? 'Postomat' : 'Warehouse';
    const { data } = await $host.post('/shipping/np/warehouses', { cityRef, type: kind });
    return data?.data ?? data;
}