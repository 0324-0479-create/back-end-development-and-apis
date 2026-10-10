function isPrime(num) {
  // Primes must be whole numbers greater than 1
  if (!Number.isInteger(num) || num <= 1) {
    return false;
  }

  // 2 is the only even prime
  if (num === 2) {
    return true;
  }

  // Any other even number is not prime
  if (num % 2 === 0) {
    return false;
  }

  // Check odd divisors up to the square root of num
  for (let i = 3; i <= Math.sqrt(num); i += 2) {
    if (num % i === 0) {
      return false;
    }
  }

  return true;
}

module.exports = { isPrime };