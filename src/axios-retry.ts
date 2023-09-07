import axios from "axios";
import axiosRetry from "axios-retry";

axiosRetry(axios);

export default axios;
