'use client'

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { collection, doc, getDoc, getDocs } from "firebase/firestore"
import { db } from "@/firebase"
import { Link, AppBar, Toolbar, IconButton, Grid, Card, Container, TextField, Typography, Box, Paper, Button, CardActionArea, CardContent, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { ArrowBack, ArrowForward, Home, HPlusMobiledata } from "@mui/icons-material";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation"

import { useSearchParams } from "next/navigation"

export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [card, setCard] = useState(0);

    const searchParams = useSearchParams();
    const search = searchParams.get('id')
    const router = useRouter();

    useEffect(() => {
        if (isLoaded && !user) {
            router.push('/sign-in');
        }
    }, [isLoaded, user, router]);

    useEffect(() => {
        async function getFlashcard() {
            if (!search || !user) return
            const docRef = collection(doc(collection(db, 'users'), user.id), search);
            const docs = await getDocs(docRef);
            const flashcards = []

            docs.forEach((doc) => {
                flashcards.push({ id: doc.id, ...doc.data() })
            })
            setFlashcards(flashcards)
        }
        getFlashcard()
    }, [user, search])

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    if (!isLoaded || !isSignedIn) {
        return <></>
    }

    const nextcard = () => {
        setCard((prevIndex) => (prevIndex + 1) % flashcards.length);
    }

    const prevcard = () => {
        setCard((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length)
    }

    return (
        <Container maxWidth="100vw" sx={{
            backgroundImage: "url('https://news.mit.edu/sites/default/files/images/202211/MIT-Neural-Networks-01.gif')",
            backgroundSize: 'cover',
            color: 'white',
            width: '100vw',
            height: '100vh',
            overflow: 'hidden',


        }}>
            <AppBar position="static" color="transparent" sx={{ mt: 2 }}>
            <Toolbar variant="dense">
                <IconButton
                    edge="start"
                    color="inherit"
                    onClick={() => router.push('/flashcards')} 
                    sx={{ mr: 2 }}
                >
                    <ArrowBack sx={{ fontSize: 30 }} /> 
                </IconButton>
                <IconButton
                    edge="start"
                    color="inherit"
                    onClick={() => router.push('/flashcards')} 
                    sx={{ mr: 2 }}
                >
                    <Home sx={{ fontSize: 30 }} /> 
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
            {flashcards.length > 0 && (
                <Box sx={{
                    marginTop: '40px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '80vh',
                }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        maxWidth: '1100px',
                        position: 'relative',
                        height: '400px',
                    }}>
                        <IconButton
                            onClick={prevcard}
                            sx={{
                                position: 'absolute',
                                left: 0,
                                backgroundColor: 'white',
                                zIndex: 1,
                                '&:hover': {
                                backgroundColor: 'gray',
                                opacity: 0.8,
                            },
                            }}
                        >
                            <ArrowBack />
                        </IconButton>
                        <Card sx={{ width: '100%', maxWidth: '1000px', height: '100%' }}>
                            <CardActionArea onClick={() => handleCardClick(card)} sx={{ height: '100%' }}>
                                <CardContent sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Box sx={{
                                        perspective: '1000px',
                                        width: '100%',
                                        height: '100%',
                                        '& > div': {
                                            transition: 'transform 0.6s',
                                            transformStyle: 'preserve-3d',
                                            position: 'relative',
                                            width: '100%',
                                            height: '100%',
                                            transform: flipped[card] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                        },
                                        '& > div > div': {
                                            position: 'absolute',
                                            width: '100%',
                                            height: '100%',
                                            backfaceVisibility: 'hidden',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            padding: 2,
                                        },
                                        '& > div > div:nth-of-type(2)': {
                                            transform: 'rotateY(180deg)',
                                        },
                                    }}>
                                        <div>
                                            <div>
                                                <Typography variant="h6" component="div">
                                                    {flashcards[card].front}
                                                </Typography>
                                            </div>
                                            <div>
                                                <Typography variant="h6" component="div">
                                                    {flashcards[card].back}
                                                </Typography>
                                            </div>
                                        </div>
                                    </Box>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                        <IconButton
                            onClick={nextcard}
                            sx={{
                                position: 'absolute',
                                right: 0,
                                backgroundColor: 'white',
                                zIndex: 1,
                                '&:hover': {
                                backgroundColor: 'gray',
                                opacity: 0.8,
                            },
                            }}
                        >
                            <ArrowForward />
                        </IconButton>
                    </Box>
                </Box>
            )}

        </Container>

    )


}