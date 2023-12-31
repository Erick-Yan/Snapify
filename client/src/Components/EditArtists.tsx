import React, { useState } from 'react';
import { Button, TextField, List, ListItem, ListItemSecondaryAction, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, LinearProgress, Stack, makeStyles, Divider, Typography } from '@mui/material';
import { getSpotifyArtist } from "../API Modules/searchSpotifyArtist";
import './EditItems.css'
import SpotifyButton from './SpotifyButton';

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
          <SpotifyButton text="EDIT" color="green" clickButton={handleOpenEdit} />
          <List>
            <Divider style={{backgroundColor: "#1DB954"}} />
            {artists.map((item, index) => {
              return (
                <>
                  <ListItem key={item.id}>
                    <img src={item.artist_image_id} alt="" className="image" />
                    <h4 style={{marginRight: "12px"}}>{item.artist_name}</h4>
                    <p style={{fontStyle: "italic"}}>{item.artist_genres}</p>
                  </ListItem>
                  {index !== artists.length - 1 && <Divider style={{backgroundColor: "#1DB954"}} />}
                </>
            )})}
          </List>
        </div>
      </div>
      <Dialog open={isEditing} onClose={handleCloseEdit} maxWidth="xs">
        <DialogTitle sx={{paddingY: "0"}}>
          <h2>Edit Artists</h2>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <TextField
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
            />
              <SpotifyButton text="SEARCH" color="green" clickButton={handleSearch} />
              <List className='display-results'>
                  {isLoading && <LinearProgress />}
                  {searchResults.map((item, index) => {
                  return (
                    <>
                      <ListItem key={item.id}>
                          <img src={item.artist_image_id} alt="" className="image" />
                          <h4 style={{ fontFamily: "sans-serif" }}>{item.artist_name}</h4>
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
                            <h4 style={{ fontFamily: "sans-serif" }}>{item.artist_name}</h4>
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
        <DialogActions style={{display: "flex", flexDirection: "column" }}>
          <SpotifyButton text="DONE" color="green" clickButton={handleCloseEdit} />
          <h5>*3 artists max</h5>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default EditArtists;