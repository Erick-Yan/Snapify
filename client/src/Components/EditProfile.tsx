import React, {useState} from "react";
import { Stack, TextField } from "@mui/material";
import './EditProfile.css'
import EditArtists from "../Components/EditArtists";
import EditPlaylists from "../Components/EditPlaylists";
import EditSong from "../Components/EditSong";

interface EditProfileProps {
    profileImageUrl: string
    handleUpdateLyrics: (lyrics: string) => void
    handleUpdateSong: (song: any) => void
    handleUpdateArtists: (artists: any[]) => void
    handleUpdatePlaylist: (playlist: any) => void
    lyrics: string
    song: any
    artists: any
    playlist: any
}

function EditProfile({
    profileImageUrl,
    handleUpdateLyrics,
    handleUpdateSong, 
    handleUpdateArtists, 
    handleUpdatePlaylist,
    lyrics,
    song,
    artists,
    playlist}: EditProfileProps) {
        const handleLyricChange = (e: any) => {
            handleUpdateLyrics(e.target.value)
        }
        return (
            <Stack direction="column" spacing={2} className="form">
                <div className="form-items">
                    <img className="profile-photo" src={profileImageUrl} alt="" />
                    <Stack>
                        <h5>Lyrics I live by: </h5>
                        <TextField
                            id="standard-textarea"
                            multiline
                            variant="outlined"
                            onChange={handleLyricChange}
                            defaultValue={lyrics}
                        />
                    </Stack>
                </div>
                <div className="form-items">
                    <EditSong handleUpdateTrack={handleUpdateSong} song={song} />
                </div>
                <div className="form-items">
                    <EditArtists handleUpdateArtists={handleUpdateArtists} artists={artists} />
                </div>
                <div className="form-items">
                    <EditPlaylists handleUpdatePlaylist={handleUpdatePlaylist} playlist={playlist} />
                </div>
            </Stack>
        );
}

export default EditProfile;
