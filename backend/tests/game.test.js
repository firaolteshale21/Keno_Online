const request = require("supertest");
const server = require("../server"); // ✅ Import the server correctly

describe("Game Round API Tests", () => {
  let app;

  beforeAll(() => {
    app = request(server);
  });

  afterAll((done) => {
    server.close(done); // ✅ Close the server after tests to prevent conflicts
  });

  test("Should start a new game round", async () => {
    const res = await app.post("/api/game/start-round");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Game round started");
  });

  test("Should not allow bets during drawing phase", async () => {
    await app.post("/api/game/start-round");
    await new Promise((resolve) => setTimeout(resolve, 61000)); // Wait for drawing phase

    const res = await app.post("/api/game/place-bet").send({
      userId: "test-user-id",
      gameRoundId: "test-game-id",
      selectedNumbers: [3, 5, 12],
      amount: 100,
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Bets are closed. Numbers are being drawn.");
  });
});
