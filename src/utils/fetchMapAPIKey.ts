import axios from "axios";

interface FetchMapAPIKeyResult {
    mapAPIKey: string;
    loading: boolean;
    error: string | null;
}

export const fetchMapAPIKey = async (): Promise<FetchMapAPIKeyResult> => {

    let mapAPIKey = "";
    let loading = true;
    let error = null;

    try {
        const response = await axios.get(`/api/session/locationMap`);
        const { apikey } = response.data;
        mapAPIKey = apikey;
    } catch (err) {
        error = (
            axios.isAxiosError(err)
                ? err.response?.data?.error
                : "获取高德地图API秘钥失败"
        );
    } finally {
        loading = false;
    }

    return { mapAPIKey, loading, error };
};
