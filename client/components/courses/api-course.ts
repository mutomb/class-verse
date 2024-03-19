const create = async (params: { userId: any }, credentials: { t: any }, course: FormData) => {
    try {
        let response = await fetch('/api/courses/by/'+ params.userId, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + credentials.t
          },
          body: course
        })
          return response.json()
        } catch(err) { 
          console.log(err)
        }
  }
  
  const list = async (signal:AbortSignal) => {
    try {
      let response = await fetch('/api/courses/', {
        method: 'GET',
        signal: signal,
      })
      return await response.json()
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
  
  const update = async (params: { courseId: any }, credentials: { t: any }, course: FormData) => {
    try {
      let response = await fetch('/api/courses/' + params.courseId, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        },
        body: course
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
  }
  
  const remove = async (params: { courseId: any }, credentials: { t: any }) => {
    try {
      let response = await fetch('/api/courses/' + params.courseId, {
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

  const listByTeacher = async (params: { userId: any }, credentials: { t: any }, signal: AbortSignal) => {
    try {
      let response = await fetch('/api/courses/by/'+params.userId, {
        method: 'GET',
        signal: signal,
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        }
      })
      return response.json()
    } catch(err){
      console.log(err)
    }
  }

  const newLesson = async (params: { courseId: any }, credentials: { t: any }, lesson: { title: String; content: String; resource_url: String }) => {
    try {
      let response = await fetch('/api/courses/'+params.courseId+'/lesson/new', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        },
        body: JSON.stringify({lesson:lesson})
      })
      return response.json()
    } catch(err){
      console.log(err)
    }
  }
  const listPublished = async (signal: AbortSignal) => {
    try {
      let response = await fetch('/api/courses/published', {
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
  export {
    create,
    list,
    read,
    update,
    remove,
    listByTeacher,
    newLesson,
    listPublished
  }