'use client'

import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton  } from "@clerk/nextjs";
import Head from "next/head";
import { AppBar, Toolbar, Typography, Container, Button, Box, Grid } from "@mui/material";


export default function Home() {

  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_sessions', {
      method: 'POST',
      headers: {
        origin: 'http://localhost:3000',
      },
    })

    const checkoutSessionJson = await checkoutSession.json();


    if(checkoutSession.statusCode === 500) {
      console.error(checkoutSession.message)
      return
    }

    const stripe = await getStripe();
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })

    if (error) {
      console.warn(error.message)
    }
  }
  return (
    <Container maxWidth="100vw">
      <Head>
        <title>AI flashcards</title>
        <meta name="description" content="Create flashcard from your text"/>
      </Head>

      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{flexGrow: 1}}>RecallAI</Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in">{' '}Login</Button>
            <Button color="inherit" href="/sign-up">{' '}Sign up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton/>
          </SignedIn>
        </Toolbar>

      </AppBar>
      <Box sx={{
        textAlign: 'center',
        my: 4,
      }}
      >
        <Typography variant="h2" gutterBottom>Welcome to Flashcard SaaS</Typography>
        <Typography variant="h5" gutterBottom>
          {' '}
          Utilize our cutting edge AI to intelligently break down you text into concise flashcards, perfect for studying
        </Typography>
        <Button variant="contained" color="primary" sx={{mt: 2}}>Get Started</Button>
      </Box>
      <Box sx={{my: 6}}>
        <Typography variant="h2" gutterBottom>Features</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>Accessible Anywhere</Typography>
            <Typography>Access your flashcards from any device, at any time. Study on the go with ease</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>Easy Text Input</Typography>
            <Typography>Simply input your text and let our software do the rest. Creating flashcards has never been easier</Typography>
          </Grid>
          <Grid item xs={12} md={4} gutterBottom>
            <Typography variant="h6">Easy Text Input</Typography>
            <Typography>Simply input your text and let our software do the rest. Creating flashcards has never been easier</Typography>
          </Grid>
        </Grid>

      </Box>
      <Box sx={{my: 6, textAlign: 'center'}}>
        <Typography variant="h4" gutterBottom>Pricing</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{
              padding: 3,
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius: 2,
            }}>
              <Typography variant="h5" gutterBottom>Basic</Typography>
              <Typography variant="h6" gutterBottom>$5 / month</Typography>

              <Typography>
                {' '}
                Basic Plan
              </Typography>
              <Button variant="contained" color="primary">
                Choose Basic

              </Button>
              
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{
              padding: 3,
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius: 2,
            }}>
              <Typography variant="h5" gutterBottom>Pro</Typography>
              <Typography variant="h6" gutterBottom>$10 / month</Typography>

              <Typography>
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

    </Container>
  )
}
