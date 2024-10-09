import axios from 'axios';

import config from '../config';

axios.defaults.baseURL = config.api.base_url;

const importers = {
  list: () => axios.get(`/v2/importers`).then(({ data }) => data.result),
  add: (options) =>
    axios.post(`/v2/importers`, options).then(({ data }) => data.result),
};

export default importers;
