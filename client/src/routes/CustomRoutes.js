import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { DefaultLayout } from '~/components/Layout';
import { Fragment } from 'react';
import SignIn from '~/pages/SignIn/SignIn';
import { privateRoutes, publicRoutes } from '~/routes';
const CustomRoutes = () => {
    let { user } = useContext(AuthContext);
    return (
        <Routes>
            {publicRoutes.map((route, index) => {
                const Page = route.component;
                return <Route key={index} path={route.path} element={<Page />} />;
            })}
            {privateRoutes.map((route, index) => {
                let Layout = user ? DefaultLayout : Fragment;
                if (route.layout) Layout = route.layout;
                else if (route.layout === null) Layout = Fragment;
                const Page = user ? route.component : SignIn;
                return (
                    <Route
                        key={index}
                        path={route.path}
                        element={
                            <Layout>
                                <Page />
                            </Layout>
                        }
                    />
                );
            })}
        </Routes>
    );
};

export default CustomRoutes;
