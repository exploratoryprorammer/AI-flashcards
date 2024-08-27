'use client'

import { useEffect, useState } from "react"
import getStripe from "@/utils/get-stripe"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { Box, CircularProgress, Container, Typography } from "@mui/material"
import { connectFirestoreEmulator } from "firebase/firestore"

const ResultPage = () => {
    const searchParams = useSearchParams()
    const session_id = searchParams.get('session_id')
    console.log(session_id)



    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchCheckoutSession = async () => {
            if(!session_id) return;
            try{
                console.log("sessiondat");
                const res = await fetch(`/api/checkout_sessions?session_id=${session_id}`)
                const sessionData = await res.json()
                console.log("sessiondat");
                if (res.ok){
                    setSession(sessionData)
                    
                }
                else{
                    setError(sessionData.error)
                }
                console.log('yes')

            }
            catch(err){
                setError('Error')
                console.log('nah')
            }
            finally {
                setLoading(false);
            }
        }
        fetchCheckoutSession()
    }, [session_id]);

    if(loading) {
        return (
        <Container
        maxWidth="100vw"
        sx={{
            textAlign: 'center',
            mt: 4,
        }}>
            <CircularProgress/>
            <Typography variant="h6">Loading...</Typography>
        </Container>
        )
    }
    if(error) {
        return (
            <Container
        maxWidth="100vw"
        sx={{
            textAlign: 'center',
            mt: 4,
        }}>
            <Typography variant="h6">{error}</Typography>

            </Container>
        )
    }
    return(
        <Container
        maxWidth="100vw"
        sx={{
            textAlign: 'center',
            mt: 4,
        }}>
            {console.log("session: --->", session)}
            {session.payment_status === "paid" ? (
                <>
                    <Typography variant="h4">Thank you for purchasing.</Typography>
                    <Box sx={{mt:22}}>
                        <Typography variant="h4"> Session ID: {session_id}</Typography>
                        <Typography variant="body1">We recieved you parent. You will recieve an email with you order reciept shortly</Typography>
                    </Box>
                </>
                ) :
                (
                    <>
                    <Typography variant="h4">Payment Failed.{session.status}</Typography>
                    <Box sx={{mt:22}}>
                        <Typography variant="body1">Payment Failed. Try Again</Typography>
                    </Box>
                </>
                )
            }
        </Container>
    )
}

export default ResultPage;