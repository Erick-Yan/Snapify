import React, { useEffect, useState } from 'react';
import { Button, Modal, TextField, List, ListItem, ListItemSecondaryAction, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, LinearProgress, Stack, makeStyles, Divider, Typography } from '@mui/material';
import { getSpotifyArtist } from "../API Modules/searchSpotifyArtist";
import './EditItems.css'

interface EditArtistsProps {
  handleUpdateArtists: (artists: any) => void
  artists: any
}

function EditArtists({handleUpdateArtists, artists}: EditArtistsProps) {
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

  const handleAddArtist = (item: string) => {
    if (artists.length < 3 && !artists.includes(item)) {
      handleUpdateArtists([...artists, item])
    }
  };

  const handleRemoveArtist = (item) => {
    const updatedItems = artists.filter((a) => a !== item);
    handleUpdateArtists(updatedItems)
  };

  const handleSearch = async () => {
    if (searchTerm.trim() !== '') {
      try {
        setIsLoading(true)
        const result = await getSpotifyArtist(searchTerm.toLowerCase())
        setSearchResults(result.artists)
      } catch (error) {
        console.log(error)
      }
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="list-box">
        <h2>My Top 3 Artists</h2>
        <div>
          <Button variant="contained" color="primary" onClick={handleOpenEdit}>
            Edit
          </Button>
          <List>
            {artists.map((item, index) => {
              return (
                <>
                  <ListItem key={item.id}>
                    <img src={item.artist_image_id} alt="" className="image" />
                    <Typography style={{marginRight: "12px"}}>{item.artist_name}</Typography>
                    <Typography style={{fontStyle: "italic"}}>{item.artist_genres}</Typography>
                  </ListItem>
                  {index !== artists.length - 1 && <Divider />}
                </>
            )})}
          </List>
        </div>
      </div>
      <Dialog open={isEditing} onClose={handleCloseEdit} maxWidth="xs">
        <DialogTitle>Edit Artists</DialogTitle>
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
                  return (
                    <>
                      <ListItem key={item.id}>
                          <img src={item.artist_image_id} alt="" className="image" />
                          {item.artist_name}
                          <ListItemSecondaryAction>
                            <IconButton onClick={() => handleAddArtist(item)}>+</IconButton>
                          </ListItemSecondaryAction>
                      </ListItem>
                      {index !== searchResults.length - 1 && <Divider />}
                    </>
                  )
                  })}
              </List>
              <List>
                  {artists.map((item, index) => {
                    return (
                      <>
                        <ListItem key={item.id}>
                            <img src={item.artist_image_id} alt="" className="image" />
                            {item.artist_name}
                            <ListItemSecondaryAction>
                            <IconButton onClick={() => handleRemoveArtist(item)}>-</IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                        {index !== artists.length - 1 && <Divider />}
                      </>
                  )})}
              </List>
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

export default EditArtists;