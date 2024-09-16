import Dashboards from '~/pages/Dashboards/Dashboards';
import Feeds from '~/pages/Feeds/Feeds';
import MainDashboard from '~/pages/MainDashboard/MainDashboard';
import PublicMainDashboard from '~/pages/MainDashboard/PublicMainDashboard';
import Users from '~/pages/Users/Users';
import ChangeInfo from '~/pages/ChangeInfo/ChangeInfo';
import Error from '~/pages/Error/Error';
import Error401 from '~/pages/Error/Error401';
import SignIn from '~/pages/SignIn/SignIn';
import SignUp from '~/pages/SignUp/SignUp';
// Dont need to login to use those routes
const publicRoutes = [
    { path: '/', component: SignIn },
    { path: '/error', component: Error },
    { path: '/error401', component: Error401 },
    { path: '/login', component: SignIn },
    { path: '/register', component: SignUp },
    { path: '/*', component: Error },
    { path: '/maindashboard/public/:id', component: PublicMainDashboard },
    // { path: '/maindashboard', component: Error },
];

// Must be login to use those route
const privateRoutes = [
    { path: '/dashboard', component: Dashboards },
    { path: '/feeds', component: Feeds },
    { path: '/maindashboard/:id', component: MainDashboard },
    { path: '/users', component: Users },
    { path: '/editinfo', component: ChangeInfo },
];

export { publicRoutes, privateRoutes };
