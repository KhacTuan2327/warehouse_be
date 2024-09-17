const axios = require('axios');

// Lấy mã token
async function getToken() {
    const response = await axios.post('http://127.0.0.1:1880/auth/token', {
        client_id: 'node-red-admin',
        grant_type: 'password',
        scope: '*',
        username: 'admin',
        password: 'a'
    });
    return response.data.access_token;
}

// Lấy danh sách flows
async function getFlows(token) {
    const response = await axios.get('http://127.0.0.1:1880/flows', {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
}

// Tạo một flow mới
async function createFlow(token, flowData) {
    const response = await axios.post('http://127.0.0.1:1880/flows', flowData, {
        headers: { Authorization: `Bearer ${token}` },
        headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
}

// Cập nhật một flow
async function updateFlow(token, flowId, flowData) {
    const response = await axios.put(`http://127.0.0.1:1880/flows/${flowId}`, flowData, {
        headers: { Authorization: `Bearer ${token}` },
        headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
}

// Xóa một flow
async function deleteFlow(token, flowId) {
    const response = await axios.delete(`http://127.0.0.1:1880/flows/${flowId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
}

// Sử dụng các hàm trên
(async () => {
    const token = await getToken();
    console.log(await getFlows(token));
})();
