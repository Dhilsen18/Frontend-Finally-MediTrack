const viewDevices = () => import('./views/view-devices.vue');

const monitoringRoutes = [
    {
        path: 'devices',
        name: 'devices',
        component: viewDevices,
        meta: { title: 'Devices' }
    }
];

export default monitoringRoutes;