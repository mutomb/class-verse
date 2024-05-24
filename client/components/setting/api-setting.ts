const create = async (params: { userId: any; }, credentials: { token: any; }, setting: {colorMode: string}) => {
  try {
    let response = await fetch(`/api/setting/${params.userId}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + credentials.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(setting)
    })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}

const update = async (params: { userId: any; }, credentials: { token: any; }, setting: {colorMode: string}) => {
  try {
    let response = await fetch(`/api/setting/${params.userId}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + credentials.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(setting)
    })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}

const read = async (params: { userId: any; }, credentials: { token: any; }) => {
  try {
    let response = await fetch(`/api/setting/${params.userId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + credentials.token
      }
    })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}


export {create, update, read}