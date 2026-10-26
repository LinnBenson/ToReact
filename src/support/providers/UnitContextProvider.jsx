import { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UnitContext } from '../context/UnitContext';
import useAppContext from '../context/AppContext';
import common from '../helpers/common';
import RequestProvider from './RequestProvider';
import buildList, { buildHeader, buildMiddleware } from '../../config/api';
import { UnitViewToast, UnitViewLoader } from '../components/UnitView';
import copyToClipboard from 'copy-to-clipboard';
import UnitModal from '../components/UnitModal';

/**
 * 应用组件上下文
 */
const UnitContextProvider = ({ children }) => {
    const { app, user, setUser, rid, locale } = useAppContext();
    const { t } = useTranslation();
    /**
     * 全屏加载组件
     */
    const [ loaderVisible, setLoaderVisible ] = useState( false );
    const loaderTimerRef = useRef( null );
    const loader = useCallback(( visible, timeout = 0 ) => {
        if ( typeof visible !== 'boolean' ) { return false; }
        if ( loaderTimerRef.current !== null ) {
            clearTimeout( loaderTimerRef.current );
            loaderTimerRef.current = null;
        }
        setLoaderVisible( visible );
        if (
            visible
            && Number.isFinite( timeout )
            && timeout > 0
        ) {
            loaderTimerRef.current = setTimeout(() => {
                setLoaderVisible( false );
                loaderTimerRef.current = null;
            }, timeout);
        }
        return true;
    }, [ setLoaderVisible ]);
    /**
     * Toast 通知组件
     */
    const [ toastData, setToastData ] = useState([]);
    const removeToast = useCallback(( id ) => {
        setToastData(( previous ) => { return previous.filter( item => item.id !== id ); });
    }, [ setToastData ]);
    const toast = useCallback(( content, status = 'info', timeout = 6000 ) => {
        const allow = [ 'info', 'success', 'error', 'warning' ].includes( status );
        if ( !allow ) { return false; }
        const duration = typeof timeout === 'number' && timeout >= 0 ? timeout : 15000;
        const id = common.uuid();
        if ( Array.isArray( content ) && content.length <= 2 && typeof content[0] === 'string' ) {
            content = t( ...content );
        }
        const item = { id, content, status, timeout: duration };
        setToastData(( previous ) => { return [ ...previous, item ].slice( -4 ); });
        return id;
    }, [ setToastData, t ]);
    /**
     * 弹窗组件
     */
    const [ modalData, setModalData ] = useState([]);
    const removeModal = useCallback(( id ) => {
        setModalData(( previous ) => {
            return previous.map(( item ) => {
                if ( item.id !== id ) { return item; }
                return { ...item, closing: true };
            });
        });
    }, [ setModalData ]);
    const completeRemoveModal = useCallback(( id ) => {
        setModalData(( previous ) => { return previous.filter(( item ) => item.id !== id); });
    }, [ setModalData ]);
    const modal = useCallback(( config = {} ) => {
        const id = config.id ?? common.uuid();
        const item = {
            id: id,
            title: typeof config.title === 'string' ? config.title : '',
            content: config.content ?? '',
            icon: config.icon ?? null,
            close: typeof config.close === 'boolean' ? config.close : true,
            mask: typeof config.mask === 'boolean' ? config.mask : true,
            width: typeof config.width === 'string' ? config.width : '640px'
        };
        item.buttons = Array.isArray( config.buttons ) ? config.buttons : [];
        setModalData(( previous ) => {
            const filtered = previous.filter(( current ) => current.id !== id);
            return [ ...filtered, item ];
        });
        return id;
    }, [ setModalData, t ]);
    /**
     * 时间转换器
     */
    const datetime = useCallback(( time = null, format = 'YYYY.MM.DD HH:mm:ss' ) => {
        return common.datetime( time, format, app.timezone );
    }, [ app.timezone ]);
    /**
     * 网络请求工具
     */
    const request = useMemo( () => {
        return new RequestProvider({
            list: buildList,
            getHeader: () => { return buildHeader({ user, rid, locale }); },
            getMiddleware: () => { return buildMiddleware({ toast, user, setUser }); }
        });
    }, [ user, rid, locale, toast, user, setUser ]);
    /**
     * 点击复制组件
     */
    const copy = useCallback(async ( content ) => {
        const copied = await copyToClipboard( content );
        if ( copied ) {
            toast( `${t( 'copy' )}${t( 'true' )}`, 'success' );
            return true;
        }
        toast( `${t( 'copy' )}${t( 'false' )}`, 'error' );
        return false;
    }, [ toast, t ]);

    return (
        <UnitContext value={{ t, toast, datetime, request, loader, copy, modal, removeModal }}>
            <div id="UnitView">
                <UnitModal modalData={modalData} removeModal={removeModal} completeRemoveModal={completeRemoveModal} />
                <UnitViewLoader loaderVisible={loaderVisible} />
                <UnitViewToast toastData={toastData} removeToast={removeToast} />
            </div>
            {children}
        </UnitContext>
    );
};

export default UnitContextProvider;