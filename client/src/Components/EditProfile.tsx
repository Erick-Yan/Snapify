import React, {useState} from "react";
import { Stack, TextField } from "@mui/material";
import './EditProfile.css'
import EditArtists from "../Components/EditArtists";
import EditPlaylists from "../Components/EditPlaylists";
import EditSong from "../Components/EditSong";

interface EditProfilePros {
    profileImageUrl: string
    handleUpdateLyrics: (lyrics: string) => void
    handleUpdateSong: (song: any) => void
    handleUpdateArtists: (artists: any[]) => void
    handleUpdatePlaylist: (playlist: any) => void
}

function EditProfile({
    profileImageUrl,
    handleUpdateLyrics,
    handleUpdateSong, 
    handleUpdateArtists, 
    handleUpdatePlaylist}: EditProfilePros) {
        const [lyrics, updateLyrics] = useState("")
        const handleLyricChange = (e: any) => {
            updateLyrics(e.target.value)
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
                    <EditSong handleUpdateTrack={handleUpdateSong} />
                </div>
                <div className="form-items">
                    <EditArtists handleUpdateArtists={handleUpdateArtists} />
                </div>
                <div className="form-items">
                    <EditPlaylists handleUpdatePlaylist={handleUpdatePlaylist} />
                </div>
            </Stack>
        );
}

export default EditProfile;
