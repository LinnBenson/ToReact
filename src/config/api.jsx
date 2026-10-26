import { buildHeaderMethod, buildMiddlewareMethod } from "../support/providers/RequestProvider";

const buildHeader = buildHeaderMethod;
const buildMiddleware = buildMiddlewareMethod;
const buildList = {
    index: { url: '/api/index', method: 'GET', timeout: 9000 }
};

export { buildHeader, buildMiddleware };
export default buildList;