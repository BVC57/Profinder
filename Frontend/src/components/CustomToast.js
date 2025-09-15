import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const toastOptions = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

export const showSuccessToast = (message) => {
  toast.success(message, {
    ...toastOptions,
    style: { background: '#4caf50', color: '#fff' },
  });
};

export const showWarningToast = (message) => {
  toast.warn(message, {
    ...toastOptions,
    style: { background: '#ff9800', color: '#fff' },
  });
};

export const showErrorToast = (message) => {
  toast.error(message, {
    ...toastOptions,
    style: { background: '#f44336', color: '#fff' },
  });
}; 