import React, { useEffect, useState } from 'react';
import { Button, Modal, TextField, List, ListItem, ListItemSecondaryAction, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, LinearProgress, Stack, makeStyles, Divider, Typography } from '@mui/material';
import { getSpotifyArtist } from "../API Modules/searchSpotifyArtist";
import './EditItems.css'

interface EditArtistsProps {
  handleUpdateArtists: (artists: any) => void
}

function EditArtists({handleUpdateArtists}: EditArtistsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
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
    if (selectedItems.length < 3 && !selectedItems.includes(item)) {
      setSelectedItems([...selectedItems, item]);
      handleUpdateArtists([...selectedItems, item])
    }
  };

  const handleRemoveArtist = (item) => {
    const updatedItems = selectedItems.filter((a) => a !== item);
    setSelectedItems(updatedItems);
    handleUpdateArtists(updatedItems)
  };

  const handleSearch = async () => {
    if (searchTerm.trim() !== '') {
      try {
        setIsLoading(true)
        const result = await getSpotifyArtist(searchTerm.toLowerCase())
        setSearchResults(result.artists["items"])
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
            {selectedItems.map((item, index) => {
              const imageUrl = item.images && item.images.length > 0 ? item.images[0].url : ""
              return (
                <>
                  <ListItem key={item.id}>
                    <img src={imageUrl} alt="" className="image" />
                    <Typography style={{marginRight: "12px"}}>{item.name}</Typography>
                    <Typography style={{fontStyle: "italic"}}>{item.genres.join(", ")}</Typography>
                  </ListItem>
                  {index !== selectedItems.length - 1 && <Divider />}
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
                  const imageUrl = item.images && item.images.length > 0 ? item.images[0].url : ""
                  return (
                    <>
                      <ListItem key={item.id}>
                          <img src={imageUrl} alt="" className="image" />
                          {item.name}
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
                  {selectedItems.map((item, index) => {
                    const imageUrl = item.images && item.images.length > 0 ? item.images[0].url : ""
                    return (
                      <>
                        <ListItem key={item.id}>
                            <img src={imageUrl} alt="" className="image" />
                            {item.name}
                            <ListItemSecondaryAction>
                            <IconButton onClick={() => handleRemoveArtist(item)}>-</IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                        {index !== selectedItems.length - 1 && <Divider />}
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