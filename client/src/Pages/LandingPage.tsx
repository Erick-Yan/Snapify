import React, {useEffect} from "react"
import { CheckAuthMutation } from "../API Modules/checkAuth"
import { useSelector } from 'react-redux'
import { Button, LinearProgress, Stack } from "@mui/material"
import { useNavigate } from 'react-router-dom';

function LandingPage() {
    const navigate = useNavigate()
    const LOGIN_URI = "/auth/login"
    const LOGOUT_URI = "/auth/logout"

    const { mutate: checkAuth, isLoading, isSuccess } = CheckAuthMutation()
    const {isLoggedIn, userId} = useSelector((state:any) => state)

    useEffect(() => {
        checkAuth()
    }, [])

    if (isLoading) {
        return (
            <Stack>
                <h1>Snapify</h1>
                <LinearProgress />
            </Stack>
        )
    }

    return (
    <div>
        <h1>Snapify</h1>
        {isSuccess && !isLoggedIn && (
        <a href={LOGIN_URI}>LOGIN</a>
        )}
        {isSuccess && isLoggedIn && (
        <Stack>
            <a href={LOGOUT_URI}>LOGOUT</a>
            <Button onClick={() => navigate(`/app/${userId}/profile`)} variant="contained" color="success">
                Create/Edit Profile
            </Button>
        </Stack>
        )}
    </div>
    );
}

export default LandingPage;
