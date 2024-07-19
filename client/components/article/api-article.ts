const create = async (params:{userId: string}, credentials:{token: string}, article: FormData) => {
  try {
    let response = await fetch('/api/article/new/'+ params.userId, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + credentials.token
    },
    body: article
  })    
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}

const read = async (params, signal) => {
  try {
    let response = await fetch('/api/article/' + params.articleId, {
    method: 'GET',
    signal: signal
  })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}

const update = async (params, credentials, article) => {
  try {
    let response = await fetch('/api/article/' + params.articleId, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + credentials.token
    },
    body: article
    })    
    return await response.json()
    } catch(err) {
      console.log(err)
    }
}

const remove = async (params: { articleId: string }, credentials: { token: string }) => {
  try {
    let response = await fetch('/api/article/' + params.articleId, {
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

const removeBulk = async (params:{deleteArticleIds: string[]}, credentials:{token: string}) => {
  let deletePromises = params.deleteArticleIds.map(articleId=> fetch('/api/article/' + articleId, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + credentials.token
    }
  }).then(response => response.json()))
  try {
    let response = await Promise.allSettled(deletePromises)    
    return response
  } catch(err) {
    console.log(err)
  }
}


export {
  create,
  read,
  update,
  remove,
  removeBulk,
}
