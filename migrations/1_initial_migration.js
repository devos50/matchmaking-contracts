const Migrations = artifacts.require("Migrations");
const SimpleMarket = artifacts.require("MatchingMarket");
const MatchingMarket = artifacts.require("MatchingMarket");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(MatchingMarket, 100000000000);
};
