import { toast } from 'react-toastify';

export const notifySuccess = (status) => {
    status = status || 'Successfully.';
    toast.success(status.toString(), {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
    });
};
