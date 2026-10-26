import { http } from 'msw/http';
import resource from '../resource';
import { themes } from '../../config/theme';
import user, { token } from '../user';

const handlers = [
    http.get( '/api/index', ({ request }) => {
        const authorization = request.headers.get( 'Authorization' );
        return resource( 0, {
            system: {
                name: import.meta.env.VITE_APP_NAME,
                debug: import.meta.env.VITE_APP_DEBUG === 'true',
                timezone: import.meta.env.VITE_APP_TIMEZONE,
                copyright: import.meta.env.VITE_APP_COPYRIGHT,
            },
            themes: themes,
            user: authorization && authorization === `Bearer ${token}` ? user : null
        });
    }),
];

export default handlers;