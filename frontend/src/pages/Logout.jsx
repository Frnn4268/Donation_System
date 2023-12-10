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
              // Eliminar el token del sessionStorage y redirigir al inicio de sesión
              sessionStorage.removeItem('token');
              window.location.replace('/');
            }
          })
          .catch((error) => {
            console.error('Error al cerrar sesión:', error);
          });
      };
    
      return (
        <button onClick={handleLogout}>Cerrar sesión</button>
      );
    }