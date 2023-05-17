import axios
 from "axios";
export const getJWT = async (username, password, hostname = 'delta.pymnts.com') => {
    
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

export const createPost = async (title, content, hostname, token, tags = [], status = 'draft') => {
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

    try {
        response = await axios(request);
    } catch (err) {
        console.error(err);
        return false;
    }

    return true;
}