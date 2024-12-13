const geolib = require("geolib");
const User = require("../models/User");
const Ride = require("../models/Ride");
const jwt = require("jsonwebtoken")

const handleSocketConnection = (io) => {
	const onDutyCaptains = {};

	io.use(async (socket, next) => {
		const token = socket.handshake.headers.access_token;

		if (!token) {
			return next(new Error("Authentication invalid: No token provided"));
		}

		try {
			const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
			const user = await User.findById(payload.id);
			if (!user) {
				return next(
					new Error("Authentication invalid: User not found")
				);
			}

			socket.user = {
				id: payload.id,
				role: user.role,
			};

			next();
		} catch (error) {
			console.log("Socket error: ", error);

			return next(
				new Error("Authentication invalid: Token verification failed")
			);
		}
	});

	io.on("connection", (socket) => {
		const user = socket.user;
		console.log("User joined : ", user);

		if (user.role === "captain") {
			socket.on("goOnDuty", (coords) => {
				onDutyCaptains[user.id] = {
					socketId: socket.id,
					coords,
				};
				socket.join("onDuty");
				console.log(`Captain ${user.id} is now on duty`);

				// updateNearbyCaptains();
			});

			socket.on("goOffDuty", () => {
				delete onDutyCaptains[user.id];
				socket.leave("onDuty");
				console.log(`Captain ${user.id} is now off duty.`);

				// updateNearbyCaptains();
			});

			// update captain's location:
			socket.on("updateLocation", (coords) => {
				if (onDutyCaptains[user.id]) {
					onDutyCaptains[user.id].coords = coords;
					console.log(`Captain ${user.id} updated location.`);
					// updateNearbyCaptains();

					socket
						.to(`captain_${user.id}`)
						.emit("captainLocationUpdate", {
							captainId: user.id,
							coords,
						});
				}
			});
		}

		
	});
};

module.exports = handleSocketConnection;
