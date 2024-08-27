'use client'
import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import {collection, CollectionReference, doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/firebase"
import { IconButton, AppBar, Toolbar, Grid, Card, Container, TextField, Typography, Box, Paper, Button, CardActionArea, CardContent, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { ArrowBack, ArrowForward, Home, HPlusMobiledata } from "@mui/icons-material";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"

export default function Flashcard() {
    // const {isLoaded, user} = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const router = useRouter();
    const { isSignedIn } = useAuth(); 

    // useEffect(() => {
    //     if (isLoaded && !user) {
    //         router.push('/sign-in');
    //     }
    // }, [isLoaded, user, router]);



    useEffect(()=> {
        async function getFlashcards() {
            if(!user) return
            const docRef = doc(collection(db,'users'), user.id);
            const docSnap = await getDoc(docRef);

            if(docSnap.exists()) {
                const collections = docSnap.data().flashcards || []
                setFlashcards(collections);
            }
            else {
                await setDoc(docRef, {flashcards: []});
            }
        }
        getFlashcards()
    }, [user])

    

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`)
    }
    return (
    <Container maxWidth="100vw" sx={{
        backgroundImage: "url('https://news.mit.edu/sites/default/files/images/202211/MIT-Neural-Networks-01.gif')",
        backgroundSize: 'cover',
        color: 'white',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',


      }} >
        <AppBar position="static" color="transparent" sx={{ mt: 2 }}>
            <Toolbar variant="dense">
                <IconButton
                    edge="start"
                    color="inherit"
                    onClick={() => router.push('/generate')} 
                    sx={{ mr: 2 }}
                >
                    <ArrowBack sx={{ fontSize: 30 }} /> 
                </IconButton>
                <Typography variant="h5" style={{ flexGrow: 1 }}></Typography>
                <SignedOut>
                    <Button color="inherit" onClick={(e) => { e.preventDefault(); router.push("/sign-in") }}>{' '}Login</Button>
                    <Button color="inherit" onClick={(e) => { e.preventDefault(); router.push("/sign-up") }} sx={{
                        borderRadius: '10px',
                        border: '2px solid white',
                        color: 'black',
                        backgroundColor: 'white',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.8)'
                        }
                    }}>{' '}Sign up</Button>
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </Toolbar>
        </AppBar>
        <Grid container spacing={3} sx={{
            mt: 4
        }}>
            {flashcards.map((flashcard, index)=> (
                <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card>
                        <CardActionArea
                        onClick={() => {
                            handleCardClick(flashcard.name)
                        }}>
                            <CardContent>
                                <Typography variant="h6">
                                    {flashcard.name}
                                </Typography>

                            </CardContent>
                        </CardActionArea>
                        
                    </Card>
                </Grid>
            ))}
        </Grid>
    </Container>)

}