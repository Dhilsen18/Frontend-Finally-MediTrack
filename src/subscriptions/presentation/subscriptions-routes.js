const plansSelection = () => import('./views/plans-selection.vue');

const subscriptionsRoutes = [
    {
        path: 'plans',
        name: 'plans',
        component: plansSelection,
        meta: { title: 'Plans' }
    }
];

export default subscriptionsRoutes;