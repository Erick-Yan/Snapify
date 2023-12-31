import React, {useEffect, useRef, useState} from "react";
import { useGetUserProfile } from "../API Modules/getUserProfile";
import { LinearProgress, Stack, Modal, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import './UserProfilePage.css'
import EditProfile from "../Components/EditProfile";
import ViewProfile from "../Components/ViewProfile";
import { useSaveProfile } from "../API Modules/saveProfile";
import SpotifyButton from "../Components/SpotifyButton";

function UserProfilePage() {
    const navigate = useNavigate()
    const saveProfileMutation = useSaveProfile()
    const { data, isLoading, error } = useGetUserProfile()
    const [activeOption, setActiveOption] = useState(1)
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)
    const [confirmedLeaving, setConfirmedLeaving] = useState(false)
    const [profileContainerHeight, setProfileContainerHeight] = useState("0%");

    const [profile, setProfile] = useState<any>(null)
    const [inputtedLyrics, setInputtedLyrics] = useState('')
    const [selectedTrack, setSelectedTrack] = useState<any>(null)
    const [selectedArtists, setSelectedArtists] = useState<any[]>([])
    const [selectedPlaylist, setSelectedPlaylist] = useState<any>(null)

    useEffect(() => {
        if (data) {
            setProfile(data.metadata)
            setInputtedLyrics(data.lyrics || '')
            setSelectedTrack(data.song || null)
            setSelectedArtists(data.artists || [])
            setSelectedPlaylist(data.playlist || null)
        }
    }, [data]);

    const handleInputtedLyricsChange = (newValue) => {
        setInputtedLyrics(newValue);
    };
    
    const handleSelectedTrackChange = (newTrack) => {
        setSelectedTrack(newTrack);
    };
    
    const handleSelectedArtistsChange = (newArtists) => {
        setSelectedArtists(newArtists);
    };
    
    const handleSelectedPlaylistChange = (newPlaylist) => {
        setSelectedPlaylist(newPlaylist);
    };

    const handleOptionClick = (option) => {
        setActiveOption(option);
    }

    const handleSaveModalClose = () => {
        setIsSaveModalOpen(false)
    }

    const handleSaveProfile = () => {
        setIsSaveModalOpen(true)
    }

    const handleConfirmSave = async () => {
        try {
            const data = {
              "lyrics": inputtedLyrics,
              "song": selectedTrack,
              "artists": selectedArtists,
              "playlist": selectedPlaylist,
            }
      
            await saveProfileMutation.mutateAsync(data)
            
            setConfirmedLeaving(true)
            navigate('/app')
          } catch (error) {
            console.error('Error saving profile:', error)
          }
    }

    useEffect(() => {
        const beforeUnloadListener = (ev) => {
            ev.preventDefault();
            ev.returnValue = 'Are you sure you want to leave? All progress will be lost.';
        };

        window.addEventListener("beforeunload", beforeUnloadListener);

        return () => {
            window.removeEventListener("beforeunload", beforeUnloadListener);
        };
    }, []);

    const handleCancelClick = (ev) => {
        if (!confirmedLeaving) {
            ev.preventDefault();
            if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
                navigate("/app");
            }
        }
    };

    const profileContainerRef = useRef<HTMLDivElement>(null);
    // Below used to continuously check for the profile-container reference when the component firsts mounts.
    // When found, we can set the initial height of profile-main to the EditProfile height.
    useEffect(() => {
        let animationFrameId: number;

        const checkContainerRef = () => {
            if (profileContainerRef.current) {
                const editProfileElement = profileContainerRef.current.querySelector('.edit-profile') as HTMLElement | null;

                if (editProfileElement) {
                    const initialHeight = editProfileElement.offsetHeight;
                    setProfileContainerHeight(initialHeight + "px");
                    cancelAnimationFrame(animationFrameId);
                }
            } else {
                animationFrameId = requestAnimationFrame(checkContainerRef);
            }
        };

        animationFrameId = requestAnimationFrame(checkContainerRef);

        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    useEffect(() => {
        const profileContainer = document.querySelector('.profile-container');
        if (profileContainer) {
            const editProfileElement = profileContainer.querySelector('.edit-profile') as HTMLElement | null;
            const viewProfileElement = profileContainer.querySelector('.view-profile') as HTMLElement | null;
            if (editProfileElement && viewProfileElement) {
                const newHeight = activeOption === 1 ? editProfileElement.offsetHeight : viewProfileElement.offsetHeight;
                setProfileContainerHeight(newHeight + "px");
            }
        }
    }, [activeOption]);

    if (error) {
        navigate("/app")
    }

    if (profile === null || isLoading) {
        console.log("Here")
        return (
            <Stack>
                <LinearProgress />
            </Stack>
        )
    }

    return (
        <>
            <Stack className="header">
                <div className="flex-container">
                    <SpotifyButton className="button" clickButton={handleCancelClick} text="CANCEL" color="white" />
                    <h3 className="button name">{profile.user_name}</h3>
                    <SpotifyButton className="button" clickButton={handleSaveProfile} text="DONE" color="white" />
                </div>
                <div className="nav-header">
                    <div
                        className={`nav-option ${activeOption === 1 ? 'active' : ''}`}
                        onClick={() => handleOptionClick(1)}
                    >
                        Edit
                    </div>
                    <div
                        className={`nav-option ${activeOption === 2 ? 'active' : ''}`}
                        onClick={() => handleOptionClick(2)}
                    >
                        View
                    </div>
                </div>
            </Stack>
            <div className="profile-main" style={{ height: profileContainerHeight }}>
                <div className="profile-container" ref={profileContainerRef}>
                    <div className={`edit-profile ${activeOption === 1 ? 'slide-right' : 'slide-left'}`}>
                        <EditProfile 
                            profileImageUrl={profile.user_image_id}
                            handleUpdateLyrics={handleInputtedLyricsChange}
                            handleUpdateSong={handleSelectedTrackChange}
                            handleUpdateArtists={handleSelectedArtistsChange}
                            handleUpdatePlaylist={handleSelectedPlaylistChange}
                            lyrics={inputtedLyrics}
                            song={selectedTrack}
                            artists={selectedArtists}
                            playlist={selectedPlaylist}
                        />
                    </div>
                    <div className={`view-profile ${activeOption === 2 ? 'slide-left' : 'slide-right'}`}>
                        <ViewProfile 
                            profile={profile}
                            lyrics={inputtedLyrics}
                            song={selectedTrack}
                            artists={selectedArtists}
                            playlist={selectedPlaylist}
                        />
                    </div>
                </div>
            </div>
            <Modal
                open={isSaveModalOpen}
                onClose={handleSaveModalClose}
                aria-labelledby="save-profile-modal"
                aria-describedby="save-profile-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        p: 4,
                    }}
                >
                    <h2 id="save-profile-modal">Confirm Save</h2>
                    <p id="save-profile-description">Are you sure you want to save your profile?</p>
                    <Button onClick={handleConfirmSave}>Yes, Save</Button>
                    <Button onClick={handleSaveModalClose}>Cancel</Button>
                </Box>
            </Modal>
        </>
    );
}

export default UserProfilePage;
