import { toast } from 'react-toastify';

export const notifyError = (error) => {
    error = error || 'Something went wrong.';
    toast.error(error.toString(), {
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
