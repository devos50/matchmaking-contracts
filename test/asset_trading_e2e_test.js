const MatchingMarket = artifacts.require("MatchingMarket");

contract("MatchingMarket e2e tests", async accounts => {
	let contract;

    beforeEach(async () => {
        contract = await MatchingMarket.new(100000000000);
    });

    it("E2E test", async () => {
    	await contract.offer.sendTransaction(10000, "DUM1", 10000, "DUM2", 0, false);
    	await contract.offer.sendTransaction(10000, "DUM2", 10000, "DUM1", 0, false);
	});
});