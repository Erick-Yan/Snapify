import React, { useEffect, useState } from "react";
import { Stack, LinearProgress } from "@mui/material";
import '../Components/ViewProfile.css'
import { useNavigate, useParams } from "react-router-dom";
import ViewProfile from "../Components/ViewProfile";
import { useGetPublicUserProfile } from "../API Modules/getPublicUserProfile";
import { useGetPublicUserProfileMatches } from "../API Modules/getPublicUserProfileMatches";
import UserHeader from "../Components/UserHeader";
import { followUser } from "../API Modules/followUser";

function UserProfilePublicPage() {
    const { publicId } = useParams();
    const getPublicUserProfileQuery = useGetPublicUserProfile({"user_page_id": publicId})
    const getPublicUserProfileMatchesQuery = useGetPublicUserProfileMatches({"user_page_id": publicId})
    const publicUserProfileData = getPublicUserProfileQuery.data
    const publicUserProfileLoading = getPublicUserProfileQuery.isLoading
    const publicUserProfileError = getPublicUserProfileQuery.error
    const publicUserProfileMatchesData = getPublicUserProfileMatchesQuery.data
    
    const handleFollow = async () => {
        return followUser({"user_page_id": publicId});
    };

    const navigate = useNavigate()

    const [profile, setProfile] = useState<any>(null)
    const [lyrics, setLyrics] = useState('')
    const [song, setSong] = useState<any>(null)
    const [artists, setArtists] = useState<any[]>([])
    const [playlist, setPlaylist] = useState<any>(null)
    const [songMatches, setSongMatches] = useState<any>(false)
    const [artistMatches, setArtistsMatches] = useState<any[]>([])
    const [playlistSongMatches, setPlaylistSongMatches] = useState<any[]>([])
    const [following, setFollowing] = useState(false)

    useEffect(() => {
        if (publicUserProfileData) {
            setProfile(publicUserProfileData.metadata)
            setLyrics(publicUserProfileData.lyrics?.lyrics || '')
            setSong(publicUserProfileData.song || null)
            setArtists(publicUserProfileData.artists || [])
            setPlaylist(publicUserProfileData.playlist || null)
            setFollowing(publicUserProfileData.following || false)
        }
        if (publicUserProfileMatchesData) {
            setSongMatches(publicUserProfileMatchesData.song_match)
            setArtistsMatches(publicUserProfileMatchesData.artists_matches || [])
            setPlaylistSongMatches(publicUserProfileMatchesData.playlist_song_matches || [])
        }
    }, [publicUserProfileData, publicUserProfileMatchesData]);

    if (publicUserProfileError) {
        navigate("/app")
    }

    if (profile === null || publicUserProfileLoading) {
        return (
            <Stack>
                <LinearProgress
                    sx={{
                        '&.MuiLinearProgress-root': {
                            backgroundColor: '#040306',
                        },
                        '& .MuiLinearProgress-bar': {
                            backgroundColor: '#1DB954',
                        },
                    }}
                />
            </Stack>
        )
    }

    return (
        <div style={{background: "#181818"}}>
            <UserHeader username={profile.user_name} userActive={profile.user_active} />
            <ViewProfile 
                profile={profile}
                lyrics={lyrics}
                song={song}
                artists={artists}
                playlist={playlist}
                following={following}
                songMatches={songMatches}
                artistsMatches={artistMatches}
                playlistSongMatches={playlistSongMatches}
                handleFollow={handleFollow}
            />
        </div>
    );
};


export default UserProfilePublicPage;
