const express = require('express')
const { initTracer } = require('jaeger-client')
const opentracing = require('opentracing')
const axios = require('axios')

const app = express()
const port = 3000

const config = {
  serviceName: 'a',
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
  logger: console,
}
const tracer = initTracer(config, options)

app.get('/', async (req, res) => {
  const parentSpan = tracer.extract(
    opentracing.FORMAT_HTTP_HEADERS,
    req.headers,
  )
  const span = tracer.startSpan('get /', { childOf: parentSpan })
  const headers = {}
  tracer.inject(span, opentracing.FORMAT_HTTP_HEADERS, headers)
  const tag = {
    [opentracing.Tags.SPAN_KIND]: opentracing.Tags.SPAN_KIND_MESSAGING_PRODUCER,
    [opentracing.Tags.HTTP_METHOD]: req.method,
    [opentracing.Tags.HTTP_URL]: req.path,
    data: {
      kame: {
        joko: {
          deep: 'data',
        },
      },
    },
  }
  const { data } = await axios.get('http://localhost:3001/', { headers })
  console.log('a')
  span.log(tag).finish()
  res.send('a')
})

app.listen(port, () => console.log('start ' + port))
