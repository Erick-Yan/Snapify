import React, { useEffect, useState } from "react";

interface UserHeaderProps {
    username: string
    userActive: boolean
  }
  
  function UserHeader({username, userActive}: UserHeaderProps) {
    return (
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
            <h1 style={{paddingTop: "12px", color: "#ffffff", margin: "0"}}>{username}</h1>
            <p style={{color: "#1DB954", margin: "0"}}>{userActive ? "• Active" : ""}</p>
        </div>
    );
};


export default UserHeader;
