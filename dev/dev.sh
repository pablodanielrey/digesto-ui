#!/bin/bash
echo "corriendo en el puerto 11305"
docker run --rm -ti --name digesto-ui -v $(pwd)/src:/src -p 11305:4200 desarrollo-ui
