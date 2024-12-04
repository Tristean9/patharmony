import { http, HttpResponse } from "msw";


export const handlers = [
	http.get("/api/get-map-api", () => {
		return HttpResponse.json({
			AMAP_KEY: "37dd5c21fd9ed2018ae1b97796b0e171",
			AMAP_SECURITY_JS_CODE: "4bffedc3a6694cb3490719e29c24dd71",
		});
    }),
    
];
