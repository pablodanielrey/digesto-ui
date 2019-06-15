#!/bin/bash
yarn install
ng build --configuration=$1 --prod --build-optimizer --aot --i18n-file src/messages.xlf --i18n-format xlf --i18n-locale es
