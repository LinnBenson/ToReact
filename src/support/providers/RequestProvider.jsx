import axios from "axios";
import common from "../helpers/common";
import { data } from "react-router";

/**
 * 请求提供者
 */
class RequestProvider {
    constructor({ list, getHeader, getMiddleware }) {
        this.list = list;
        this.getHeader = getHeader;
        this.getMiddleware = getMiddleware;
        this.client = axios.create();
    }
    /**
     * 构建请求工具
     * @param {string} url 请求的URL
     * @returns 请求工具
     */
    build( url ) {
        if ( !url || typeof url !== 'string' ) { throw new Error( 'URL is required' ); }
        // 生成默认配置
        let config = {
            url: url,
            header: this.getHeader(),
            method: 'GET',
            data: {},
            timeout: 15000,
            join: {}
        };
        // 合并自定义配置
        if ( !common.empty( this.list[url] ) && typeof this.list[url] === 'object' ) {
            config = { ...config, ...this.list[url] };
        }
        return new RequestBuildProvider( this.client, config, this.getMiddleware );
    }
}
/**
 * 请求构建工具
 */
class RequestBuildProvider {
    constructor( client, config, middleware ) {
        this.client = client;
        this.url = config.url ?? null;
        if ( typeof config.url !== 'string' ) { throw new Error( 'URL must be a string' ); }
        this.header_v = !common.empty( config.header ) && typeof config.header === 'object' ? config.header : {};
        this.method_v = !common.empty( config.method ) && typeof config.method === 'string' ? ( config.method ).toUpperCase() : 'GET';
        this.data_v = !common.empty( config.data ) && typeof config.data === 'object' ? config.data : {};
        this.timeout_v = typeof config.timeout === 'number' ? config.timeout : 15000;
        this.join_v = !common.empty( config.join ) && typeof config.join === 'object' ? config.join : {};
        this.middleware_v = !common.empty( middleware ) && typeof middleware === 'function' ? middleware() : null;
        this.success_v = null;
        this.error_v = null;
        this.loading_v = null;
    }
    // 设置请求头
    header( data ) {
        if ( !common.empty( data ) && typeof data === 'object' ) { this.header_v = { ...this.header_v, ...data }; }
        return this;
    }
    // 设置请求超时时间
    timeout( data ) {
        if ( typeof data === 'number' ) { this.timeout_v = data; }
        return this;
    }
    // 设置请求体
    data( data ) {
        if ( data === undefined ) { return this; }
        const currentIsObject = Object.prototype.toString.call( this.data_v ) === '[object Object]';
        const dataIsObject = Object.prototype.toString.call( data ) === '[object Object]';
        if ( currentIsObject && dataIsObject ) {
            this.data_v = {
                ...this.data_v,
                ...data
            };
        } else {
            this.data_v = data;
        }
        return this;
    }
    // 设置请求参数
    join( data ) {
        if ( !common.empty( data ) && typeof data === 'object' ) { this.join_v = { ...this.join_v, ...data }; }
        return this;
    }
    // 设置处理中间件
    middleware( callback = null ) {
        if ( ( !common.empty( callback ) && typeof callback === 'function' ) || callback === null ) { this.middleware_v = callback; }
        return this;
    }
    // 设置请求成功回调
    success( callback = null ) {
        if ( ( !common.empty( callback ) && typeof callback === 'function' ) || callback === null ) { this.success_v = callback; }
        return this;
    }
    // 设置请求失败回调
    error( callback = null ) {
        if ( ( !common.empty( callback ) && typeof callback === 'function' ) || callback === null ) { this.error_v = callback; }
        return this;
    }
    // 设置请求加载回调
    loading( callback = null ) {
        if ( ( !common.empty( callback ) && typeof callback === 'function' ) || callback === null ) { this.loading_v = callback; }
        return this;
    }
    // 执行正式请求
    post() { return this.send( 'POST' ); }
    get() { return this.send( 'GET' ); }
    put() { return this.send( 'PUT' ); }
    delete() { return this.send( 'DELETE' ); }
    patch() { return this.send( 'PATCH' ); }
    options() { return this.send( 'OPTIONS' ); }
    head() { return this.send( 'HEAD' ); }
    async send( method = null ) {
        if ( method && typeof method === 'string' ) { this.method_v = method.toUpperCase(); }
        try {
            // 标记开始请求
            if ( this.loading_v && typeof this.loading_v === 'function' ) { this.loading_v( true ); }
            const config = {
                ...this.join_v,
                url: this.url,
                headers: this.header_v,
                method: this.method_v,
                timeout: this.timeout_v
            };
            // GET 和 HEAD 使用查询参数，其余请求使用请求体
            if ( [ 'GET', 'HEAD' ].includes( this.method_v ) ) {
                config.params = this.data_v;
            }else {
                config.data = this.data_v;
            }
            const response = await this.client.request( config );
            let resource = common.is_json( response.data ) ? JSON.parse( response.data ) : response.data;
            if ( this.middleware_v ) {
                resource = await this.middleware_v({
                    ref: this,
                    response,
                    resource
                });
                if ( resource === false ) { return; }
            }
            if ( this.success_v ) { await this.success_v( resource ); }
            return resource;
        }catch ( error ) {
            if ( axios.isAxiosError( error ) && error.response ) {
                const responseData = error.response.data;
                if ( ( common.is_json( responseData ) || ( responseData !== null && typeof responseData === 'object' ) ) ) {
                    let resource = common.is_json( responseData ) ? JSON.parse( responseData ) : responseData;
                    if ( this.middleware_v ) {
                        resource = await this.middleware_v({
                            ref: this,
                            response: error.response,
                            resource
                        });
                        if ( resource === false ) { return; }
                    }
                    if ( this.success_v ) { await this.success_v( resource ); }
                    return resource;
                }
            }
            if ( this.error_v ) {
                await this.error_v( error );
                return;
            }
            throw error;
        }finally {
            if ( this.loading_v && typeof this.loading_v === 'function' ) { this.loading_v( false ); }
        }
    }
}

/**
 * 默认请求头构造器
 */
const buildHeaderMethod = ({ rid, locale, user }) => {
    const headers = {
        'X-RID': rid,
        'X-LOCALE': locale
    };
    if ( user && user.token ) { headers['Authorization'] = `Bearer ${user.token}`; }
    return headers;
};
/**
 * 默认中间件构造器
 */
const buildMiddlewareMethod = ({ toast, user, setUser }) => {
    return ({ ref, response, resource }) => {
        if ( typeof resource !== 'object' || resource === null || common.empty( resource.status ) ) {
            toast( ['error.data'], 'error' );
            return false;
        }
        if ( user && ( response.status === 401 || resource.code === 401 ) ) {
            toast( ['error.401'], 'info' );
            setUser( null );
        }
        const messageToast = ( message, type = 'error' ) => {
            if ( Array.isArray( message ) ) {
                message.forEach( msg => toast( msg, type ) );
            }else if ( typeof message === 'string' ) {
                toast( message, type );
            }else {
                return false;
            }
        };
        switch ( resource.status ) {
            case 'success':
                return resource;
            case 'info':
                messageToast( resource.message, 'info' );
                return false;
            case 'error':
                messageToast( resource.message, 'error' );
                return false;
            case 'warning':
                messageToast( resource.message, 'warning' );
                return false;

            default:
                toast( ['error.data'], 'error' );
                return false;
        }
    };
};

export { buildHeaderMethod, buildMiddlewareMethod };
export default RequestProvider;