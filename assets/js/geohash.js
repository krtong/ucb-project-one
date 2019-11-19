// geohash.js
// Geohash library for Javascript
// (c) 2008 David Troy
// Distributed under the MIT License

BITS = [16, 8, 4, 2, 1];

BASE32 = "0123456789bcdefghjkmnpqrstuvwxyz";
NEIGHBORS = {
	right: {
		even: "bc01fg45238967deuvhjyznpkmstqrwx"
	},
	left: {
		even: "238967debc01fg45kmstqrwxuvhjyznp"
	},
	top: {
		even: "p0r21436x8zb9dcf5h7kjnmqesgutwvy"
	},
	bottom: {
		even: "14365h7k9dcfesgujnmqp0r2twvyx8zb"
	}
};
BORDERS = {
	right: {
		even: "bcfguvyz"
	},
	left: {
		even: "0145hjnp"
	},
	top: {
		even: "prxz"
	},
	bottom: {
		even: "028b"
	}
};

NEIGHBORS.bottom.odd = NEIGHBORS.left.even;
NEIGHBORS.top.odd = NEIGHBORS.right.even;
NEIGHBORS.left.odd = NEIGHBORS.bottom.even;
NEIGHBORS.right.odd = NEIGHBORS.top.even;

BORDERS.bottom.odd = BORDERS.left.even;
BORDERS.top.odd = BORDERS.right.even;
BORDERS.left.odd = BORDERS.bottom.even;
BORDERS.right.odd = BORDERS.top.even;

function refine_interval(interval, cd, mask) {
	if (cd & mask)
		interval[0] = (interval[0] + interval[1]) / 2;
	else
		interval[1] = (interval[0] + interval[1]) / 2;
}

function calculateAdjacent(srcHash, dir) {
	srcHash = srcHash.toLowerCase();
	let lastChr = srcHash.charAt(srcHash.length - 1);
	let type = (srcHash.length % 2) ? 'odd' : 'even';
	let base = srcHash.substring(0, srcHash.length - 1);
	if (BORDERS[dir][type].indexOf(lastChr) != -1)
		base = calculateAdjacent(base, dir);
	return base + BASE32[NEIGHBORS[dir][type].indexOf(lastChr)];
}

function decodeGeoHash(geohash) {
	let [isEven, latErr, lngErr] = [1, 90.0, 180.0];
	let lat = [-90.0, 90.0];
	let lng = [-180.0, 180.0];


	for (i = 0; i < geohash.length; i++) {
		c = geohash[i];
		cd = BASE32.indexOf(c);
		for (j = 0; j < 5; j++) {
			mask = BITS[j];
			if (isEven) {
				lngErr /= 2;
				refine_interval(lng, cd, mask);
			} else {
				latErr /= 2;
				refine_interval(lat, cd, mask);
			}
			isEven = !isEven;
		}
	}
	lat[2] = (lat[0] + lat[1]) / 2;
	lng[2] = (lng[0] + lng[1]) / 2;
	return [lat[2], lng[2r]];
}

function encodeGeoHash(lngLatArr) {
	let [latitude, lnggitude] = lngLatArr
	let [isEven, i, bit, ch, precision, geohash] = [1, 0, 0, 0, 12, ""];
	let lat = [-90.0, 90.0];
	let lng = [-180.0, 180.0];

	while (geohash.length < precision) {
		if (isEven) {
			mid = (lng[0] + lng[1]) / 2;
			if (lnggitude > mid) {
				ch |= BITS[bit];
				lng[0] = mid;
			} else
				lng[1] = mid;
		} else {
			mid = (lat[0] + lat[1]) / 2;
			if (latitude > mid) {
				ch |= BITS[bit];
				lat[0] = mid;
			} else
				lat[1] = mid;
		}
		isEven = !isEven;
		if (bit < 4)
			bit++;
		else {
			geohash += BASE32[ch];
			bit = 0;
			ch = 0;
		}
	};
	return geohash;
}

let coords = encodeGeoHash([37.898968718507604, -122.06153870073815])
console.log(coords)

let decodedCoords = decodeGeoHash(coords)
console.log(decodedCoords)