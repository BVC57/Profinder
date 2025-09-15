import axios from 'axios';
export const adminRequestComplated= async (requestId) => {

   const res = await axios.post(`/api/user-requests/admin-requests/${requestId}/complete`);
   return res.data;
}
export const adminRequestPending = async () => {
   const res = await axios.post(`api/user-requests/admin-requests`);
   return res.data;
}