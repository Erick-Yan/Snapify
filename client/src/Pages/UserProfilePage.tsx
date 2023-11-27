import React, {useEffect, useState} from "react";
import { useGetUserProfile } from "../API Modules/getUserProfile";
import { useSelector } from 'react-redux';
import { Button, LinearProgress, Stack, TextField } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import './UserProfilePage.css'
import EditArtists from "../Components/EditArtists";
import EditPlaylists from "../Components/EditPlaylists";

function UserProfilePage() {
    const navigate = useNavigate()
    const { data, isLoading, error } = useGetUserProfile()
    const [activeOption, setActiveOption] = useState(1);

    const handleOptionClick = (option) => {
        setActiveOption(option);
    };

    if (error) {
        navigate("/app")
    }

    if (isLoading) {
        return (
            <Stack>
                <LinearProgress />
            </Stack>
        )
    }

    return (
        <>
            <Stack className="header">
                <div className="flex-container">
                    <a className="box cancel-box" href="/app">Cancel</a>
                    <h3 className="box name-box">{data.display_name}</h3>
                    <a className="box done-box" href="/app">Done</a>
                </div>
                <div className="nav-header">
                    <div
                        className={`nav-option ${activeOption === 1 ? 'active' : ''}`}
                        onClick={() => handleOptionClick(1)}
                    >
                        Edit
                    </div>
                    <div
                        className={`nav-option ${activeOption === 2 ? 'active' : ''}`}
                        onClick={() => handleOptionClick(2)}
                    >
                        View
                    </div>
                </div>
            </Stack>
            <Stack direction="column" spacing={2} className="form">
                <div className="box form-items">
                    <img className="profile-photo" src={data.images[1].url} alt="" />
                    <h5>Lyrics I live by: </h5>
                    <TextField
                        id="standard-textarea"
                        multiline
                        variant="outlined"
                    />
                </div>
                <div className="box form-items">
                    <EditArtists />
                </div>
                <div className="box form-items">
                    <EditPlaylists />
                </div>
            </Stack>
        </>
    );
}

export default UserProfilePage;
