import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, List, ListItem, Stack } from "@mui/material";
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import LyricsIcon from '@mui/icons-material/Lyrics';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import InterpreterModeIcon from '@mui/icons-material/InterpreterMode';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import './ViewProfile.css'
import SpotifyButton from "./SpotifyButton";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";

interface ViewProfileProps {
    profile: any
    lyrics: any
    song: any
    artists: any[]
    playlist: any
    following?: Boolean
    songMatches?: Boolean
    artistsMatches?: any[]
    playlistSongMatches?: any[]
    handleFollow?: () => Promise<any>
}

function ViewProfile({
    profile,
    lyrics,
    song,
    artists,
    playlist,
    following,
    songMatches,
    artistsMatches,
    playlistSongMatches,
    handleFollow
}: ViewProfileProps) {
    const navigate = useNavigate()
    const [viewPlaylistMatches, setViewPlaylistMatches] = useState(false);

    const handleOpenPlaylistMatchView = () => {
        setViewPlaylistMatches(true);
    }

    const handleClosePlaylistMatchView = () => {
        setViewPlaylistMatches(false);
    }

    const defaultHandleFollow = async () => {
        throw new Error('handleFollow function is not defined');
    };

    const handleFollowMutation = useMutation(handleFollow ?? defaultHandleFollow, {
        onSuccess: (data) => {

        },
        onError: (error) => {
            navigate("/app")
        },
    });

    return (
        <>
            <Stack className="frame" spacing={4}>
                <img className="profile-photo" src={profile.user_image_id} alt="" />
                {lyrics && <div className="view-box">
                    <div className="box-title">
                        <LyricsIcon className="icon" />
                        <h3 className="title">Lyrics I live by</h3>
                    </div>
                    <p style={{fontSize: "60px", marginTop: "0", marginBottom: "0", fontWeight: "lighter"}}>{lyrics}</p>
                </div>}
                {song && <div className="view-box spotifyModal">
                    <div className="box-title">
                        <PlayCircleFilledIcon className="icon" />
                        <h3 className="title">I'm listening to</h3>
                        {songMatches && <Tooltip sx={{marginLeft: 'auto'}} title="Match!" arrow>
                            <IconButton aria-label="add to favorites">
                                <FavoriteIcon />
                            </IconButton>
                        </Tooltip>}
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
                                {(artistsMatches && artistsMatches[index]) && <Tooltip sx={{marginLeft: 'auto'}} title="Match!" arrow>
                                    <IconButton aria-label="add to favorites">
                                        <FavoriteIcon />
                                    </IconButton>
                                </Tooltip>}
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
                    {playlistSongMatches && playlistSongMatches.length > 0 && 
                        <div className="box-title" style={{marginBottom: "-15px", marginTop: "-15px"}}>
                            <Tooltip title="Match!" arrow>
                                <IconButton aria-label="add to favorites">
                                    <FavoriteIcon />
                                </IconButton>
                            </Tooltip>
                            <p style={{color: "#43464B", fontWeight: "lighter"}}>You have <a style={{color: "white"}} href="#" onClick={handleOpenPlaylistMatchView}>{playlistSongMatches.length}</a> matches</p>
                        </div>
                    }
                    {/* <p style={{color: "#43464B", marginTop: "0", marginBottom: "0", fontWeight: "lighter"}}>{playlist.playlist_description}</p> */}
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
            <Dialog open={viewPlaylistMatches} onClose={handleClosePlaylistMatchView} maxWidth="xs">
                <DialogTitle sx={{paddingY: "0", backgroundColor: "#1DB954", color: "white"}}><h2>Matched Playlist Tracks</h2></DialogTitle>
                    <DialogContent sx={{backgroundColor: "#181818"}} >
                        <DialogContentText>
                            {playlistSongMatches && <List>
                                {playlistSongMatches.map((song, index) => {
                                    return (
                                        <>
                                            <ListItem key={index}>
                                                <img src={song.track_image_url} alt="" className="image" />
                                                <h4 style={{color: "white"}}>{song.track_name}</h4>
                                            </ListItem>
                                            {index !== playlistSongMatches.length - 1 && <Divider style={{backgroundColor: "white"}} />}
                                        </>
                                    )
                                })}
                            </List>}
                        </DialogContentText>
                    </DialogContent>
                <DialogActions style={{display: "flex", flexDirection: "column", backgroundColor: "#1DB954" }}>
                    <SpotifyButton text="DONE" color="white" clickButton={handleClosePlaylistMatchView} />
                </DialogActions>
            </Dialog>
            {handleFollow && <Tooltip title={!following ? "Follow" : "Following"} arrow>
                <IconButton
                    aria-label="follow"
                    className="follow-button"
                    onClick={() => !following && handleFollowMutation.mutate()}
                    sx={{
                        position: 'fixed',
                        bottom: 20,
                        right: 20,
                        color: "#1DB954",
                        borderRadius: '50%'
                    }}
                >
                    {!following ? 
                        <PersonAddAltIcon 
                            sx={{
                                color: "white", 
                                backgroundColor: "#1DB954", 
                                padding: "15px", 
                                borderRadius: "20px"
                            }} /> : 
                        <CheckCircleIcon 
                            sx={{
                                color: "white", 
                                backgroundColor: "#1DB954", 
                                padding: "15px", 
                                borderRadius: "20px"
                            }} />
                        
                    }
                </IconButton>
            </Tooltip>}
        </>
    );
};


export default ViewProfile;
