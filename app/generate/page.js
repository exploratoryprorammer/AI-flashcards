'use client'

import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation";
import { use, useState, useEffect } from "react";
import { Toolbar, AppBar, IconButton, CssBaseline, ThemeProvider, createTheme, Grid, Card, Container, TextField, Typography, Box, Paper, Button, CardActionArea, CardContent, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { db } from "@/firebase";
import { doc, collection, getDoc, setDoc, writeBatch } from "firebase/firestore";
import { ArrowBack, ArrowForward, Home, Folder } from "@mui/icons-material";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";


export default function Generate() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [text, setText] = useState('');
    const [name, setName] = useState('')
    const [open, setOpen] = useState(false);
    const [card, setCard] = useState(0);
    const router = useRouter();

    useEffect(() => {
        if (isLoaded && !user) {
            router.push('/sign-in');
        }
    }, [isLoaded, user, router]);

    const theme = createTheme({
        typography: {
            fontFamily: '"Inter", "Arial", sans-serif',
        },
    })


    const handleSubmit = async () => {
        fetch('api/generate', {
            method: 'POST',
            body: text,
        })
            .then((res) => res.json())
            .then(data => setFlashcards(data))

    }

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))

    }

    const nextcard = () => {
        setCard((prevIndex) => (prevIndex + 1) % flashcards.length);
        console.log(card);
    }

    const prevcard = () => {
        setCard((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length)
        console.log(card);

    }

    const handleOpen = () => {
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    }

    const saveFlashcards = async () => {
        if (!name) {
            alert('Please enter a name')
            return
        }

        const batch = writeBatch(db)
        const userDocRef = doc(collection(db, 'users'), user.id)
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
            const collections = docSnap.data().flashcards || []
            if (collections.find((f) => f.name === name)) {
                alert('Flashcard collection with the same name already in Database');
                return;

            }
            else {
                collections.push({ name })
                batch.set(userDocRef, { flashcards: collections }, { merge: true });
            }

        }
        else {
            batch.set(userDocRef, { flashcards: [{ name }] })
        }

        const colRef = collection(userDocRef, name);
        flashcards.forEach((flashcard) => {
            const cardDocRef = doc(colRef)
            batch.set(cardDocRef, flashcard);
        })

        await batch.commit()
        handleClose()
        router.push('/flashcards')

    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />

            <Box sx={{
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
                            onClick={() => router.push('/')}
                            sx={{ mr: 2 }}
                        >
                            <Home sx={{ fontSize: 30 }} />
                        </IconButton>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={() => router.push('/flashcards')}
                            sx={{ mr: 2 }}
                        >
                            <Folder sx={{ fontSize: 30 }} />
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
                <Container maxWidth="md">
                    <Box
                        sx={{
                            mt: 4,
                            mb: 6,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Typography variant="h4" mb={2}>Generate Flashcards</Typography>
                        <TextField
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            label="Enter text to produce flashcards"
                            fullWidth
                            multiline
                            rows={4}
                            variant="outlined"
                            sx={{
                                backgroundColor: 'white',
                                borderRadius: '10px',
                                mb: 2,
                                backgroundColor: 'white',
                                borderRadius: '10px',
                                mb: 2,

                            }}
                        ></TextField>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            fullWidth
                            sx={{
                                borderRadius: '10px',
                                border: '2px solid white',
                                color: 'black',
                                backgroundColor: 'white',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.8)'
                                }
                            }}


                        >{' '}Submit</Button>
                    </Box>
                    {flashcards.length > 0 && (
                        <Box sx={{
                            marginTop: '-130px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '80vh', // Adjust this height if needed
                        }}>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                                maxWidth: '1100px',
                                position: 'relative',
                                height: '400px', // Fixed height for the card container
                            }}>
                                <IconButton
                                    onClick={prevcard}
                                    sx={{
                                        position: 'absolute',
                                        left: 0,
                                        backgroundColor: 'white',
                                        zIndex: 1,
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
                                    }}
                                >
                                    <ArrowForward />
                                </IconButton>
                            </Box>
                            <Box sx={{
                                mt: 4,
                                display: 'flex',
                                justifyContent: 'center',
                            }}>
                                <Button variant="contained" color="secondary" onClick={handleOpen}>
                                    Save
                                </Button>
                            </Box>
                        </Box>
                    )}


                    <Dialog open={open} onClose={handleClose}>
                        <DialogTitle>Save Flashcards</DialogTitle>
                        <DialogContent>
                            {/* <DialogContentText>
                    Please enter a name for your flashcards collection
                </DialogContentText> */}
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Collection Name"
                                type="text"
                                fullWidth
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                variant="outlined"></TextField>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Close</Button>
                            <Button onClick={saveFlashcards}>Save</Button>
                        </DialogActions>
                    </Dialog>
                </Container>
            </Box>
        </ThemeProvider>
    )






}