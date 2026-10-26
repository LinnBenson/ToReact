import { memo, Suspense, useEffect, useLayoutEffect, useState, useTransition } from 'react';
import { Route, Routes, useLocation, matchRoutes } from 'react-router';
import useAppContext from '../context/AppContext';
import routes, { frames } from '../../config/router';
import useUnitContext from '../context/UnitContext';
import AccessGuard from './AccessGuard';

const RouterProvider = memo(() => {
    const { debug, app, setTitle } = useAppContext();
    // 自动刷新标题
    const { t } = useUnitContext();
    const location = useLocation();
    // 标题自动切换
    useLayoutEffect(() => {
        const match = matchRoutes( routes, location )?.at( -1 );
        let title = match?.route.title;
        if ( Array.isArray( title ) ) { title = t( ...title ); }
        if ( title && typeof title === 'string' ) {
            setTitle( title );
        }else {
            setTitle( null );
        }
    }, [ location.pathname, setTitle, t ]);
    // 路由切换过渡
    const [ displayedLocation, setDisplayedLocation ] = useState( location );
    const [ isPending, startTransition ] = useTransition();
    useEffect(() => {
        const sameLocation = location.pathname === displayedLocation.pathname && location.search === displayedLocation.search && location.hash === displayedLocation.hash;
        if ( sameLocation ) { return; }
        startTransition(() => { setDisplayedLocation( location ); });
    }, [ location, displayedLocation ]);
    const RouterFallback = app.routerFallback;
    const RouterLoader = app.routerLoader;

    debug( "[RouterProvider] 路由支持组件刷新" );
    return (
        <Suspense fallback={RouterFallback ? <RouterFallback delay={0} /> : null}>
            <Routes location={displayedLocation}>
                {Object.entries( frames ).map(([ frameName, Frame] ) => (
                    <Route key={frameName} element={<Frame isPending={isPending} />}>
                        {routes.filter( route => ( route.frame || 'default' ) === frameName )
                            .map( route => { const { path, component: Component, props = {} } = route;
                            return (
                                <Route key={path} path={path} element={<AccessGuard {...props} router={route} isPending={isPending}><Component {...props} isPending={isPending} /></AccessGuard>}/>
                            );
                        })}
                    </Route>
                ))}
            </Routes>
            {isPending && RouterLoader && <RouterLoader />}
        </Suspense>
    );
});

export default RouterProvider;