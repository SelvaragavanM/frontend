// Ensure you export the function like this
export const checkUserAuth = async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Optionally: Validate token with an API request
      return true;
    }
    return false;
  };
  