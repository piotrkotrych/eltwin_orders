import React from "react";

function Dashboard({ user }) {
  return (
    <div className="container-fluid">
      <h2 className="m-4">Witaj {user.name}!</h2>
    </div>
  );
}

export default Dashboard;
