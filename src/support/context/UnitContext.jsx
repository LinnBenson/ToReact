import { createContext, useContext } from 'react';

/**
 * 应用组件上下文
 */
const UnitContext = createContext( null );
const useUnitContext = () => { return useContext( UnitContext ); }

export { UnitContext };
export default useUnitContext;