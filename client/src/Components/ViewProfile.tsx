import React, {useEffect, useState} from "react";
import { Avatar, Button, Divider, List, ListItem, Stack, TextField, Typography } from "@mui/material";
import PublicIcon from '@mui/icons-material/Public';
import PersonIcon from '@mui/icons-material/Person';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
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
        const userCountry = profile.country
        const userProduct = profile.product.charAt(0).toUpperCase() + profile.product.slice(1)
        const userType = profile.type.charAt(0).toUpperCase() + profile.type.slice(1)
        const userFollowerCount = profile.followers.total
        return (
            <Stack className="frame" spacing={4}>
                <img className="profile-photo" src={profile.images[1].url} alt="" />
                <div className="view-box">
                    <Typography variant="h6">Lyrics I live by</Typography>
                    <Typography variant="h2">{lyrics}</Typography>
                </div>
                <div className="view-box details">
                    <List>
                        <ListItem>
                            <PublicIcon style={{marginRight: "8px"}} />
                            <Typography>{userCountry}</Typography>
                        </ListItem>
                        <Divider style={{backgroundColor: "white"}} />
                        <ListItem>
                            <PersonIcon style={{marginRight: "8px"}} />
                            <Typography>{userProduct} {userType}</Typography>
                        </ListItem>
                        <Divider style={{backgroundColor: "white"}} />
                        <ListItem>
                            <GroupAddIcon style={{marginRight: "8px"}} />
                            <Typography>{userFollowerCount}</Typography>
                        </ListItem>
                    </List>
                </div>
                <div className="view-box spotifyModal">
                    <Typography variant="h6" marginBottom={5}>I'm listening to</Typography>
                    {song && <iframe 
                        src={`https://open.spotify.com/embed/track/${song.id}?utm_source=generator`} 
                        width="100%" 
                        height="352" 
                        frameBorder="0" 
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                        loading="lazy"
                    ></iframe>}
                </div>
                <div className="view-box">
                    <Typography variant="h6">Top 3, no debate needed</Typography>
                    <List>
                        {artists.map((artist, index) => {
                        const imageUrl = artist.images && artist.images.length > 0 ? artist.images[0].url : ""
                        return (
                            <>
                            <ListItem key={artist.id}>
                                <img style={{borderRadius: "4"}} src={imageUrl} alt="" className="image" />
                                <Typography style={{marginRight: "12px"}}>{artist.name}</Typography>
                                <Typography style={{fontStyle: "italic"}}>{artist.genres.join(", ")}</Typography>
                            </ListItem>
                            {index !== artists.length - 1 && <Divider style={{backgroundColor: "white"}} />}
                            </>
                        )})}
                    </List>
                </div>
                <div className="view-box spotifyModal">
                    <Typography variant="h6">Dive deep into my music taste</Typography>
                    {playlist && <iframe 
                        title="" 
                        src={`https://open.spotify.com/embed/playlist/${playlist.id}?utm_source=generator`} 
                        width="100%" 
                        height="352" 
                        frameBorder="0" 
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                        loading="lazy">
                    </iframe>}
                </div>
            </Stack>
        );
};


export default ViewProfile;
