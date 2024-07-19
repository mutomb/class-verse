/** Get a list of all private conversations*/
const getConversations = async(credentials: { token: string })=> {
    try {
        let response = await fetch(`/api/messages/conversations/bot`, {
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
const getConversationMessages = async(credentials: { token: string }, params: { userId: string}) => {
    let url = `/api/messages/conversations/${params.userId}`
    try {
        let response = await fetch(url, {
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
const getConversationMessagesAnonymous = async(credentials: { token: string }, params: { userId: string, anonymousId: string}) => {
    let url = `/api/messages/conversations/bot/user/${params.userId}/anonymous/${params.anonymousId}`
    try {
        let response = await fetch(url, {
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
/** send private messages to from anonymous Id to message.to*/
const sendConversationMessageAnonymous = async(message: FormData, params: { anonymousId: string}) => {
    try {
        let response = await fetch(`/api/messages/bot/${params.anonymousId}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body:message
        })
        return response.json()
    } catch(err) { 
        console.log(err)
    }
}
/** send private messages to from req.auth to anonymousId*/
const sendConversationMessage = async(message: FormData) => {
    try {
        let response = await fetch(`/api/messages/bot`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body:message
        })
        return response.json()
    } catch(err) { 
        console.log(err)
    }
}

export {getConversations, getConversationMessages, getConversationMessagesAnonymous, sendConversationMessage,  sendConversationMessageAnonymous}
