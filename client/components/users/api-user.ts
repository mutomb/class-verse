const create = async (user: { name: String; surname: String; email: String; password: String } ) => {
  try {
      let response = await fetch('/api/users/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}

const list = async (signal: AbortSignal) => {
  try {
    let response = await fetch('/api/users/', {
      method: 'GET',
      signal: signal,
    })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}

const read = async (params: { userId: any; }, credentials: { t: any; }, signal: AbortSignal) => {
  try {
    let response = await fetch('/api/users/' + params.userId, {
      method: 'GET',
      signal: signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      }
    })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}

const update = async (params: { userId: any; }, credentials: { t: any; }, 
  user: FormData) => {
  try {
    let response = await fetch('/api/users/' + params.userId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      },
      body: user
    })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}

const remove = async (params: { userId: any; }, credentials: { t: any; }) => {
  try {
    let response = await fetch('/api/users/' + params.userId, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      }
    })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}

const fetchImage = async (url: string, credentials: { t: any; }, signal: AbortSignal) => {
  try {
    let response = await fetch(url, {
      method: 'GET',
      signal: signal,
      headers: {
        'Authorization': 'Bearer ' + credentials.t
      }
    })
    const isDefault = eval(response.headers.get('defaultphoto'))
    return {data: await response.blob(), isDefault: isDefault === null? false: isDefault}
  } catch(err) {
      console.log(err)
  }
}


export {
  create,
  list,
  read,
  update,
  remove,
  fetchImage
}