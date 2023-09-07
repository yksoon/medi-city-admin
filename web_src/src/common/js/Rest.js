import { Instance, Instance_multi } from "./Instance";

const RestServer = (method, url, data) => {
    switch (method) {
        case "get":
            return Instance.get(url, data);

        case "post":
            return Instance.post(url, data);

        case "put":
            return Instance.put(url, data);

        case "delete":
            return Instance.delete(url, data);

        case "post_multi":
            return Instance_multi.post(url, data);

        case "put_multi":
            return Instance_multi.put(url, data);
        default:
            break;
    }
};

export { RestServer };
