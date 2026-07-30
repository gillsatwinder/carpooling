// tests/controllers/rideParticipant.controller.test.js

const rideParticipantService = require("../services/ride_participant.services");
const rideParticipantController = require("../controllers/ride_participant.controller");

jest.mock("../services/ride_participant.services");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Ride Participant Controller", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      params: {
        postId: "1",
        participantId: "10",
      },
      user: {
        id: 5,
      },
      body: {
        role: "PASSENGER",
      },
    };

    res = mockResponse();

    jest.clearAllMocks();
  });

  describe("joinRide", () => {
    it("should return 201 and created participant", async () => {
      const participant = {
        id: 10,
        status: "PENDING",
        role: "PASSENGER",
      };

      rideParticipantService.joinRide.mockResolvedValue(participant);

      await rideParticipantController.joinRide(req, res);

      expect(rideParticipantService.joinRide).toHaveBeenCalledWith(
        "1",
        5,
        "PASSENGER"
      );

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(participant);
    });

    it("should return 400 on error", async () => {
      rideParticipantService.joinRide.mockRejectedValue(
        new Error("Already joined")
      );

      await rideParticipantController.joinRide(req, res);

      expect(rideParticipantService.joinRide).toHaveBeenCalledWith(
        "1",
        5,
        "PASSENGER"
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Already joined",
      });
    });
  });
  describe("getParticipants", () => {
    it("should return participants", async () => {
      const participants = [{ id: 1 }, { id: 2 }];

      rideParticipantService.getParticipants.mockResolvedValue(
        participants
      );

      await rideParticipantController.getParticipants(req, res);

      expect(rideParticipantService.getParticipants).toHaveBeenCalledWith(
        "1"
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(participants);
    });

    it("should return 400 on error", async () => {
      rideParticipantService.getParticipants.mockRejectedValue(
        new Error("Ride not found")
      );

      await rideParticipantController.getParticipants(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Ride not found",
      });
    });
  });

  describe("acceptParticipant", () => {
    it("should accept participant", async () => {
      const participant = { id: 10, status: "ACCEPTED" };

      rideParticipantService.acceptParticipant.mockResolvedValue(
        participant
      );

      await rideParticipantController.acceptParticipant(req, res);

      expect(
        rideParticipantService.acceptParticipant
      ).toHaveBeenCalledWith("10", 5);

      expect(res.json).toHaveBeenCalledWith(participant);
    });

    it("should return 400 on error", async () => {
      rideParticipantService.acceptParticipant.mockRejectedValue(
        new Error("Unauthorized")
      );

      await rideParticipantController.acceptParticipant(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Unauthorized",
      });
    });
  });

  describe("rejectParticipant", () => {
    it("should reject participant", async () => {
      const participant = { id: 10, status: "REJECTED" };

      rideParticipantService.rejectParticipant.mockResolvedValue(
        participant
      );

      await rideParticipantController.rejectParticipant(req, res);

      expect(
        rideParticipantService.rejectParticipant
      ).toHaveBeenCalledWith("10", 5);

      expect(res.json).toHaveBeenCalledWith(participant);
    });

    it("should return 400 on error", async () => {
      rideParticipantService.rejectParticipant.mockRejectedValue(
        new Error("Unauthorized")
      );

      await rideParticipantController.rejectParticipant(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Unauthorized",
      });
    });
  });

  describe("cancelRequest", () => {
    it("should cancel request", async () => {
      const participant = { id: 10, status: "CANCELLED" };

      rideParticipantService.cancelRequest.mockResolvedValue(
        participant
      );

      await rideParticipantController.cancelRequest(req, res);

      expect(
        rideParticipantService.cancelRequest
      ).toHaveBeenCalledWith("10", 5);

      expect(res.json).toHaveBeenCalledWith(participant);
    });

    it("should return 400 on error", async () => {
      rideParticipantService.cancelRequest.mockRejectedValue(
        new Error("Cannot cancel")
      );

      await rideParticipantController.cancelRequest(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Cannot cancel",
      });
    });
  });

  describe("leaveRide", () => {
    it("should leave ride", async () => {
      const participant = { id: 10, status: "LEFT" };

      rideParticipantService.leaveRide.mockResolvedValue(
        participant
      );

      await rideParticipantController.leaveRide(req, res);

      expect(
        rideParticipantService.leaveRide
      ).toHaveBeenCalledWith("10", 5);

      expect(res.json).toHaveBeenCalledWith(participant);
    });

    it("should return 400 on error", async () => {
      rideParticipantService.leaveRide.mockRejectedValue(
        new Error("Cannot leave ride")
      );

      await rideParticipantController.leaveRide(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Cannot leave ride",
      });
    });
  });

  describe("getMyJoinedRides", () => {
    it("should return joined rides", async () => {
      const rides = [{ id: 1 }, { id: 2 }];

      rideParticipantService.getMyJoinedRides.mockResolvedValue(
        rides
      );

      await rideParticipantController.getMyJoinedRides(req, res);

      expect(
        rideParticipantService.getMyJoinedRides
      ).toHaveBeenCalledWith(5);

      expect(res.json).toHaveBeenCalledWith(rides);
    });

    it("should return 400 on error", async () => {
      rideParticipantService.getMyJoinedRides.mockRejectedValue(
        new Error("Failed to fetch rides")
      );

      await rideParticipantController.getMyJoinedRides(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Failed to fetch rides",
      });
    });
  });
});