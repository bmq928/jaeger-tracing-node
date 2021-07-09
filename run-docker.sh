#!/bin/sh
docker run -d --name jaeger --net host jaegertracing/all-in-one:latest
