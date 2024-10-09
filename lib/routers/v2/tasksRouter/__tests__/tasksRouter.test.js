import request from 'supertest';

describe('routes/tasks', () => {
  const server = request('localhost:4000/v2/tasks');

  it('should get health', async () => {
    const res = await server.get('/healthcheck');
    expect(res.status).toEqual(201);
    expect(res.type).toEqual('application/json');
    expect(res.body.reason).toEqual('SERVER_SUCCESS');
  });

  it('should list all supported tasks', async () => {
    const res = await server.get('/');
    expect(res.status).toEqual(201);
    expect(res.type).toEqual('application/json');
    expect(res.body.reason).toEqual('ASSETS_FETCHED');
  });

  it('should get USD asset', async () => {
    const res = await server.get('/usd');
    expect(res.status).toEqual(201);
    expect(res.type).toEqual('application/json');
    expect(res.body.reason).toEqual('ASSET_FOUND');
  });
});
