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

const read = async (params: { userId: any; }, credentials: { token: any; }, signal: AbortSignal) => {
  try {
    let response = await fetch('/api/users/' + params.userId, {
      method: 'GET',
      signal: signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.token
      }
    })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}

const update = async (params: { userId: any; }, credentials: { token: any; }, 
  user: FormData) => {
  try {
    let response = await fetch('/api/users/' + params.userId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + credentials.token
      },
      body: user
    })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}

const remove = async (params: { userId: any; }, credentials: { token: any; }) => {
  try {
    let response = await fetch('/api/users/' + params.userId, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.token
      }
    })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}

const fetchImage = async (url: string, credentials: { token: any; }, signal: AbortSignal) => {
  try {
    let response = await fetch(url, {
      method: 'GET',
      signal: signal,
      headers: {
        'Authorization': 'Bearer ' + credentials.token
      }
    })
    const isDefault = eval(response.headers.get('defaultphoto'))
    return {data: await response.blob(), isDefault: isDefault === null? false: isDefault}
  } catch(err) {
      console.log(err)
  }
}

const createCookie = async (params: { userId: any; }, credentials: { token: any; }, signal: AbortSignal) => {
  try {
    let response = await fetch(`/api/users/${params.userId}/createcookie/`, {
      method: 'GET',
      signal: signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.token
      }
    })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}

const stripeUpdate = async (params, credentials, auth_code, signal) => {
  try {
    let response = await fetch ('/api/stripe_auth/'+params.userId, {
      method: 'PUT',
      signal: signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.token
      },
      body: JSON.stringify({stripe: auth_code})
    })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}

// const checkAuth0Status = async () => {
//   try {
//     let response = await fetch('/oidc/checkAuth0Status/', {
//       method: 'GET',
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json'
//       }
//     })
//     return await response.json()
//   } catch(err) {
//     console.log(err)
//   }
// }


export {
  create,
  list,
  read,
  update,
  remove,
  fetchImage,
  createCookie,
  // checkAuth0Status,
  stripeUpdate
}