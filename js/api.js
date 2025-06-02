const baseUrl = 'https://dev.katib.cloud';
const API_TOKEN = 'DpacnJf3uEQeM7HN';

const defaultState = {
  currentPage: 1,
  totalPages: 1,
  totalRecords: 0,
  isSubmitting: false
};

const state = {
  admin: { ...defaultState },
  campaign: { ...defaultState },
  detailcampaign: { ...defaultState },
  logcampaign: { ...defaultState },
  tracking: { ...defaultState },
  pretext: { ...defaultState },
  quicklink: { ...defaultState }
};

const endpoints = ['adminwago', 'campaignwago', 'detailcampaignwago', 'logcampaignwago', 'trackingwago', 'pretextwago', 'quicklinkwago'].reduce((acc, type) => {
  acc[type] = {
    table: `${baseUrl}/table/${type}/${owner_id}`,
    list: `${baseUrl}/list/${type}/${owner_id}`,
    detail: `${baseUrl}/detail/${type}`,
    update: `${baseUrl}/update/${type}`,
    create: `${baseUrl}/add/${type}`,
    delete: `${baseUrl}/delete/${type}`
  };
  return acc;
}, {});

async function fetchData(type, id = null, page = state[currentDataType].currentPage) {
  try {
    const url = (detail_id != null && id)
    ? `${endpoints[type].table}/${id}/${page}?search=${currentDataSearch}`
    : `${endpoints[type].table}/${page}?search=${currentDataSearch}`;

    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${API_TOKEN}` }
    });
    
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${type} data:`, error);
    return { data: [], totalRecords: 0, totalPages: 0 };
  }
}

async function fetchList(type) {
  try {
    const url = `${endpoints[type].list}`;
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${API_TOKEN}` }
    });

    if (!response.ok) throw new Error(`Failed to fetch ${type} data: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${type} list:`, error);
    return [];
  }
}

async function fetchById(type, id) {
  try {
    const response = await fetch(`${endpoints[type].detail}/${id}`, {
      headers: { 'Authorization': `Bearer ${API_TOKEN}` }
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${type} by ID:`, error);
    return null;
  }
}

async function updateData(type, id, payload) {
  try {
    const response = await fetch(`${endpoints[type].update}/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error(`Error updating ${type} data:`, error);
    return null;
  }
}

async function createData(type, payload) {
  try {
    const body = JSON.stringify({ owner_id, ...payload });
    const response = await fetch(`${endpoints[type].create}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: body
    });

    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error(`Error creating ${type}:`, error);
    return null;
  }
}

async function deleteData(type, id) {
  try {
    const response = await fetch(`${endpoints[type].delete}/${id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${API_TOKEN}` }
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error(`Error deleting ${type}:`, error);
    return null;
  }
}