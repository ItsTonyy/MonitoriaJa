interface CustomConfig extends RequestInit {
  headers?: Record<string, string>;
}

interface ClientConfig extends CustomConfig {
  body?: any;
}

async function client(endpoint: string, { body, ...customConfig }: ClientConfig = {}) {
  const headers = { 'Content-Type': 'application/json' }

  const config: RequestInit = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  }

  if (body) {
    config.body = JSON.stringify(body)
  }

  let data
  try {
    const response = await window.fetch(endpoint, config)
    data = await response.json()
    if (response.ok) {
      return data
    }
    throw new Error(response.statusText)
  } catch (err: any) {
    return Promise.reject(err.message ? err.message : data)
  }
}

export const httpGet = async function (endpoint: string, customConfig: CustomConfig = {}) {
  return client(endpoint, { ...customConfig, method: 'GET' })
}

export const httpPost = async function (endpoint: string, body: any, customConfig: CustomConfig = {}) {
  return client(endpoint, { body, ...customConfig, method: 'POST' })
}

export const httpPut = async function (endpoint: string, body: any, customConfig: CustomConfig = {}) {
  return client(endpoint, { body, ...customConfig, method: 'PUT' })
}
