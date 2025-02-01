class KenoGame {
  constructor(baseRTP) {
    this.baseRTP = baseRTP; // Base RTP value (e.g., 0.95 for 95%)
    this.currentRTP = baseRTP; // Current RTP value
  }

  // Method to set the RTP
  setRTP(newRTP) {
    if (newRTP >= 0 && newRTP <= 1) {
      this.currentRTP = newRTP;
      console.log(`RTP set to ${newRTP * 100}%`);
    } else {
      console.error("Invalid RTP value. Must be between 0 and 1.");
    }
  }

  // Method to calculate payout
  calculatePayout(amount) {
    return amount * this.currentRTP; // Calculate the payout based on current RTP
  }

  // Method to simulate a betting scenario
  simulateBet(amount) {
    const payout = this.calculatePayout(amount);
    console.log(`Bet Amount: $${amount}, Expected Payout: $${payout}`);
    return payout;
  }
}

// Usage
const kenoGame = new KenoGame(0.95); // Base RTP of 95%
kenoGame.simulateBet(10); // Simulate a $10 bet

// Adjust RTP for a promotional event
kenoGame.setRTP(0.97); // Adjust RTP to 97%
kenoGame.simulateBet(10); // Simulate a $10 bet during promotion
