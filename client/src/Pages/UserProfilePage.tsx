import React, {useEffect, useState} from "react";
import { useGetUserProfile } from "../API Modules/getUserProfile";
import { useSelector } from 'react-redux';
import { Button, LinearProgress, Stack, TextField } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import './UserProfilePage.css'
import EditArtists from "../Components/EditArtists";
import EditPlaylists from "../Components/EditPlaylists";
import EditSong from "../Components/EditSong";
import EditProfile from "../Components/EditProfile";
import ViewProfile from "../Components/ViewProfile";

function UserProfilePage() {
    const navigate = useNavigate()
    const { data, isLoading, error } = useGetUserProfile()
    const [activeOption, setActiveOption] = useState(1);

    const [profile, setProfile] = useState<any>(null)
    const [inputtedLyrics, setInputtedLyrics] = useState('')
    const [selectedTrack, setSelectedTrack] = useState<any>(null)
    const [selectedArtists, setSelectedArtists] = useState<any[]>([])
    const [selectedPlaylist, setSelectedPlaylist] = useState<any>(null)

    useEffect(() => {
        if (data) {
            setProfile(data.metadata)
            setInputtedLyrics(data.lyrics || '')
            setSelectedTrack(data.song || null)
            setSelectedArtists(data.artists || [])
            setSelectedPlaylist(data.playlist || null)
        }
    }, [data]);

    const handleInputtedLyricsChange = (newValue) => {
        setInputtedLyrics(newValue);
    };
    
    const handleSelectedTrackChange = (newTrack) => {
        setSelectedTrack(newTrack);
    };
    
    const handleSelectedArtistsChange = (newArtists) => {
        setSelectedArtists(newArtists);
    };
    
    const handleSelectedPlaylistChange = (newPlaylist) => {
        setSelectedPlaylist(newPlaylist);
    };

    const handleOptionClick = (option) => {
        setActiveOption(option);
    };

    if (error) {
        navigate("/app")
    }

    if (profile === null || isLoading) {
        console.log("Here")
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
                    <a className="button cancel-button" href="/app">Cancel</a>
                    <h3 className="button name">{profile.user_name}</h3>
                    <a className="button done-button" href="/app">Done</a>
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
            {activeOption === 1 && <EditProfile 
                profileImageUrl={profile.user_image_id}
                handleUpdateLyrics={handleInputtedLyricsChange}
                handleUpdateSong={handleSelectedTrackChange}
                handleUpdateArtists={handleSelectedArtistsChange}
                handleUpdatePlaylist={handleSelectedPlaylistChange}
                lyrics={inputtedLyrics}
                song={selectedTrack}
                artists={selectedArtists}
                playlist={selectedPlaylist}
            />}
            {activeOption === 2 && <ViewProfile 
                profile={profile}
                lyrics={inputtedLyrics}
                song={selectedTrack}
                artists={selectedArtists}
                playlist={selectedPlaylist}
            />}
        </>
    );
}

export default UserProfilePage;
