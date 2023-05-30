require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.0",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/41H3unZAPSNwTArm4y_GRBABQmbnikc9",
      accounts: [
        "e1bd2562cbe1f8513baf46b65d28c2bb0702074648b39a30377cfa4bf8cf4596",
      ],
    },
  },
};
