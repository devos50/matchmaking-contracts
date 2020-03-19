const truffleAssert = require('truffle-assertions');
const MatchingMarket = artifacts.require("MatchingMarket");

contract("Asset trading unit tests", async accounts => {
    let contract;

    beforeEach(async () => {
        contract = await MatchingMarket.new(100000000000);
    });

    it("Test creating an offer", async () => {
        let tx = await contract.offer(1, 1000, "DUM1", 1000, "DUM2", 0, false);
        truffleAssert.eventEmitted(tx, 'LogMake');
        truffleAssert.eventEmitted(tx, 'LogSortedOffer');
    });

    it("Test a trade", async () => {
        let tx1 = await contract.offer(1, 1000, "DUM1", 1000, "DUM2", 0, false);
        let tx2 = await contract.offer(2, 1000, "DUM2", 1000, "DUM1", 0, false);
        truffleAssert.eventEmitted(tx2, 'LogTrade');
        truffleAssert.eventEmitted(tx2, 'LogDelete');
    });

    it("Test an incompatible trade with incompatible assets", async () => {
        let tx1 = await contract.offer(1, 1000, "DUM1", 1000, "DUM2", 0, false);
        let tx2 = await contract.offer(2, 1000, "DUM3", 1000, "DUM1", 0, false);
        truffleAssert.eventNotEmitted(tx2, 'LogTrade');
    });

    it("Test an incompatible trade with incompatible prices", async () => {
        let tx1 = await contract.offer(1, 1000, "DUM1", 1000, "DUM2", 0, false);
        let tx2 = await contract.offer(2, 1000, "DUM2", 1005, "DUM1", 0, false);
        truffleAssert.eventNotEmitted(tx2, 'LogTrade');
    });

    it("Test a partial trade", async () => {
        let tx1 = await contract.offer(1, 1000, "DUM1", 1000, "DUM2", 0, false);
        let tx2 = await contract.offer(2, 500, "DUM2", 500, "DUM1", 0, false);
        truffleAssert.eventEmitted(tx2, 'LogTrade', (ev) => {
        	return ev.pay_amt == 500 && ev.buy_amt == 500;
    	});
        truffleAssert.eventEmitted(tx2, 'LogDelete');

        let tx3 = await contract.offer(3, 500, "DUM2", 500, "DUM1", 0, false);
        truffleAssert.eventEmitted(tx3, 'LogDelete');
    });

    it("Test cancelling an order", async () => {
        let tx1 = await contract.offer(1, 1000, "DUM1", 1000, "DUM2", 0, false);
        let tx2 = await contract.cancel(1);
    });
});