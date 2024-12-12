const Ride = require("../model/Ride");
const {
	calculateDistance,
	calculateFare,
	generateOTP,
} = require("../utils/mapUtils");
const { BadRequestError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const createRide = async (req, res) => {
	const { vehicle, pickup, drop } = req.body;

	if (!vehicle || !pickup || !drop) {
		throw new BadRequestError(
			"vehicle, pickup and drop details are required!"
		);
	}

	const {
		address: pickupAddress,
		latitude: pickupLat,
		longitude: pickupLon,
	} = pickup;

	const {
		address: dropAddress,
		latitude: dropLat,
		longitude: dropLon,
	} = drop;

	if (
		!pickupAddress ||
		!pickupLat ||
		!pickupLon ||
		!dropAddress ||
		!dropLat ||
		!dropLon
	) {
		throw new BadRequestError(
			"Complete pickup and drop details are required"
		);
	}

	const customer = req.user;

	try {
		const distance = calculateDistance(
			pickupLat,
			pickupLon,
			dropLat,
			dropLat
		);
		const fare = calculateFare(distance, vehicle);

		const ride = new Ride({
			vehicle,
			distance,
			fare: fare[vehicle],
			pickup: {
				address: pickupAddress,
				latitude: pickupLat,
				longitude: pickupLon,
			},
			drop: {
				address: dropAddress,
				latitude: dropLat,
				longitude: dropLon,
			},
			customer: customer.id,
			otp: generateOTP(),
		});

		await ride.save();

		res.status(StatusCodes.CREATED).json({
			message: "Ride created successfully!",
			ride,
		});
	} catch (error) {
		console.log(error);
		throw new BadRequestError("Failed to create ride");
	}
};

const acceptRide = async (req, res) => {
	const captainId = req.user.id;
	const { rideId } = req.params;

	if (!rideId) {
		throw new BadRequestError("Ride ID is required");
	}

	try {
		let ride = await Ride.findById(rideId).populate("customer");

		if (!ride) {
			throw new Error("Ride not found");
		}

		if (ride.status !== "SEARCHING_FOR_CAPTAIN") {
			throw new BadRequestError(
				"Ride is no longer available for assignment"
			);
		}

		ride.captain = captainId;
		ride.status = "START";
		await ride.save();

		ride = await ride.populate("captain");

		// socket logic

		res.status(StatusCodes.OK).json({
			message: "Ride accepted successfully",
			ride,
		});
	} catch (error) {
		console.log(error);
		throw new BadRequestError("Failed to accept ride");
	}
};

const getMyRides = async (req, res) => {
	const userId = req.user.id;
	const { status } = req.query;

	try {
		const query = {
			$or: [
				{
					customer: userId,
				},
				{
					captain: userId,
				},
			],
		};

		if (status) {
			query.status = status;
		}

		const rides = await Ride.find(query)
			.populate("customer", "name phone")
			.populate("captain", "name phone")
			.sort({
				createdAt: -1,
			});

        res.status(StatusCodes.OK).json({
            message: "Rides retrieved successfully",
            count: rides.length,
            rides,
        })
	} catch (error) {
		console.error("Error retrieving rides: ", error);
		throw new BadRequestError("Failed to retrieve rides");
	}
};


module.exports = {
    createRide,
    acceptRide,
    getMyRides
}