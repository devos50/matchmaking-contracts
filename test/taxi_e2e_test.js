const truffleAssert = require('truffle-assertions');
const TaxiMatching = artifacts.require("TaxiMatching");

contract("TaxiMatching e2e tests", async accounts => {
	let contract;

    beforeEach(async () => {
        contract = await TaxiMatching.new();
    });

    it("E2E test", async () => {
    	await contract.requestRide(1, 1000, 1000);
    	var numRequests = await contract.getNumRequests.call();
    	assert.equal(numRequests, 1);
    	
    	var tx = await contract.offerRide(2, 1000, 1000);
		// check for the match event
    	truffleAssert.eventEmitted(tx, 'Match', (ev) => {
        	return ev.orderId1 == 2 && ev.orderId2 == 1 && ev.x1 == 1000 && ev.x2 == 1000 && ev.y1 == 1000 && ev.y2 == 1000;
    	});

    	let numOffers = await contract.getNumOffers.call();
    	numRequests = await contract.getNumRequests.call();
    	assert.equal(numOffers, 0);
    	assert.equal(numRequests, 0);

    	// check with offset (1)
    	await contract.offerRide(3, 1000, 1000);
    	tx = await contract.requestRide(4, 900, 900);
    	truffleAssert.eventEmitted(tx, 'Match', (ev) => {
        	return ev.distance == 200;
    	});

    	// check with offset (2)
    	await contract.offerRide(5, 900, 900);
    	tx = await contract.requestRide(6, 1000, 1000);
    	truffleAssert.eventEmitted(tx, 'Match', (ev) => {
        	return ev.distance == 200;
    	});

        // realistic case
        await contract.offerRide(5, "55462205782349568", "179196387108865088");
        tx = await contract.requestRide(6, "55430734787604192", "179091981339070848");
        truffleAssert.eventEmitted(tx, 'Match', (ev) => {
            return ev.distance == 135876764539616;
        });
	});
});