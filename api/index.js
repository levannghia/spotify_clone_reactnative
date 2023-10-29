import axios from "axios"
import { encode } from 'base-64';

const getAccessToken = async (code, redirect_uri, spotifyClientId, spotifyClientSecret) => {
    const headers = {
        'Authorization': `Basic ${encode(`${spotifyClientId}:${spotifyClientSecret}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
    };
    const response = await axios.post('https://accounts.spotify.com/api/token', {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirect_uri,
    }, {
        headers:  headers
    })

    const { access_token, refresh_token, expires_in } = response.data;

    // console.log("1: ", access_token);
    // console.log("2: ", refresh_token);
    // console.log("3: ", expires_in);

    return {
        access_token: access_token,
        refresh_token: refresh_token,
        expires_in: expires_in,
    };
}

export {
    getAccessToken,
}