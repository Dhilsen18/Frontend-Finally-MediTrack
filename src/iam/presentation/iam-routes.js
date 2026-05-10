/**
 * Route definitions for the IAM bounded context.
 * All paths are relative to the `/iam` parent route.
 *
 * @type {import('vue-router').RouteRecordRaw[]}
 */

const profile = () => import('./views/profile.vue');

const iamRoutes = [
    {
        path: 'profile',
        name: 'profile',
        component: profile,
        meta: { title: 'Profile' }
    }
];

export default iamRoutes;