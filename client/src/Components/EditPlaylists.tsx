import React, { useEffect, useState } from 'react';
import { Button, Modal, TextField, List, ListItem, ListItemSecondaryAction, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, LinearProgress, Stack, makeStyles, Divider, Typography } from '@mui/material';
import { getUserPlaylist } from "../API Modules/searchUserPlaylist";
import './EditItems.css'

interface EditPlaylistsProps {
  handleUpdatePlaylist: (playlist:any) => void
}

function EditPlaylists({handleUpdatePlaylist}: EditPlaylistsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [filteredResults, setFilteredResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleOpenEdit = async () => {
    setIsEditing(true);
    try {
        setIsLoading(true)
        const result = await getUserPlaylist()
        setSearchResults(result.items)
        setFilteredResults(result.items)
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
    setSelectedItem(item);
    handleUpdatePlaylist(item)
  };

  const handleRemovePlaylist = () => {
    setSelectedItem(null);
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
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredResults(filtered);
        setIsLoading(false)
    }
  }

  return (
    <>
      <div className="list-box">
        <h2>My Intro Playlist</h2>
        <div style={{marginBottom: "10px"}}>
          <Button variant="contained" color="primary" onClick={handleOpenEdit}>
            Edit
          </Button>
        </div>
        {selectedItem && (
            <>
                {selectedItem.description && <Typography className='body1'><strong>Description: </strong>{selectedItem.description}</Typography>}
                <iframe 
                    title="" 
                    src={`https://open.spotify.com/embed/playlist/${selectedItem.id}?utm_source=generator`} 
                    width="100%" 
                    height="352" 
                    frameBorder="0" 
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                    loading="lazy">
                </iframe>
            </>)}
      </div>
      <Dialog open={isEditing} onClose={handleCloseEdit} maxWidth="xs">
        <DialogTitle>Edit Playlist</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <TextField
                onChange={handleInputChange}
                fullWidth
                />
                <Button variant="contained" color="primary" onClick={handleSearch}>
                    Search
                </Button>
              <List className='display-results'>
                  {isLoading && <LinearProgress />}
                  {filteredResults.map((item, index) => {
                  const imageUrl = item.images && item.images.length > 0 ? item.images[0].url : ""
                  return (
                    <>
                      <ListItem key={item.id}>
                          <img src={imageUrl} alt="" className="image" />
                          {item.name}
                          <ListItemSecondaryAction>
                            <IconButton onClick={() => handleAddPlaylist(item)}>+</IconButton>
                          </ListItemSecondaryAction>
                      </ListItem>
                      {index !== filteredResults.length - 1 && <Divider />}
                    </>
                  )
                  })}
              </List>
              {selectedItem && <List>
                <ListItem key={1}>
                    <img src={selectedItem.images[0].url} alt="" className="image" />
                    {selectedItem.name}
                    <ListItemSecondaryAction>
                    <IconButton onClick={handleRemovePlaylist}>-</IconButton>
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

export default EditPlaylists;