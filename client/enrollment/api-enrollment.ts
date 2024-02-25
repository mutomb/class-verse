const create = async (params: { courseId: any }, credentials: { t: any }) => {
    try {
        let response = await fetch('/api/enrollment/new/'+params.courseId, {
          method: 'POST',
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
  
  const listEnrolled = async (credentials: { t: any }, signal: AbortSignal) => {
    try {
      let response = await fetch('/api/enrollment/enrolled', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + credentials.t
        },
        signal: signal,
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
  }

  const enrollmentStats = async (params: { courseId: any }, credentials: { t: any }, signal: AbortSignal) => {
    try {
      let response = await fetch('/api/enrollment/stats/'+params.courseId, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + credentials.t
        },
        signal: signal,
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
  }
  
  const read = async (params: { enrollmentId: any }, credentials: { t: any }, signal: AbortSignal) => {
    try {
      let response = await fetch('/api/enrollment/' + params.enrollmentId, {
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
  
  const complete = async (params: { enrollmentId: any }, credentials: { t: any }, enrollment: {}) => {
    try {
      let response = await fetch('/api/enrollment/complete/' + params.enrollmentId, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        },
        body: JSON.stringify(enrollment)
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
  }
  
  const remove = async (params: { enrollmentId: string }, credentials: { t: string }) => {
    try {
      let response = await fetch('/api/enrollment/' + params.enrollmentId, {
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
  
  export {
    create,
    read,
    complete,
    remove,
    listEnrolled,
    enrollmentStats
  }