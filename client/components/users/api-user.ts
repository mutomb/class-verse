const create = async (user: FormData ) => {
  try {
      let response = await fetch('/api/users/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: user
      })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}

const createAnonymous = async (user: FormData ) => {
  try {
      let response = await fetch('/api/anonymous', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: user
      })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}
const list = async (signal: AbortSignal, credentials: {token: string}) => {
  try {
    let response = await fetch('/api/users/', {
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
const listByCourse = async (signal: AbortSignal, credentials: {token: string}, params:{courseId: string}) => {
  try {
    let response = await fetch('/api/enrollment/clientsSpecialist/'+params.courseId, {
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
const listAnonymous = async (signal: AbortSignal, credentials: {token: string}) => {
  try {
    let response = await fetch('/api/anonymous', {
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
const listPending = async (signal: AbortSignal, credentials: { token: string },) => {
  try {
    let response = await fetch('/api/users/pending/resume_qualification', {
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
const listSpecialists = async (signal: AbortSignal, credentials: { token: string },) => {
  try {
    let response = await fetch(credentials.token? '/api/users/specialists_auth': '/api/users/specialists', {
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

const listApprovedSpecialists = async (signal: AbortSignal, credentials: { token: string },) => {
  try {
    let response = await fetch(credentials.token? '/api/users/approved/specialists_auth': '/api/users/approved/specialists', {
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
const listClients = async (signal: AbortSignal, credentials: { token: string },) => {
  try {
    let response = await fetch(credentials.token? '/api/users/clients_auth': '/api/users/clients', {
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
const listAdmins = async (signal: AbortSignal, credentials: { token: string },) => {
  try {
    let response = await fetch(credentials.token? '/api/users/admins_auth': '/api/users/admins', {
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
const read = async (params: { userId: string }, credentials: { token: string }, signal: AbortSignal) => {
  try {
    let response = await fetch(credentials.token? '/api/users_auth/' + params.userId:'/api/users/' + params.userId, {
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
const readAnonymous = async (params: { userId: string }, credentials: { token: string }, signal: AbortSignal) => {
  try {
    let response = await fetch('/api/anonymous/' + params.userId, {
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

const update = async (params: { userId: string }, credentials: { token: string }, user: FormData) => {
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

const updateAnonymous = async (params: { anonymousId: string }, anonymous: FormData) => {
  try {
    let response = await fetch('/api/anonymous/' + params.anonymousId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
      },
      body: anonymous
    })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}

const remove = async (params: { userId: string }, credentials: { token: string }) => {
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
const removeAnonymous = async (params: { userId: string }, credentials: { token: string }) => {
  try {
    let response = await fetch('/api/anonymous/' + params.userId, {
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

const fetchImage = async (url: string, credentials: { token: string }, signal: AbortSignal) => {
  try {
    let response = await fetch(url, {
      method: 'GET',
      signal: signal,
      headers: {
        'Authorization': 'Bearer ' + credentials.token
      }
    })
    const isDefault = eval(response.headers.get('defaultPhoto'))
    return {data: await response.blob(), isDefault: isDefault === null? false: isDefault}
  } catch(err) {
      console.log(err)
  }
}

const createCookie = async (params: { userId: string }, credentials: { token: string }, signal: AbortSignal) => {
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

const stripeUpdate = async (params: { userId: string }, credentials: { token: string }, sellerData: FormData, signal: AbortSignal) => {
  try {
    let response = await fetch ('/api/stripe_auth/'+params.userId, {
      method: 'PUT',
      signal: signal,
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + credentials.token
      },
      body: sellerData
    })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}

export {
  create, createAnonymous,
  list,
  listByCourse,
  listPending,
  listApprovedSpecialists,
  listSpecialists,
  listClients,
  listAdmins,
  listAnonymous,
  read,
  readAnonymous,
  update, updateAnonymous,
  remove,
  removeAnonymous,
  fetchImage,
  createCookie,
  stripeUpdate
}