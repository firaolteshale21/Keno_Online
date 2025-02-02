const request = require("supertest");
const server = require("../src/");

describe("Bet API Tests", () => {
  let app;

  beforeAll(() => {
    app = request(server);
  });

  afterAll((done) => {
    server.close(done);
  });

  test("Should allow bets during betting phase", async () => {
    const res = await app.post("/api/game/place-bet").send({
      userId: "test-user-id",
      gameRoundId: "test-game-id",
      selectedNumbers: [3, 5, 12],
      amount: 100,
    });
    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Bet placed successfully");
  });

  test("Should reject bets with insufficient balance", async () => {
    const res = await app.post("/api/game/place-bet").send({
      userId: "test-user-id",
      gameRoundId: "test-game-id",
      selectedNumbers: [3, 5, 12],
      amount: 100000, // Large amount to trigger failure
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Insufficient balance");
  });
});
