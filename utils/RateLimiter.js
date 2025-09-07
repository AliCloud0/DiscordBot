class RateLimiter {
  /**
   * @param {number} maxRequests -
   * @param {number} windowMs -
   */
  constructor(maxRequests, windowMs) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();


    setInterval(() => this.cleanup(), windowMs);
  }

  check(userId) {
    const now = Date.now();
    const userData = this.requests.get(userId);

    if (!userData) {

      this.requests.set(userId, { count: 1, startTime: now });
      return true;
    }


    if (now - userData.startTime > this.windowMs) {
      this.requests.set(userId, { count: 1, startTime: now });
      return true;
    }


    if (userData.count < this.maxRequests) {
      userData.count += 1;
      this.requests.set(userId, userData);
      return true;
    }


    return false;
  }


  cleanup() {
    const now = Date.now();
    for (const [userId, userData] of this.requests) {
      if (now - userData.startTime > this.windowMs) {
        this.requests.delete(userId);
      }
    }
  }


  resetUser(userId) {
    this.requests.delete(userId);
  }

  resetAll() {
    this.requests.clear();
  }
}

module.exports = RateLimiter;
