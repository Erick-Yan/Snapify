import React, {useEffect, useState} from "react";
import { Avatar, Button, Divider, List, ListItem, Stack, TextField, Typography } from "@mui/material";
import PublicIcon from '@mui/icons-material/Public';
import PersonIcon from '@mui/icons-material/Person';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import LyricsIcon from '@mui/icons-material/Lyrics';
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import './ViewProfile.css'

interface ViewProfileProps {
    profile: any
    lyrics: string
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
        console.log(profile)
        return (
            <Stack className="frame" spacing={4}>
                <img className="profile-photo" src={profile.user_image_id} alt="" />
                <div className="view-box">
                    <div className="box-title">
                        <LyricsIcon className="icon" />
                        <Typography className="title" variant="h6">Lyrics I live by</Typography>
                    </div>
                    <Typography variant="h2">{lyrics}</Typography>
                </div>
                <div className="view-box details">
                    <List>
                        <ListItem>
                            <PublicIcon style={{marginRight: "8px"}} />
                            <Typography>{profile.user_country}</Typography>
                        </ListItem>
                        <Divider style={{backgroundColor: "white"}} />
                        <ListItem>
                            <PersonIcon style={{marginRight: "8px"}} />
                            <Typography>{profile.user_type}</Typography>
                        </ListItem>
                        <Divider style={{backgroundColor: "white"}} />
                        <ListItem>
                            <GroupAddIcon style={{marginRight: "8px"}} />
                            <Typography>{profile.user_followers}</Typography>
                        </ListItem>
                    </List>
                </div>
                {song && <div className="view-box spotifyModal">
                    <div className="box-title">
                        <PlayCircleFilledIcon className="icon" />
                        <Typography className="title" variant="h6">I'm listening to</Typography>
                    </div>
                    <iframe 
                        src={`https://open.spotify.com/embed/track/${song.song_id}?utm_source=generator`} 
                        width="100%" 
                        height="352" 
                        frameBorder="0" 
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                        loading="lazy"
                    ></iframe>
                </div>}
                {artists.length > 0 && <div className="view-box">
                    <div className="box-title">
                        <DoNotDisturbOnIcon className="icon" />
                        <Typography className="title" variant="h6">Top 3, no debate</Typography>
                    </div>
                    <List>
                        {artists.map((artist, index) => {
                        return (
                            <>
                            <ListItem key={artist.id}>
                                <img style={{borderRadius: "4"}} src={artist.artist_image_id} alt="" className="image" />
                                <Typography style={{marginRight: "12px"}}>{artist.artist_name}</Typography>
                                <Typography style={{fontStyle: "italic"}}>{artist.artist_genres}</Typography>
                            </ListItem>
                            {index !== artists.length - 1 && <Divider style={{backgroundColor: "white"}} />}
                            </>
                        )})}
                    </List>
                </div>}
                {playlist && <div className="view-box spotifyModal">
                    <div className="box-title">
                        <QueueMusicIcon className="icon" />
                        <Typography className="title" variant="h6">Dive into my taste</Typography>
                    </div>
                    <iframe 
                        title="" 
                        src={`https://open.spotify.com/embed/playlist/${playlist.playlist_id}?utm_source=generator`} 
                        width="100%" 
                        height="352" 
                        frameBorder="0" 
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                        loading="lazy">
                    </iframe>
                </div>}
                {song === null && playlist === null && artists.length === 0 && (
                    <div className="view-box spotifyModal">
                        <div className="box-title">
                            <HelpOutlineIcon className="icon" />
                            <Typography className="title" variant="h6">Your profile is looking a little empty...</Typography>
                        </div>
                    </div>
                )}
            </Stack>
        );
};


export default ViewProfile;
