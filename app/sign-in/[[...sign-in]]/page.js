import { SignIn } from "@clerk/nextjs";
import { AppBar, Button, Container, Toolbar, Typography, Link, Box } from "@mui/material";

export default function SignUpPage() {
    return (
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
        
        <Box
        marginTop="200px"
         display = "flex"
         flexDirection = "column"
         alignItems="center"
         justifyContent="center"
        >
            <SignIn/>
        </Box>

    </Container>
    );
}