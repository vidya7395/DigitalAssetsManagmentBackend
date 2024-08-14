async function executeWithRetry(fn, retries = 3) {
    let attempt = 0;
    while (attempt < retries) {
      try {
        return await fn();
      } catch (error) {
        if (error.code === 'ECONNRESET' && attempt < retries - 1) {
          attempt++;
          console.warn(`Attempt ${attempt} failed. Retrying...`);
        } else {
          throw error;
        }
      }
    }
  }