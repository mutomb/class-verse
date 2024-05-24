import queryString from 'querystring';

const create = async (params: { userId: any }, credentials: { token: any }, course: FormData) => {
    try {
        let response = await fetch('/api/courses/by/'+ params.userId, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + credentials.token
          },
          body: course
        })
          return response.json()
        } catch(err) { 
          console.log(err)
        }
  }
  
  const list = async (params: any, signal: AbortSignal) => {
    let query={}
    if(params) query = queryString.stringify(params)
    try {
      let response = await fetch('/api/courses/published?'+query, {
        method: 'GET',
        signal: signal,
        headers: {
          'Accept': 'application/json',
        }
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
  }

  const listCategories = async (signal: AbortSignal) => {
    try {
      let response = await fetch('/api/courses/categories', {
        method: 'GET',
        signal: signal
      })
      return response.json()
    } catch(err) {
      console.log(err)
    }
  }

  const listCurrencies = async (signal: AbortSignal) => {
    try {
      let response = await fetch('/api/courses/currencies', {
        method: 'GET',
        signal: signal
      })
      return response.json()
    } catch(err) {
      console.log(err)
    }
  }

  const read = async (params: { courseId: any }, signal: AbortSignal) => {
    try {
      let response = await fetch('/api/courses/' + params.courseId, {
        method: 'GET',
        signal: signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
  }
  
  const update = async (params: { courseId: any }, credentials: { token: any }, course: FormData) => {
    try {
      let response = await fetch('/api/courses/' + params.courseId, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + credentials.token
        },
        body: course
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
  }
  
  const remove = async (params: { courseId: any }, credentials: { token: any }) => {
    try {
      let response = await fetch('/api/courses/' + params.courseId, {
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

  const listByTeacher = async (params: { userId: any }, credentials: { token: any }, signal: AbortSignal) => {
    try {
      let response = await fetch('/api/courses/by/'+params.userId, {
        method: 'GET',
        signal: signal,
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + credentials.token
        }
      })
      return response.json()
    } catch(err){
      console.log(err)
    }
  }

  const newLesson = async (params: { courseId: any }, credentials: { token: any }, lesson: { title: String; content: String; resource_url: String }) => {
    try {
      let response = await fetch('/api/courses/'+params.courseId+'/lesson/new', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.token
        },
        body: JSON.stringify({lesson:lesson})
      })
      return response.json()
    } catch(err){
      console.log(err)
    }
  }

  const listPopular = async (signal: AbortSignal) => {
    try {
      let response = await fetch('/api/courses/popular', {
        method: 'GET',
        signal: signal,
        headers: {
          'Accept': 'application/json',
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

  
  export {
    create,
    list,
    read,
    update,
    remove,
    listByTeacher,
    newLesson,
    listPopular,
    listCategories,
    listCurrencies,
    fetchImage
  }