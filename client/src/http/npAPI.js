const API_BASE = '/api/shipping';

async function post(url, body) {
    const res = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(body || {})
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    // відповіді беку з НП мають вигляд {success, data, errors}
    if (data?.success === false) {
        throw new Error(data?.errors?.[0] || 'Nova Poshta API error');
    }
    // Якщо бек просто проксить відповідь — вертаємо data.data, інакше data
    return data?.data ?? data;
}

// автокомпліт міст
export async function searchCities(query) {
    if (!query?.trim()) return [];
    const payload = { search: query.trim() };
    const data = await post(`${API_BASE}/np/cities`, payload);
    // бек віддає response.data від НП, що містить масив міст
    return data?.[0]?.Addresses ? data[0].Addresses : (data?.data ?? data);
}

// відділення/поштомати по місту
export async function getWarehouses({ cityRef, type = 'Branch' }) {
    const payload = { cityRef, type: type === 'Postomat' ? 'Postomat' : 'Warehouse' };
    return await post(`${API_BASE}/np/warehouses`, payload);
}