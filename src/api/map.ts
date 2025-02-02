import axios from 'axios';

export async function fetchMapAPIKey() {
    try {
        const response = await axios.get('/api/map');
        const {apikey, error} = response.data;
        if (apikey) {
            return {apikey, error: null};
        }
        return {apikey: null, error};
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return {apikey: null, error: errorMessage};
    }
}
