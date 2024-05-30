import React, { useEffect, useState } from "react";
import { CheckAuthMutation } from "../API Modules/checkAuth";
import { useSelector } from 'react-redux';
import { Button, LinearProgress, Stack, Link } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import MessageIcon from '@mui/icons-material/Message';
import GitHubIcon from '@mui/icons-material/GitHub'
import { useNavigate } from 'react-router-dom';
import './LandingPage.css'
import SpotifyButton from "../Components/SpotifyButton";
import { useCheckFollowers } from "../API Modules/checkFollowers";
import MarkUnreadChatAltIcon from '@mui/icons-material/MarkUnreadChatAlt';

function LandingPage() {
    const navigate = useNavigate();
    const LOGIN_URI = "/auth/login";
    const LOGOUT_URI = "/auth/logout";

    const { mutate: checkAuth, isLoading, isSuccess } = CheckAuthMutation();
    const checkFollowers = useCheckFollowers()
    const checkFollowersData = checkFollowers.data
    const { isLoggedIn, userId, profileUrl } = useSelector((state:any) => state);
    const [showNotification, setShowNotification] = useState(false)
    const [newFollowerCount, setNewFollowerCount] = useState(0)

    useEffect(() => {
        checkAuth();
        if(checkFollowersData) {
            console.log(checkFollowersData)
            setNewFollowerCount(checkFollowersData.new_follower_count || 0)
        }
    }, [checkFollowersData]);

    const handleShare = () => {
        const generatedUrl = `localhost:5000/app/public/${profileUrl}`;

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
                        <SpotifyButton clickButton={() => navigate(`/app/profile/${userId}`)} text="EDIT PROFILE" color="green" />
                        <div style={{marginBottom: "12px"}}>
                            <SpotifyButton clickButton={handleShare} text="COPY PROFILE" color="green" />
                        </div>
                        <div style={{ display: 'inline-block', width: 'fit-content', margin: "auto" }}> {/* Container to control width */}
                            <Link href="https://github.com/Erick-Yan/Snapify" target="_blank">
                                <GitHubIcon />
                            </Link>
                        </div>
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
                        {newFollowerCount === 0 ? <MessageIcon/> : <MarkUnreadChatAltIcon/>}
                    </div>
                </div>
            )}
        </div>
    );
}

export default LandingPage;
