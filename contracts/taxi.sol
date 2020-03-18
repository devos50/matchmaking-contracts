pragma solidity >0.4.13;

contract TaxiMatching {

	struct Location {
		uint x;
		uint y;
	}

	Location[] requests;
	Location[] offers;

	function sqrt(uint x) private returns (uint y) {
    	uint z = (x + 1) / 2;
    	y = x;
    	while (z < y) {
        	y = z;
        	z = (x / z + z) / 2;
    	}
	}

	function distance(Location memory l1, Location memory l2) private returns (uint) {
		return sqrt((l2.x - l1.x) ** 2 + (l2.y - l1.y) ** 2);
	}

	function requestRide(uint x, uint y) public {
		Location memory l = Location(x, y);
		if(offers.length == 0) {
			requests.push(l);
			return;
		}

		// first check if there is any offer already
		uint minDist = 256 ** 2;
		uint offerIndex = 0;
		for (uint i = 0; i < offers.length; i++) {
			uint dist = distance(l, offers[i]);
			if(dist < minDist) {
				minDist = dist;
				offerIndex = i;
			}
		}

		if(offers.length > 1) {
			offers[offerIndex] = offers[offers.length-1];
		}
		offers.length--;
	}

	function offerRide(uint x, uint y) public {
		Location memory l = Location(x, y);
		if(requests.length == 0) {
			offers.push(l);
			return;
		}

		// first check if there is any request already
		uint minDist = 256 ** 2;
		uint requestIndex = 0;
		for (uint i = 0; i < requests.length; i++) {
			uint dist = distance(l, requests[i]);
			if(dist < minDist) {
				minDist = dist;
				requestIndex = i;
			}
		}

		if(requests.length > 1) {
			requests[requestIndex] = requests[requests.length-1];
		}
		requests.length--;
	}

	function getNumOffers() public returns (uint) {
		return offers.length;
	}

	function getNumRequests() public returns (uint) {
		return requests.length;
	}
}

