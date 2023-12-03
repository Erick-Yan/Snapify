import React, { useEffect, useState } from 'react';
import { Button, Modal, TextField, List, ListItem, ListItemSecondaryAction, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, LinearProgress, Stack, makeStyles, Divider, Typography } from '@mui/material';
import './EditItems.css'
import { getSpotifySong } from '../API Modules/searchSong';

interface EditSongProps {
    handleUpdateTrack: (track: any) => void
}

function EditSong({handleUpdateTrack}: EditSongProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
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
    setSelectedItem(item)
    handleUpdateTrack(item)
  };

  const handleRemoveSong = () => {
    setSelectedItem(null);
    handleUpdateTrack(null)
  };

  const handleSearch = async () => {
    if (searchTerm.trim() !== '') {
      try {
        setIsLoading(true)
        const result = await getSpotifySong(searchTerm.toLowerCase())
        setSearchResults(result.tracks["items"])
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
          <Button variant="contained" color="primary" onClick={handleOpenEdit}>
            Edit
          </Button>
          {selectedItem && (
            <>
                <iframe 
                    src={`https://open.spotify.com/embed/track/${selectedItem.id}?utm_source=generator`} 
                    width="100%" 
                    height="352" 
                    frameBorder="0" 
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                    loading="lazy"
                ></iframe>
            </>
          )}
        </div>
      </div>
      <Dialog open={isEditing} onClose={handleCloseEdit} maxWidth="xs">
        <DialogTitle>Edit Tracks</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <TextField
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
            />
            <Button variant="contained" color="primary" onClick={handleSearch}>
              Search
            </Button>
              <List className='display-results'>
                  {isLoading && <LinearProgress />}
                  {searchResults.map((item, index) => {
                  const imageUrl = item.album && item.album.images && item.album.images.length > 0 ? item.album.images[0].url : ""
                  return (
                    <>
                      <ListItem key={item.id}>
                          <img src={imageUrl} alt="" className="image" />
                          {item.name}
                          <ListItemSecondaryAction>
                            <IconButton onClick={() => handleAddSong(item)}>+</IconButton>
                          </ListItemSecondaryAction>
                      </ListItem>
                      {index !== searchResults.length - 1 && <Divider />}
                    </>
                  )
                  })}
              </List>
              {selectedItem && <List>
                <ListItem key={1}>
                    <img src={selectedItem.album.images[0].url} alt="" className="image" />
                    {selectedItem.name}
                    <ListItemSecondaryAction>
                    <IconButton onClick={handleRemoveSong}>-</IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
              </List>}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit} color="primary">
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default EditSong;