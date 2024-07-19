const create = async (params, credentials, order, token) => {
  try {
    let response = await fetch('/api/orders/'+params.userId, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.token
        },
        body: JSON.stringify({order: order, token:token})
      })
      return response.json()
    }catch(err) {
      console.log(err)
    }
}

const listBySpecialist = async (params, credentials, signal) => {
  try {
    let response = await fetch('/api/orders/specialist/'+params.userId, {
      method: 'GET',
      signal: signal,
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + credentials.token
      }
    })
    return response.json()
  }catch(err){
    console.log(err)
  }
}

const update = async (params, credentials, course) => {
  try {
    let response = await fetch('/api/order/status/' + params.userId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.token
      },
      body: JSON.stringify(course)
    })
    return response.json()
  } catch(err){
    console.log(err)
  }
}

const cancelCourse = async (params, credentials, course) => {
  try {
    let response = await fetch('/api/order/'+params.userId+'/cancel/'+params.courseId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.token
      },
      body: JSON.stringify(course)
    })
    return response.json()
  }catch(err){
    console.log(err)
  }
}

const processCharge = async (params, credentials, course) => {
  try {
    let response = await fetch('/api/order/'+params.orderId+'/charge/'+params.userId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.token
      },
      body: JSON.stringify(course)
    })
    return response.json()
  } catch(err) {
    console.log(err)
  }
}

const getStatusValues = async (signal, credentials) => {
  try {
    let response = await fetch('/api/order/status_values', {
      method: 'GET',
      signal: signal,
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + credentials.token
      }
    })
    return response.json()
  }catch(err) { 
    console.log(err)
  }
}

const listByUser = async (params, credentials, signal) => {
  try {
    let response = await fetch('/api/orders/user/'+params.userId, {
      method: 'GET',
      signal: signal,
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + credentials.token
      }
    })
    return response.json()
  }catch(err) {
    console.log(err)
  }
}

const read = async (params, credentials, signal) => {
  try {
    let response = await fetch('/api/order/' + params.orderId, {
      method: 'GET',
      signal: signal,
      headers:{ 
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + credentials.token
      }
    })
    return response.json()
  } catch(err) {
    console.log(err)
  }
}

export {
  create,
  listBySpecialist,
  update,
  cancelCourse,
  processCharge,
  getStatusValues,
  listByUser,
  read
}
