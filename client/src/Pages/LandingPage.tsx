import React, { useEffect, useState } from "react";
import { CheckAuthMutation } from "../API Modules/checkAuth";
import { useSelector } from 'react-redux';
import { Button, LinearProgress, Stack } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import MessageIcon from '@mui/icons-material/Message';
import GitHubIcon from '@mui/icons-material/GitHub'
import { useNavigate } from 'react-router-dom';
import './LandingPage.css'
import SpotifyButton from "../Components/SpotifyButton";

function LandingPage() {
    const navigate = useNavigate();
    const LOGIN_URI = "/auth/login";
    const LOGOUT_URI = "/auth/logout";

    const { mutate: checkAuth, isLoading, isSuccess } = CheckAuthMutation();
    const { isLoggedIn, userId, profileUrl } = useSelector((state:any) => state);
    const [showNotification, setShowNotification] = useState(false)

    useEffect(() => {
        checkAuth();
        console.log(isLoggedIn, isSuccess)
    }, []);

    const handleShare = () => {
        const generatedUrl = `https://localhost:5000/app/${profileUrl}`;

        navigator.clipboard.writeText(generatedUrl)
            .then(() => {
                setShowNotification(true);

                setTimeout(() => {
                    setShowNotification(false);
                }, 2000);
            })
            .catch((err) => {
                console.error("Failed to copy:", err);
            });
    };

    return (
        <div className="landing-container">
            <div className="landing-content">
                <h1 className="landing-title">Snapify</h1>
                {isLoading && <LinearProgress
                    sx={{
                        '&.MuiLinearProgress-root': {
                            backgroundColor: '#040306',
                        },
                        '& .MuiLinearProgress-bar': {
                            backgroundColor: '#1DB954',
                        },
                    }}
                />}
                {isSuccess && !isLoggedIn && (
                    <SpotifyButton text="LOGIN" href={LOGIN_URI} color="green" />
                )}
                {isSuccess && isLoggedIn && (
                    <Stack direction="column" spacing={2}>
                        <SpotifyButton text="LOGOUT" href={LOGOUT_URI} color="white" />
                        <SpotifyButton clickButton={() => navigate(`/app/${userId}/profile`)} text="EDIT PROFILE" color="green" />
                        <SpotifyButton clickButton={handleShare} text="COPY PROFILE" color="green" />
                        <a style={{color: "grey"}} href="https://github.com/Erick-Yan/Snapify" target="_blank" rel="noreferrer">
                            <GitHubIcon />
                        </a>
                        {showNotification && (
                            <div className={`notification ${showNotification ? 'show' : ''}`}>
                                <p>URL copied to clipboard!</p>
                            </div>
                        )}
                    </Stack>
                )}
            </div>
            {isSuccess && (
                <div className="landing-nav">
                    <div
                        className={"landing-nav-option active"}
                        onClick={() => {}}
                    >
                        <HomeIcon />
                    </div>
                    <div
                        className={"landing-nav-option"}
                        onClick={() => {}}
                    >
                        <MessageIcon />
                    </div>
                </div>
            )}
        </div>
    );
}

export default LandingPage;
