import axios
 from "axios";
export const getJWT = async (hostname, username, password) => {
    
        let request = {
            url: `https://${hostname}/wp-json/jwt-auth/v1/token`,
            method: "POST",
            withCredentials: false,
            headers: {
                'Content-Type': 'application/json',
                'Accept': "*/*"
            },
            data: {
                username,
                password
            }
        }

        let response;
        try {
            response = await axios(request);
        } catch (err) {
            console.error(err);
            return false;
        }

        return response.data;
}

export const getTagId = async (hostname, username, password, tagName) => {
   
    let request = {
        url: `https://${hostname}/wp-json/wp/v2/tags`,
        method: "GET",
       
        params: {
           search: tagName
        }
    }

    console.log(request);

    let response;

    try {
        response = await axios(request);
    } catch (err) {
        console.error(err);
        return false;
    }

    console.log(response.data);

    const token  = await getJWT(hostname, username, password);
    if (token === false) return false;

}

export const createPost = async (hostname, username, password, title, content, tagNames = [], status = 'draft') => {
    let token, request, response;

    request = {
        url: `https://${hostname}/wp-json/wp/v2/posts`,
        method: "POST",
        withCredentials: false,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        data: {
            title, content, status
        }
    }

    let tagIds = [];

    if (tagNames.length) {
        for (let i = 0; i < tagNames.length; ++i) {
            const tagId = await getTagId (hostname, username, password, tagNames[i]);
            tagIds.push(tagId);
        }
    }

    return;

    token = await getJWT(hostname, username, password);

    try {
        response = await axios(request);
    } catch (err) {
        console.error(err);
        return false;
    }

    return true;
}