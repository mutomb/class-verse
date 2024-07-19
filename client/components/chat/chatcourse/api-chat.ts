/** Get non-private, global messages */
const getGlobalConversationMessages = async (params:{courseId: string}) => {
    try {
        let response = await fetch(`/api/messages/global/course/${params.courseId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        })
        return response.json()
    } catch(err) { 
        console.log(err)
    }
}
const getLastGlobalMessage = async (params:{courseId: string}) => {
    try {
        let response = await fetch(`/api/messages/global/course/${params.courseId}/lastMessage`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        })
        return response.json()
    } catch(err) { 
        console.log(err)
    }
}

/** Send a non-private, global message */
const sendGlobalConversationMessage = async(params:{courseId: string}, credentials: { token: string }, message: FormData)=> {
    try {
        let response = await fetch(`/api/messages/global/course/${params.courseId}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + credentials.token,
            },
            body: message
        })
        return response.json()
    } catch(err) { 
        console.log(err)
    }
}

/** Get a list of all private conversations*/
const getConversations = async(credentials: { token: string }, params: {courseId: string})=> {
    try {
        let response = await fetch(`/api/messages/conversations/course/${params.courseId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + credentials.token
            },
        })
        return response.json()
    } catch(err) { 
        console.log(err)
    }
}

/** get private messages of a specific user conversation, based on to and from id's */
const getConversationMessages = async(userId: string, credentials: { token: string }, params: { courseId: string}) => {
    try {
        let response = await fetch(`/api/messages/conversations/${userId}/course/${params.courseId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + credentials.token
            },
        })
        return response.json()
    } catch(err) { 
        console.log(err)
    }
}
/** send private messages to a specific user conversation, based on to and from id's */
const sendConversationMessage = async(credentials: { token: string }, message: FormData, params: { courseId: string}) => {
    try {
        let response = await fetch(`/api/messages/course/${params.courseId}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + credentials.token,
            },
            body:message
        })
        return response.json()
    } catch(err) { 
        console.log(err)
    }
}

export {getGlobalConversationMessages, getLastGlobalMessage, sendGlobalConversationMessage, getConversations, getConversationMessages, sendConversationMessage}
