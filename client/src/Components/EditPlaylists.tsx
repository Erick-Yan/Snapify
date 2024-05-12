import React, { useState } from 'react';
import { Button, TextField, List, ListItem, ListItemSecondaryAction, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, LinearProgress, Stack, makeStyles, Divider, Typography } from '@mui/material';
import { getUserPlaylist } from "../API Modules/searchUserPlaylist";
import InfoIcon from '@mui/icons-material/Info';
import './EditItems.css'
import SpotifyButton from './SpotifyButton';

interface EditPlaylistsProps {
  handleUpdatePlaylist: (playlist:any) => void
  playlist: any
}

function EditPlaylists({handleUpdatePlaylist, playlist}: EditPlaylistsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [filteredResults, setFilteredResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleOpenEdit = async () => {
    setIsEditing(true);
    try {
        setIsLoading(true)
        const result = await getUserPlaylist()
        setSearchResults(result.playlists)
        setFilteredResults(result.playlists)
      } catch (error) {
        console.log(error)
      }
      setIsLoading(false)
  };

  const handleCloseEdit = () => {
    setSearchResults([])
    setFilteredResults([])
    setSearchTerm("")
    setIsEditing(false);
  };

  const handleAddPlaylist = (item) => {
    handleUpdatePlaylist(item)
  };

  const handleRemovePlaylist = () => {
    handleUpdatePlaylist(null)
  };

  const handleInputChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    if (term === '') {
      setFilteredResults(searchResults);
    }
  }

  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
        setIsLoading(true)
        const filtered = searchResults.filter(
          (item) =>
              item.playlist_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredResults(filtered);
        setIsLoading(false)
    }
  }

  return (
    <>
      <div className="list-box">
        <h2>My Intro Playlist</h2>
        <SpotifyButton text="EDIT" color="green" clickButton={handleOpenEdit} />
        <List>
          {playlist && (
              <ListItem>
                <img src={playlist.playlist_image_id} alt="" className="image" />
                <h4>{playlist.playlist_name}</h4>
              </ListItem>
          )}
        </List>
      </div>
      <Dialog open={isEditing} onClose={handleCloseEdit} maxWidth="xs">
        <DialogTitle sx={{paddingY: "0"}}><h2>Edit Playlist</h2></DialogTitle>
        <DialogContent>
          <DialogContentText>
            <TextField
                onChange={handleInputChange}
                fullWidth
                />
                <SpotifyButton text="SEARCH" color="green" clickButton={handleSearch} />
              <List className='display-results'>
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
                  {filteredResults.map((item, index) => {
                  return (
                    <>
                      <ListItem key={item.playlist_id}>
                          <img src={item.playlist_image_id} alt="" className="image" />
                          <h4>{item.playlist_name}</h4>
                          <ListItemSecondaryAction>
                            <IconButton onClick={() => handleAddPlaylist(item)}>+</IconButton>
                          </ListItemSecondaryAction>
                      </ListItem>
                      {index !== filteredResults.length - 1 && <Divider />}
                    </>
                  )
                  })}
              </List>
              {playlist && <List>
                <ListItem key={1}>
                    <img src={playlist.playlist_image_id} alt="" className="image" />
                    <h4>{playlist.playlist_name}</h4>
                    <ListItemSecondaryAction>
                    <IconButton onClick={handleRemovePlaylist}>-</IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
              </List>}
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{display: "flex", flexDirection: "column" }}>
          <SpotifyButton text="DONE" color="green" clickButton={handleCloseEdit} />
          <h5>*Public playlists added to your profile ONLY</h5>
          <a target="_blank" href="https://www.androidauthority.com/make-spotify-playlist-public-3075538/" rel="noreferrer">Instructions</a>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default EditPlaylists;