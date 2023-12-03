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

    const [inputtedLyrics, setInputtedLyrics] = useState('')
    const [selectedTrack, setSelectedTrack] = useState<any>(null)
    const [selectedArtists, setSelectedArtists] = useState<any[]>([])
    const [selectedPlaylist, setSelectedPlaylist] = useState<any>(null)

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
                    <a className="button cancel-button" href="/app">Cancel</a>
                    <h3 className="button name">{data.display_name}</h3>
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
                profileImageUrl={data.images[1].url}
                handleUpdateLyrics={handleInputtedLyricsChange}
                handleUpdateSong={handleSelectedTrackChange}
                handleUpdateArtists={handleSelectedArtistsChange}
                handleUpdatePlaylist={handleSelectedPlaylistChange}
            />}
            {activeOption === 2 && <ViewProfile 
                profile={data}
                lyrics={inputtedLyrics}
                song={selectedTrack}
                artists={selectedArtists}
                playlist={selectedPlaylist}
            />}
        </>
    );
}

export default UserProfilePage;
