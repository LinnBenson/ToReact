import { createContext, useContext } from 'react';

/**
 * 应用核心上下文
 */
const AppContext = createContext( null );
const useAppContext = () => { return useContext( AppContext ); }

export { AppContext };
export default useAppContext;
