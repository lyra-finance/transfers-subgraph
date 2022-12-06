const path = require("path");

const registryDeployBlock = 12780680;

const registryAddress = "0xF5A0442D4753cA1Ea36427ec071aa5E786dA5916";
const network = "arbitrum";

const tokens =
  network == "optimism"
    ? [
        "0x8c6f28f2f1a3c87f0f938b96d27520d9751ec8d9", //SUSD
        "0x7f5c764cbc14f9669b88837ca1490cca17c31607", //USDC
        "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1", //DAI
        "0x94b008aa00579c1307b0ef2c499ad98a8ce58e58", //USDT
      ]
    : [
        "0x7f5c764cbc14f9669b88837ca1490cca17c31607", //USDC
        "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1", //ETH
        "0x94b008aa00579c1307b0ef2c499ad98a8ce58e58", //DAI
      ];

const staticTokens = tokens.map((token) => {
  return {
    kind: "ethereum/contract",
    name: "ERC20_" + token,
    network,
    source: {
      address: token,
      startBlock: registryDeployBlock,
      abi: "ERC20",
    },
    mapping: {
      kind: "ethereum/events",
      apiVersion: "0.0.5",
      language: "wasm/assemblyscript",
      file: "./src/mapping.ts",
      entities: ["TokenTransfer"], //This value is currently not used by TheGraph at all, it just cant be empty
      abis: [
        {
          name: "ERC20",
          file: "./abis/ERC20.json",
        },
      ],
      eventHandlers: [
        {
          event: "Transfer(indexed address,indexed address,uint256)",
          handler: "handleTransfer",
        },
      ],
    },
  };
});

const dataSources = [
  {
    kind: "ethereum/contract",
    name: "LyraRegistry",
    network,
    source: {
      address: registryAddress,
      startBlock: registryDeployBlock,
      abi: "LyraRegistry",
    },
    mapping: {
      kind: "ethereum/events",
      apiVersion: "0.0.5",
      language: "wasm/assemblyscript",
      file: "./src/LyraRegistry.ts",
      entities: ["Market"], //This value is currently not used by TheGraph at all, it just cant be empty
      abis: [
        {
          name: "LyraRegistry",
          file: "./abis/LyraRegistry.json",
        },
        {
          name: "ERC20",
          file: "./abis/ERC20.json",
        },
      ],
      eventHandlers: [
        {
          event:
            "MarketUpdated(indexed address,(address,address,address,address,address,address,address,address,address,address,address))",
          handler: "handleMarketUpdated",
        },
        {
          event: "GlobalAddressUpdated(indexed bytes32,address)",
          handler: "handleGlobalAddressUpdated",
        },
      ],
    },
  },
  ...staticTokens,
];

const templates = [
  {
    kind: "ethereum/contract",
    name: "ERC20",
    network,
    source: {
      abi: "ERC20",
    },
    mapping: {
      kind: "ethereum/events",
      apiVersion: "0.0.5",
      language: "wasm/assemblyscript",
      file: "./src/mapping.ts",
      entities: ["TokenTransfer"], //This value is currently not used by TheGraph at all, it just cant be empty
      abis: [
        {
          name: "ERC20",
          file: "./abis/ERC20.json",
        },
      ],
      eventHandlers: [
        {
          event: "Transfer(indexed address,indexed address,uint256)",
          handler: "handleTransfer",
        },
      ],
    },
  },
  {
    kind: "ethereum/contract",
    name: "LiquidityPool",
    network,
    source: {
      abi: "LiquidityPool",
    },
    mapping: {
      kind: "ethereum/events",
      apiVersion: "0.0.5",
      language: "wasm/assemblyscript",
      file: "./src/liquidityPool.ts",
      entities: ["TokenTransfer"],
      abis: [
        {
          name: "LiquidityPool",
          file: "./abis/LiquidityPool.json",
        },
      ],
      eventHandlers: [
        {
          event:
            "DepositQueued(indexed address,indexed address,indexed uint256,uint256,uint256,uint256)",
          handler: "handleDepositQueued",
        },
      ],
    },
  },
  {
    kind: "ethereum/contract",
    name: "OptionMarketWrapper",
    network,
    source: {
      abi: "OptionMarketWrapper",
    },
    mapping: {
      kind: "ethereum/events",
      apiVersion: "0.0.5",
      language: "wasm/assemblyscript",
      file: "./src/OptionMarketWrapper.ts",
      entities: ["TokenTransfer"], //This value is currently not used by TheGraph at all, it just cant be empty
      abis: [
        {
          name: "OptionMarketWrapper",
          file: "./abis/OptionMarketWrapper.json",
        },
      ],
      eventHandlers: [
        {
          event:
            "PositionTraded(bool,bool,indexed address,indexed uint256,indexed address,uint256,uint256,uint256,int256,address)",
          handler: "handlePositionTraded",
        },
      ],
    },
  },
];

module.exports = {
  specVersion: "0.0.2",
  description: "Lyra",
  repository: "https://github.com/lyra-finance/lyra-protocol-subgraph",
  schema: {
    file: "./schema.graphql",
  },
  dataSources,
  templates,
};
