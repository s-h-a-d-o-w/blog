#!/bin/bash
set -e

pnpm build
tar -cvf ./caprover_deployment.tar ./Dockerfile ./dist/*

# Password and caprover machine URLs (which may change)
[ -f ".env" ] && source ".env"

export CAPROVER_APP=blog
export CAPROVER_TAR_FILE=./caprover_deployment.tar

export CAPROVER_URL=$CAPROVER_MACHINE_01
npx caprover deploy > /dev/null

export CAPROVER_URL=$CAPROVER_MACHINE_02
npx caprover deploy > /dev/null

rm caprover_deployment.tar
