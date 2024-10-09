import { PassThrough } from 'stream';

/**
 * SSE Channel.
 */
class SSEChannel {
  constructor(options) {
    this.options = Object.assign(
      {},
      {
        rewindId: 0,
        startId: 1,
        historySize: 100,
        pingInterval: 3000,
        maxStreamDuration: 30000,
        clientRetryInterval: 1000,
      },
      options,
    );

    this.nextID = this.options.startId;
    this.clients = new Set();
    this.messages = [];

    if (this.options.pingInterval) {
      this.pingTimer = setInterval(
        () => this.publish(),
        this.options.pingInterval,
      );
    }
  }

  publish(data, eventName) {
    const thisID = this.nextID;

    if (!data) {
      return void 0;
    }

    if (typeof data === 'object') data = JSON.stringify(data);

    data = data
      ? data
          .split(/[\r\n]+/)
          .map((str) => 'data: ' + str)
          .join('\n')
      : '';

    const output =
      (data ? 'id: ' + thisID + '\n' : '') +
      (eventName ? 'event: ' + eventName + '\n' : '') +
      (data || 'data: ') +
      '\n\n';

    this.clients.forEach((ctx) => ctx.res.write(output));

    this.messages.push(output);

    while (this.messages.length > this.options.historySize) {
      this.messages.shift();
    }

    this.nextID++;
  }

  subscribe(ctx) {
    ctx.req.socket.setNoDelay(true);
    // ctx.req.socket.setTimeout(Number.MAX_VALUE);
    ctx.set({
      'Content-Type': 'text/event-stream',
      // 'Cache-Control'	: 	's-maxage=' + (Math.floor(this.options.maxStreamDuration/1000)-1) +
      // 	'; max-age=0; stale-while-revalidate=0; stale-if-error=0',

      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });
    ctx.status = 200;

    const stream = new PassThrough();

    let body = 'retry: ' + this.options.clientRetryInterval + '\n\n';

    const lastID = Number.parseInt(ctx.req.headers['last-event-id'], 10);
    const rewind = !Number.isNaN(lastID)
      ? this.nextID - 1 - lastID
      : this.options.rewind;

    if (rewind) {
      this.messages.slice(0 - rewind).forEach((output) => {
        body += output;
      });
    }

    // ctx.res.write(body);
    ctx.body = stream;
    this.clients.add(ctx);

    // TODO: Check if request exceed max timeout.
    // setTimeout(() => {
    // 	if(!ctx.res.finished){
    // 		this.unsubscribe(ctx);
    // 	}
    // }, this.options.maxStreamDuration);

    ctx.req.on('close', () => this.unsubscribe(ctx));
    ctx.req.on('finish', () => this.unsubscribe(ctx));
    ctx.req.on('error', () => this.unsubscribe(ctx));

    return ctx;
  }

  unsubscribe(ctx) {
    ctx.res.end();
    this.clients.delete(ctx);
  }

  listClients() {
    const rollupByIP = {};
    this.clients.forEach((ctx) => {
      const ip = ctx.ips.length > 0 ? ctx.ips[ctx.ips.length - 1] : ctx.ip;
      if (!(ip in rollupByIP)) {
        rollupByIP[ip] = 0;
      }
      rollupByIP[ip]++;
    });
    return rollupByIP;
  }

  getSubscriberCount() {
    return this.clients.size;
  }
}

export default SSEChannel;
