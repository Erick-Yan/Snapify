import React, { useEffect, useState } from "react";
import { Stack, LinearProgress } from "@mui/material";
import '../Components/ViewProfile.css'
import { useNavigate, useParams } from "react-router-dom";
import ViewProfile from "../Components/ViewProfile";
import { useGetPublicUserProfile } from "../API Modules/getPublicUserProfile";

function UserProfilePublicPage() {
    const { publicId } = useParams();
    const { data, isLoading, error } = useGetPublicUserProfile({"user_page_id": publicId})
    const navigate = useNavigate()

    const [profile, setProfile] = useState<any>(null)
    const [lyrics, setLyrics] = useState('')
    const [song, setSong] = useState<any>(null)
    const [artists, setArtists] = useState<any[]>([])
    const [playlist, setPlaylist] = useState<any>(null)

    useEffect(() => {
        if (data) {
            setProfile(data.metadata)
            setLyrics(data.lyrics?.lyrics || '')
            setSong(data.song || null)
            setArtists(data.artists || [])
            setPlaylist(data.playlist || null)
        }
    }, [data]);

    if (error) {
        navigate("/app")
    }

    if (profile === null || isLoading) {
        return (
            <Stack>
                <LinearProgress
                    sx={{
                        '&.MuiLinearProgress-root': {
                            backgroundColor: '#040306',
                        },
                        '& .MuiLinearProgress-bar': {
                            backgroundColor: '#1DB954',
                        },
                    }}
                />
            </Stack>
        )
    }

    return (
        <div style={{background: "#181818"}}>
            <h2 style={{color: "#ffffff", marginBlockStart: "0px"}}>{profile.user_name}</h2>
            <ViewProfile 
                profile={profile}
                lyrics={lyrics}
                song={song}
                artists={artists}
                playlist={playlist}
            />
        </div>
    );
};


export default UserProfilePublicPage;
