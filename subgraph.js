const path = require("path");

const getNetwork = (networkForPath) => {
  switch (networkForPath) {
    case "local-ovm":
    case "local":
    case "kovan-ovm":
      return "optimism-kovan";
    case "goerli-ovm":
      return "optimism-goerli";
    case "goerli-arbi":
      return "arbitrum-goerli";
    case "mainnet-ovm":
      return "optimism";
    case "mainnet-arbi":
      return "arbitrum-one";
    default:
      throw Error("invalid network type");
  }
};

const networkIndex = process.argv.findIndex((arg) => arg.includes("--network"));
const networkForPath = process.argv[networkIndex + 1];

const network = getNetwork(networkForPath);

let stkLyraDeployBlock = 68202691;
let stkLyraAddress = "0x0F5d45a7023612e9e244fe84FAc5fCf3740d1492";

let distributorStartBlock = 19431890;
let distributor2StartBlock = 19431890;
let distibutorAddress = "0x019F0233C0277B9422FCDb1213B09C86f5f27D87";
let distibutor2Address = "0x3BB38b77a266Fceb4FA5659e0eCb5ecF6AeAC28D";
if (network == "arbitrum-one") {
  stkLyraDeployBlock = 56008811;
  stkLyraAddress = "0x5B237ab26CeD47Fb8ED104671819C801Aa5bA45E";

  distributorStartBlock = 59539903;
  distibutorAddress = "0xecB73D4621Cabbf199e778CAEBc74bE27f2EcEe1";

  distributor2StartBlock = 59539903;
  distibutor2Address = "0x835f827E3D4ab11Dd0B4a0B894B43b308A0e41FF";
}

const dataSources = [
  {
    kind: "ethereum/contract",
    name: "stkLyra",
    network,
    source: {
      address: stkLyraAddress,
      startBlock: stkLyraDeployBlock,
      abi: "ERC20",
    },
    mapping: {
      kind: "ethereum/events",
      apiVersion: "0.0.5",
      language: "wasm/assemblyscript",
      file: "./src/transfers.ts",
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
    name: "MultiDistributor",
    network,
    source: {
      address: distibutorAddress,
      startBlock: distributorStartBlock,
      abi: "MultiDistributor",
    },
    mapping: {
      kind: "ethereum/events",
      apiVersion: "0.0.5",
      language: "wasm/assemblyscript",
      file: "./src/distributor.ts",
      entities: ["TokenTransfer"], //This value is currently not used by TheGraph at all, it just cant be empty
      abis: [
        {
          name: "MultiDistributor",
          file: "./abis/MultiDistributor.json",
        },
      ],
      eventHandlers: [
        {
          event: "ClaimAdded(indexed address,indexed address,uint256,indexed uint256,string)",
          handler: "handleClaimAdded",
        },
        {
          event: "ClaimRemoved(indexed address,indexed address,uint256)",
          handler: "handleClaimRemoved",
        },
        {
          event: "Claimed(indexed address,indexed address,uint256)",
          handler: "handleClaim",
        },
      ],
    },
  },
  {
    kind: "ethereum/contract",
    name: "MultiDistributor2",
    network,
    source: {
      address: distibutor2Address,
      startBlock: distributor2StartBlock,
      abi: "MultiDistributor2",
    },
    mapping: {
      kind: "ethereum/events",
      apiVersion: "0.0.5",
      language: "wasm/assemblyscript",
      file: "./src/distributor.ts",
      entities: ["TokenTransfer"], //This value is currently not used by TheGraph at all, it just cant be empty
      abis: [
        {
          name: "MultiDistributor2",
          file: "./abis/MultiDistributor2.json",
        },
      ],
      eventHandlers: [
        {
          event: "ClaimAdded(indexed address,indexed address,uint256,uint256,indexed uint256,string)",
          handler: "handleClaimAdded2",
        },
        {
          event: "Claimed(indexed address,indexed address,uint256,uint256)",
          handler: "handleClaim2",
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
};
