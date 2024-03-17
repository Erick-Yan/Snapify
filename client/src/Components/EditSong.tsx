import React, { useEffect, useState } from 'react';
import { Button, TextField, List, ListItem, ListItemSecondaryAction, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, LinearProgress, Stack, makeStyles, Divider, Typography } from '@mui/material';
import './EditItems.css'
import { getSpotifySong } from '../API Modules/searchSong';
import SpotifyButton from './SpotifyButton';

interface EditSongProps {
    handleUpdateTrack: (track: any) => void
    song: any
}

function EditSong({handleUpdateTrack, song}: EditSongProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleOpenEdit = () => {
    setIsEditing(true);
  };

  const handleCloseEdit = () => {
    setSearchResults([])
    setSearchTerm("")
    setIsEditing(false);
  };

  const handleAddSong = (item) => {
    handleUpdateTrack(item)
  };

  const handleRemoveSong = () => {
    handleUpdateTrack(null)
  };

  const handleSearch = async () => {
    if (searchTerm.trim() !== '') {
      try {
        setIsLoading(true)
        const result = await getSpotifySong(searchTerm.toLowerCase())
        setSearchResults(result.songs)
      } catch (error) {
        console.log(error)
      }
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="list-box">
        <h2>I'm Listening to...</h2>
        <div>
          <SpotifyButton text="EDIT" color="green" clickButton={handleOpenEdit} />
          <List>
            {song && (
              <ListItem>
                <img src={song.song_image_id} alt="" className="image" />
                <h4 style={{marginRight: "12px"}}>{song.song_name}</h4>
                <p style={{fontStyle: "italic"}}>{song.song_artists}</p>
              </ListItem>
            )}
          </List>
        </div>
      </div>
      <Dialog open={isEditing} onClose={handleCloseEdit} maxWidth="xs">
        <DialogTitle sx={{paddingY: "0"}}><h2>Edit Tracks</h2></DialogTitle>
        <DialogContent>
          <DialogContentText>
            <TextField
              onChange={(e) => setSearchTerm(e.target.value)}
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
                  {searchResults.map((item, index) => {
                    return (
                      <>
                        <ListItem key={item.song_id}>
                            <img src={item.song_image_id} alt="" className="image" />
                            <h4 style={{marginRight: "12px"}}>{item.song_name}</h4>
                            <p>{item.song_artists}</p>
                            <ListItemSecondaryAction>
                              <IconButton onClick={() => handleAddSong(item)}>+</IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                        {index !== searchResults.length - 1 && <Divider />}
                      </>
                    )
                  })}
              </List>
              {song && <List>
                <ListItem key={1}>
                    <img src={song.song_image_id} alt="" className="image" />
                    <h4>{song.song_name}</h4>
                    <ListItemSecondaryAction>
                    <IconButton onClick={handleRemoveSong}>-</IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
              </List>}
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{display: "flex", flexDirection: "column" }}>
          <SpotifyButton text="DONE" color="green" clickButton={handleCloseEdit} />
        </DialogActions>
      </Dialog>
    </>
  );
}

export default EditSong;