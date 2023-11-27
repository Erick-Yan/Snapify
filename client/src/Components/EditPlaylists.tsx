import React, { useEffect, useState } from 'react';
import { Button, Modal, TextField, List, ListItem, ListItemSecondaryAction, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, LinearProgress, Stack, makeStyles, Divider } from '@mui/material';
import { getUserPlaylist } from "../API Modules/searchUserPlaylist";
import './EditItems.css'

function EditPlaylists() {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleOpenEdit = async () => {
    setIsEditing(true);
    try {
        setIsLoading(true)
        const result = await getUserPlaylist()
        console.log(result.items)
        setSearchResults(result.items)
      } catch (error) {
        console.log(error)
      }
      setIsLoading(false)
  };

  const handleCloseEdit = () => {
    setSearchResults([])
    setSearchTerm("")
    setIsEditing(false);
  };

  const handleAddPlaylist = (item) => {
    console.log(item)
    console.log(item.uri)
    setSelectedItem(item);
  };

  const handleRemovePlaylist = () => {
    setSelectedItem(null);
  };

  return (
    <>
      <div className="list-box">
        <h2>My Intro Playlist</h2>
        <div>
          <Button variant="contained" color="primary" onClick={handleOpenEdit}>
            Edit
          </Button>
        </div>
        {selectedItem && <iframe title="" src={`https://open.spotify.com/embed/playlist/${selectedItem.id}?utm_source=generator`} width="100%" height="352" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>}
      </div>
      <Dialog open={isEditing} onClose={handleCloseEdit} maxWidth="xs">
        <DialogTitle>Edit Playlist</DialogTitle>
        <DialogContent>
          <DialogContentText>
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
                            <IconButton onClick={() => handleAddPlaylist(item)}>+</IconButton>
                          </ListItemSecondaryAction>
                      </ListItem>
                      {index !== searchResults.length - 1 && <Divider />}
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