import { useEffect, useState } from "react";

export const UserDonations = () => {
  const USERDONATION_ENDPOINT = "http://localhost:4000/api/v1/donaciones/my-donations";

  const [userDonations, setUserDonations] = useState([]);

  const getToken = () => {
    return sessionStorage.getItem("token");
  };

  useEffect(() => {
    const fetchUserDonations = async () => {
      try {
        const response = await fetch(USERDONATION_ENDPOINT, {
          headers: {
            "Authorization": `Bearer ${getToken()}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUserDonations(data);
        } else {
          console.error("Error getting user donations");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserDonations();
  }, []);

  return (
    <>
      <h1>My Donations</h1>

{userDonations.length > 0 ? (
  <table className="w3-table w3-striped w3-bordered w3-border">
    <thead>
      <tr>
        <th>DonacionID</th>
        <th>ProyectoID</th>
        <th>DonanteID</th>
        <th>Monto</th>
      </tr>
    </thead>
    <tbody>
      {userDonations.map((donation) => (
        <tr key={donation.DonacionID}>
          <td>{donation.DonacionID}</td>
          <td>{donation.ProyectoID}</td>
          <td>{donation.DonanteID}</td>
          <td>{donation.Monto}</td>
        </tr>
      ))}
    </tbody>
  </table>
) : (
  <p>There are no donations made by this user :p</p>
)}
    </>
  );
};

