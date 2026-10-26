import { delay } from 'msw';
import { HttpResponse } from 'msw/http';

const statusMap = { 0: 'success', 1: 'info', 2: 'error', 3: 'warning' };
const configuredDelay = Number( import.meta.env.VITE_DEV_MOCK_DELAY );
const responseDelay = Number.isFinite( configuredDelay ) ? Math.max( 0, configuredDelay ) : 0;
/**
 * 接口返回工具
 * @param {number|boolean} status 返回状态
 * @param {string|object|array|null} message 返回信息
 * @param {string|object|array|null} data 返回数据
 * @param {number} code 返回状态码
 * @returns {Promise<HttpResponse>} 接口返回的响应对象
 */
const resource = async ( status, message = null, data = null, code = 200 ) => {
    if ( responseDelay > 0 ) { await delay( responseDelay ); }
    if ( typeof status === 'boolean' ) { status = status ? 0 : 2; }
    const statusText = statusMap[status] || 'unknown';
    if ( data === null && ( message !== null && ( typeof message === 'object' || Array.isArray( message ) ) ) ) {
        data = message;
        message = null;
    }
    return HttpResponse.json({
        status: statusText,
        code: code,
        time: Math.floor( Date.now() / 1000 ),
        message: message,
        data: typeof data !== 'object' && !Array.isArray( data ) ? null : data
    },{ status: code });
};
 const json = async ( status, message = null, data = null, code = 200 ) => {
    if ( responseDelay > 0 ) { await delay( responseDelay ); }
    if ( typeof status === 'boolean' ) { status = status ? 0 : 2; }
    const statusText = statusMap[status] || 'unknown';
    if ( data === null && ( message !== null && ( typeof message === 'object' || Array.isArray( message ) ) ) ) {
        data = message;
        message = null;
    }
    return JSON.stringify({
        status: statusText,
        code: code,
        time: Math.floor( Date.now() / 1000 ),
        message: message,
        data: typeof data !== 'object' && !Array.isArray( data ) ? null : data
    });
};

export { json };
export default resource;