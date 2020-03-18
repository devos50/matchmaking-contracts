const TaxiMatching = artifacts.require("TaxiMatching");

contract("TaxiMatching e2e tests", async accounts => {
	let contract;

    beforeEach(async () => {
        contract = await TaxiMatching.new();
    });

    it("E2E test", async () => {
    	await contract.requestRide.sendTransaction(1000, 1000);
    	var numRequests = await contract.getNumRequests.call();
    	assert.equal(numRequests, 1);
    	
    	await contract.offerRide.sendTransaction(1000, 1000);
    	let numOffers = await contract.getNumOffers.call();
    	numRequests = await contract.getNumRequests.call();
    	assert.equal(numOffers, 0);
    	assert.equal(numRequests, 0);
	});
});