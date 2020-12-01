import Axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';

import { Client } from '../src/scratch/client';

export class ClientFake extends Client {
  constructor() {
    const axios = Axios.create();
    const mock = new AxiosMockAdapter(axios);
    mock.onAny().reply(500, 'External HTTP connections disabled');

    super(axios);
  }
}
