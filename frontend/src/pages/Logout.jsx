export const Logout = () => {
  const handleLogout = () => {
      fetch('/api/v1/logout', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      })
        .then((response) => {
          if (response.status === 200) {
            // Remove token from sessionStorage and redirect to login
            sessionStorage.removeItem('token');
            window.location.replace('/');
          }
        })
        .catch((error) => {
          console.error('Logout error:', error);
        });
    };
  
    return (
      <button onClick={handleLogout}>Logout</button>
    );
  }