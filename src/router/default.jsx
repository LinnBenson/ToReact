import load from "../support/helpers/router";

const router = [
    { title: 'Debug', path: '/debug', component: load( 'Preview' ), frame: 'paper', auth: ({ app }) => { return app.debug; } }
];

export default router;