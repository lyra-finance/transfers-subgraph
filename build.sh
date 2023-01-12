#!/bin/bash
network=$1

GRAPH=${GRAPH:-graph}

graphNetwork=$network

if [ $network = 'kovan-ovm' ]; then
  graphNetwork='optimism-kovan'
elif [ $network = 'goerli-ovm' ]; then
  graphNetwork='optimism-goerli'
elif [ $network = 'mainnet-ovm' ]; then
  graphNetwork='optimism'
elif [ $network = 'mainnet-arbi' ]; then
  graphNetwork='arbitrum-one'
elif [ $network = 'goerli-arbi' ]; then
  graphNetwork='arbitrum-goerli'
fi

NETWORK=$graphNetwork $GRAPH codegen subgraph.js -o generated --network $network
NETWORK=$graphNetwork $GRAPH build subgraph.js --network $network
