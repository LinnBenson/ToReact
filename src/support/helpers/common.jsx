const common = {
    /**
     * 判断字符串是否为 JSON
     * 判断传入值是否为合法的 JSON 对象或 JSON 数组字符串。
     * @param {unknown} value 待判断的值
     * @returns {boolean} 是否为合法 JSON 字符串
     */
    is_json: ( value ) => {
        if ( typeof value !== 'string' ) { return false; }
        const content = value.trim();
        if ( content === '' || !['{', '['].includes( content[0] ) ) { return false; }
        try {
            JSON.parse( content );
            return true;
        }catch ( error ) {
            return false;
        }
    },
    /**
     * 判断值是否为空
     * 支持空字符串、零值、布尔值、数组、普通对象、Map 及 Set。
     * @param {unknown} value 待判断的值
     * @returns {boolean} 是否为空
     */
    empty: ( value ) => {
        if ( value === undefined || value === null || value === false ) { return true; }
        if ( value === 0 || value === 0n || value === '' || value === '0' ) { return true; }
        if ( Array.isArray( value ) ) { return value.length === 0; }
        if ( value instanceof Map || value instanceof Set ) { return value.size === 0; }
        if ( Object.prototype.toString.call( value ) === '[object Object]' ) {
            return Object.keys( value ).length === 0;
        }
        return false;
    },
    /**
     * 生成 UUID
     * 优先使用浏览器原生 UUID 方法，否则生成符合 RFC 4122 格式的 UUID v4。
     * @returns {string} UUID 字符串
     */
    uuid: () => {
        if ( typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function' ) {
            return crypto.randomUUID();
        }
        const bytes = new Uint8Array( 16 );
        if ( typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function' ) {
            crypto.getRandomValues( bytes );
        }else {
            for ( let index = 0; index < bytes.length; index++ ) {
                bytes[index] = Math.floor( Math.random() * 256 );
            }
        }
        bytes[6] = ( bytes[6] & 0x0f ) | 0x40;
        bytes[8] = ( bytes[8] & 0x3f ) | 0x80;
        const value = Array.from( bytes, ( byte ) => byte.toString( 16 ).padStart( 2, '0' ) ).join( '' );
        return `${value.slice( 0, 8 )}-${value.slice( 8, 12 )}-${value.slice( 12, 16 )}-${value.slice( 16, 20 )}-${value.slice( 20 )}`;
    },
    /**
     * 判断字符串是否为 UUID
     * 判断传入值是否符合标准的 8-4-4-4-12 UUID 格式。
     * @param {unknown} value 待判断的值
     * @returns {boolean} 是否为 UUID 字符串
     */
    is_uuid: ( value ) => {
        if ( typeof value !== 'string' ) { return false; }
        return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test( value );
    },
    /**
     * 判断新值是否符合类型规则且存在内容变化。
     * 数组和对象在任意层级均不允许改变主类型。
     * 允许新增字段；严格模式禁止删除字段，并检查共有字段的类型。
     * 任意层级允许从 null/undefined 初始化，非空值禁止改为 null/undefined。
     * @param {mixed} oldValue 旧值
     * @param {mixed} newValue 新值
     * @param {boolean} compareTypes 是否严格比较普通值的类型，默认 true
     * @returns {boolean} 是否允许更新
     */
    allowUpdate: ( oldValue, newValue, compareTypes = true ) => {
        const getType = value => (
            value === null ? 'null' : Array.isArray( value ) ? 'array' : typeof value
        );
        // 分开记录类型合法性与内容差异，避免一处变化掩盖其他字段的类型冲突。
        const compare = ( oldItem, newItem ) => {
            if ( Object.is( oldItem, newItem ) ) {
                return { allowed: true, changed: false };
            }
            if ( oldItem === null || oldItem === undefined ) {
                return { allowed: true, changed: true };
            }
            if ( newItem === null || newItem === undefined ) {
                return { allowed: false, changed: true };
            }
            const oldType = getType( oldItem );
            const newType = getType( newItem );
            const oldIsContainer = oldType === 'array' || oldType === 'object';
            const newIsContainer = newType === 'array' || newType === 'object';
            if ( oldType !== newType ) {
                return {
                    allowed: !compareTypes && !oldIsContainer && !newIsContainer,
                    changed: true
                };
            }
            if ( !oldIsContainer ) {
                return { allowed: true, changed: true };
            }
            const oldKeys = Object.keys( oldItem );
            const newKeys = Object.keys( newItem );
            if ( compareTypes && (
                oldKeys.some( key => !Object.hasOwn( newItem, key ) ) ||
                ( oldType === 'array' && newItem.length < oldItem.length )
            ) ) {
                return { allowed: false, changed: true };
            }
            let changed = oldKeys.length !== newKeys.length || (
                oldType === 'array' && oldItem.length !== newItem.length
            );
            for ( const key of newKeys ) {
                if ( !Object.hasOwn( oldItem, key ) ) {
                    changed = true;
                    continue;
                }
                const result = compare( oldItem[key], newItem[key] );
                if ( !result.allowed ) { return { allowed: false, changed: true }; }
                changed = changed || result.changed;
            }
            return { allowed: true, changed };
        };
        const result = compare( oldValue, newValue );
        return result.allowed && result.changed;
    },
    /**
     * 深度比较两个值是否相同
     * 对象键顺序不影响比较结果，不支持循环引用。
     * @param {unknown} left 第一个值
     * @param {unknown} right 第二个值
     * @returns {boolean} 是否完全相同
     */
    isEqual: ( left, right ) => {
        if ( Object.is( left, right ) ) { return true; }
        if ( left === null || right === null ) { return false; }
        if ( typeof left !== 'object' || typeof right !== 'object' ) { return false; }
        const leftIsArray = Array.isArray( left );
        const rightIsArray = Array.isArray( right );
        if ( leftIsArray !== rightIsArray ) { return false; }
        const leftKeys = Object.keys( left );
        const rightKeys = Object.keys( right );
        if ( leftKeys.length !== rightKeys.length ) { return false; }
        return leftKeys.every( key => (
            Object.hasOwn( right, key ) &&
            common.isEqual( left[key], right[key] )
        ));
    },
    /**
     * 转换并格式化时间
     * 无时区时间按指定时区解析，结果使用设备时区；无法获取设备时区时使用指定时区。
     * 支持年月日使用短横线或点号、缺省的时分秒、10 位秒级时间戳及 UTC ISO 时间。
     * @param {string|number|null} time 待转换时间，null 表示当前时间
     * @param {string} format 返回格式
     * @param {string} timezone 无时区时间的解析时区及设备时区不可用时的回退时区
     * @returns {string|null} 格式化时间，输入或时区无效时返回 null
     */
    datetime: ( time = null, format = 'YYYY.MM.DD HH:mm:ss', timezone = 'Asia/Singapore' ) => {
        if ( typeof format !== 'string' || format === '' ) { return null; }
        if ( typeof timezone !== 'string' || timezone.trim() === '' ) { return null; }
        timezone = timezone.trim();
        try {
            new Intl.DateTimeFormat( 'en', { timeZone: timezone } );
        }catch { return null; }
        let deviceTimezone = timezone;
        try {
            const resolvedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            if ( typeof resolvedTimezone === 'string' && resolvedTimezone !== '' ) {
                new Intl.DateTimeFormat( 'en', { timeZone: resolvedTimezone } );
                deviceTimezone = resolvedTimezone;
            }
        }catch { deviceTimezone = timezone; }
        let date = null;
        if ( time === null ) {
            date = new Date();
        }else if (
            ( typeof time === 'string' || typeof time === 'number' ) &&
            /^\d{10}$/.test( String( time ) )
        ) {
            date = new Date( Number( time ) * 1000 );
        }else if (
            typeof time === 'string' &&
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test( time.trim() )
        ) {
            date = new Date( time.trim() );
        }else if ( typeof time === 'string' ) {
            const matched = time.trim().match(
                /^(\d{4})([-.])(\d{2})\2(\d{2})(?: (\d{2})(?::(\d{2})(?::(\d{2}))?)?)?$/
            );
            if ( !matched ) { return null; }
            const year = Number( matched[1] );
            const month = Number( matched[3] );
            const day = Number( matched[4] );
            const hour = Number( matched[5] ?? 0 );
            const minute = Number( matched[6] ?? 0 );
            const second = Number( matched[7] ?? 0 );
            const wallDate = new Date( 0 );
            wallDate.setUTCFullYear( year, month - 1, day );
            wallDate.setUTCHours( hour, minute, second, 0 );
            if (
                wallDate.getUTCFullYear() !== year ||
                wallDate.getUTCMonth() !== month - 1 ||
                wallDate.getUTCDate() !== day ||
                wallDate.getUTCHours() !== hour ||
                wallDate.getUTCMinutes() !== minute ||
                wallDate.getUTCSeconds() !== second
            ) { return null; }
            let timezoneFormatter;
            try {
                timezoneFormatter = new Intl.DateTimeFormat(
                    'en-CA-u-ca-gregory-nu-latn',
                    {
                        timeZone: timezone,
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hourCycle: 'h23'
                    }
                );
            }catch { return null; }
            const wallTimestamp = wallDate.getTime();
            let timestamp = wallTimestamp;
            for ( let attempt = 0; attempt < 4; attempt++ ) {
                const parts = timezoneFormatter.formatToParts( new Date( timestamp ) );
                const values = {};
                for ( const part of parts ) {
                    if ( part.type !== 'literal' ) { values[part.type] = part.value; }
                }
                const zonedTimestamp = Date.UTC(
                    Number( values.year ),
                    Number( values.month ) - 1,
                    Number( values.day ),
                    Number( values.hour ),
                    Number( values.minute ),
                    Number( values.second )
                );
                const difference = wallTimestamp - zonedTimestamp;
                if ( difference === 0 ) { break; }
                timestamp += difference;
            }
            const verifiedParts = timezoneFormatter.formatToParts( new Date( timestamp ) );
            const verified = {};
            for ( const part of verifiedParts ) {
                if ( part.type !== 'literal' ) { verified[part.type] = Number( part.value ); }
            }
            if (
                verified.year !== year ||
                verified.month !== month ||
                verified.day !== day ||
                verified.hour !== hour ||
                verified.minute !== minute ||
                verified.second !== second
            ) { return null; }
            date = new Date( timestamp );
        }else { return null; }
        if ( !date || Number.isNaN( date.getTime() ) ) { return null; }
        let outputFormatter;
        try {
            outputFormatter = new Intl.DateTimeFormat(
                'en-CA-u-ca-gregory-nu-latn',
                {
                    timeZone: deviceTimezone,
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hourCycle: 'h23'
                }
            );
        }catch { return null; }
        const outputParts = outputFormatter.formatToParts( date );
        const output = {};
        for ( const part of outputParts ) {
            if ( part.type !== 'literal' ) { output[part.type] = part.value; }
        }
        const values = {
            YYYY: output.year,
            MM: output.month,
            DD: output.day,
            HH: output.hour,
            mm: output.minute,
            ss: output.second
        };
        return format.replace( /YYYY|MM|DD|HH|mm|ss/g, token => values[token] );
    },
};
const storage = {
    /**
     * 获取本地存储数据
     * 读取并还原通过 set 保存的数据，存储不可用或键不存在时返回默认值。
     * @param {string} key 存储键名
     * @param {unknown} defaultValue 键不存在时返回的默认值
     * @returns {unknown} 已保存的数据或默认值
     */
    get: ( key, defaultValue = null ) => {
        if ( typeof key !== 'string' || key === '' ) { return defaultValue; }
        let value = null;
        try {
            value = localStorage.getItem( key );
        }catch ( error ) {
            return defaultValue;
        }
        if ( value === null ) { return defaultValue; }
        const prefix = '__core_json__:';
        if ( value.startsWith( prefix ) ) {
            try {
                return JSON.parse( value.slice( prefix.length ) );
            }catch ( error ) {
                return defaultValue;
            }
        }
        // 兼容此前直接保存的 JSON 对象和数组。
        if ( common.is_json( value ) ) {
            try {
                return JSON.parse( value );
            }catch ( error ) {
                return defaultValue;
            }
        }
        return value;
    },
    /**
     * 保存本地存储数据
     * 字符串保持原值，其他可序列化值使用带标识的 JSON 保存。
     * @param {string} key 存储键名
     * @param {unknown} value 待保存的数据
     * @returns {boolean} 是否成功写入持久化存储
     */
    set: ( key, value ) => {
        if ( typeof key !== 'string' || key === '' ) { return false; }
        if ( ['undefined', 'function', 'symbol'].includes( typeof value ) ) { return false; }
        let storageValue = value;
        try {
            if ( typeof value !== 'string' ) {
                storageValue = `__core_json__:${JSON.stringify( value )}`;
            }
        }catch ( error ) {
            return false;
        }
        try {
            localStorage.setItem( key, storageValue );
            return true;
        }catch ( error ) {
            return false;
        }
    },
    /**
     * 删除本地存储数据
     * 根据键名清除对应的持久化存储数据。
     * @param {string} key 存储键名
     * @returns {boolean} 是否成功从持久化存储删除
     */
    remove: ( key ) => {
        if ( typeof key !== 'string' || key === '' ) { return false; }
        try {
            localStorage.removeItem( key );
            return true;
        }catch ( error ) {
            return false;
        }
    }
};

export { storage };
export default common;
