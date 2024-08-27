'use client'

import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Head from "next/head";
import { AppBar, Toolbar, Typography, Container, Button, Box, Grid, CssBaseline } from "@mui/material";
import {createTheme, ThemeProvider} from '@mui/material/styles';
import '@fontsource/inter';
import { useRouter } from "next/navigation";




export default function Home() {
  const router = useRouter();

  const theme = createTheme({
    typography: {
      fontFamily: '"Inter", "Arial", sans-serif',
    }
  })

  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_sessions', {
      method: 'POST',
      headers: {
        origin: 'https://memora-nu.vercel.app/',
      },
    })

    const checkoutSessionJson = await checkoutSession.json();


    if (checkoutSession.statusCode === 500) {
      console.error(checkoutSession.message)
      return
    }

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })

    if (error) {
      console.warn(error.message)
    }

  }
  return (
    <ThemeProvider theme={theme}>
    <CssBaseline/>
    <Container
      maxWidth="100vw"
      sx={{
        backgroundImage: "url('https://news.mit.edu/sites/default/files/images/202211/MIT-Neural-Networks-01.gif')",
        backgroundSize: 'cover',
        color: 'white',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',


      }}>
      <Head>
        <title>AI flashcards</title>
        <meta name="description" content="Create flashcard from your text" />

      </Head>


        <AppBar position="static" color="transparent" sx={{mt: 2}}>
          <Toolbar variant="dense">
            <Typography variant="h5" style={{ flexGrow: 1 }}>MEMORA</Typography>
            <SignedOut>
              <Button color="inherit" onClick={ (e) => {e.preventDefault(); router.push("/sign-in")}}>{' '}Login</Button>
              <Button color="inherit" onClick={ (e) => {e.preventDefault(); router.push("/sign-up")}} sx={{
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
      
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        overflow: 'hidden',
      }}>
      <Box sx={{
        textAlign: 'center',
        verticalAlign: 'center',
        my: 4,
      }}
      >
        <Typography variant="h2" gutterBottom>Welcome to MemoraAI</Typography>
        <Typography variant="h5" gutterBottom>
          {' '}
          Utilize our cutting edge AI to intelligently break down your text into concise flashcards, perfect for studying
        </Typography>
        <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        gap={2}
        >
        <Button variant="contained" color="primary" sx={{
                mt: 2,
                borderRadius: '10px',
                border: '2px solid white',
                color: 'black',
                backgroundColor: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.8)'
                }

              }} onClick={ (e) => {e.preventDefault(); router.push("/generate")}}>Get Started</Button>
        <Button variant="contained" color="primary" sx={{
                mt: 2,
                borderRadius: '10px',
                border: '2px solid white',
                color: 'black',
                backgroundColor: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.8)'
                }

              }} onClick={handleSubmit}>Donate</Button>
              </Box>
      </Box>
      
      {/* <Box sx={{ 
        my: 6, 
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center', 
        }}>
        <Typography variant="h5" gutterBottom>Unlimited Flashcards Generation & Saves for $5/month</Typography>
        <Typography gutterBottom>
                {' '}
              </Typography>
              <Button variant="contained" color="primary"  sx={{
                borderRadius: '10px',
                border: '2px solid white',
                color: 'black',
                backgroundColor: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.8)'
                }

              }} onClick={handleSubmit}>
                Choose Pro

              </Button>
        {/* <Grid container>
          <Grid item xs={12} md={6}>
            <Box sx={{
              padding: 3,
              borderColor: 'grey.300',
              borderRadius: 2,
            }}>
              <Typography variant="h5" gutterBottom>Pro</Typography>
              <Typography variant="h6" gutterBottom>$5 / month</Typography>

              <Typography gutterBottom>
                {' '}
                Unlimited Everything
              </Typography>
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                Choose Pro

              </Button>

            </Box>
          </Grid>
        </Grid>

      </Box> 
      */}
      </Box>

    </Container>
    </ThemeProvider>

  )
}
