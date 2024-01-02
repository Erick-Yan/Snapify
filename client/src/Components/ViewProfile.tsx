import React from "react";
import { Divider, List, ListItem, Stack, Typography } from "@mui/material";
import PublicIcon from '@mui/icons-material/Public';
import PersonIcon from '@mui/icons-material/Person';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import LyricsIcon from '@mui/icons-material/Lyrics';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import InterpreterModeIcon from '@mui/icons-material/InterpreterMode';
import './ViewProfile.css'

interface ViewProfileProps {
    profile: any
    lyrics: any
    song: any
    artists: any[]
    playlist: any
}

function ViewProfile({
    profile,
    lyrics,
    song,
    artists,
    playlist}: ViewProfileProps) {
        return (
            <Stack className="frame" spacing={4}>
                <img className="profile-photo" src={profile.user_image_id} alt="" />
                {lyrics && <div className="view-box">
                    <div className="box-title">
                        <LyricsIcon className="icon" />
                        <h3 className="title">Lyrics I live by</h3>
                    </div>
                    <p style={{fontSize: "60px", marginTop: "0", marginBottom: "0", fontWeight: "lighter"}}>{lyrics}</p>
                </div>}
                <div className="view-box details">
                    <List>
                        <ListItem>
                            <PublicIcon style={{marginRight: "8px"}} />
                            <h4 style={{marginTop: "0", marginBottom: "0", fontWeight: "normal"}}>{profile.user_country}</h4>
                        </ListItem>
                        <Divider style={{backgroundColor: "white"}} />
                        <ListItem>
                            <PersonIcon style={{marginRight: "8px"}} />
                            <h4 style={{marginTop: "0", marginBottom: "0", fontWeight: "normal"}}>{profile.user_type}</h4>
                        </ListItem>
                        <Divider style={{backgroundColor: "white"}} />
                        <ListItem>
                            <GroupAddIcon style={{marginRight: "8px"}} />
                            <h4 style={{marginTop: "0", marginBottom: "0", fontWeight: "normal"}}>{profile.user_followers} Followers</h4>
                        </ListItem>
                    </List>
                </div>
                {song && <div className="view-box spotifyModal">
                    <div className="box-title">
                        <PlayCircleFilledIcon className="icon" />
                        <h3 className="title">I'm listening to</h3>
                    </div>
                    <List>
                        <iframe 
                            src={`https://open.spotify.com/embed/track/${song.song_id}?utm_source=generator`} 
                            width="100%" 
                            height="352" 
                            frameBorder="0" 
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                            loading="lazy"
                        ></iframe>
                    </List>
                </div>}
                {artists.length > 0 && <div className="view-box">
                    <div className="box-title">
                        <InterpreterModeIcon className="icon" />
                        <h3 className="title">I can't get enough of</h3>
                    </div>
                    <List>
                        {artists.map((artist, index) => {
                        return (
                            <>
                            <ListItem key={artist.id}>
                                <img style={{borderRadius: "4"}} src={artist.artist_image_id} alt="" className="image" />
                                <h4 style={{marginRight: "12px"}}>{artist.artist_name}</h4>
                                <p style={{color: "#43464B", fontWeight: "500"}}>{artist.artist_genres}</p>
                            </ListItem>
                            {index !== artists.length - 1 && <Divider style={{backgroundColor: "white"}} />}
                            </>
                        )})}
                    </List>
                </div>}
                {playlist && <div className="view-box spotifyModal">
                    <div className="box-title">
                        <QueueMusicIcon className="icon" />
                        <h3 className="title">Dive into my taste</h3>
                    </div>
                    <p style={{color: "#43464B", marginTop: "0", marginBottom: "0", fontWeight: "lighter"}}>{playlist.playlist_description}</p>
                    <List>
                        <iframe 
                            title="" 
                            src={`https://open.spotify.com/embed/playlist/${playlist.playlist_id}?utm_source=generator`} 
                            width="100%" 
                            height="352" 
                            frameBorder="0" 
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                            loading="lazy">
                        </iframe>
                    </List>
                </div>}
            </Stack>
        );
};


export default ViewProfile;
