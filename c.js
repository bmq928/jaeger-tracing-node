const express = require('express')
const { initTracer } = require('jaeger-client')
const opentracing = require('opentracing')

const app = express()
const port = 3002

const config = {
  serviceName: 'c',
  reporter: {
    collectorEndpoint: 'http://localhost:14268/api/traces',
    logSpan: true,
  },
  sampler: {
    type: 'const',
    param: 1,
  },
}
const options = {
  tags: {
    a: '0.0.1',
  },
  logger: console,
}
const tracer = initTracer(config, options)

app.get('/',async (req, res) => {
  const parentSpan = tracer.extract(
    opentracing.FORMAT_HTTP_HEADERS,
    req.headers,
  )
  const span = tracer.startSpan('get /', { childOf: parentSpan })
  const tag = {
    [opentracing.Tags.SPAN_KIND]: opentracing.Tags.SPAN_KIND_MESSAGING_PRODUCER,
    [opentracing.Tags.HTTP_METHOD]: req.method,
    [opentracing.Tags.HTTP_URL]: req.path,
    data: {
      kame: 'c'
    }
  }
  span.log(tag).finish()
  console.log('c')
  res.send('c')
})

app.listen(port, () => console.log('start ' + port))
