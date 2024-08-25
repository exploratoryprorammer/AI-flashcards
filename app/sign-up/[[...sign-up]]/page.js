import { SignIn, SignUp } from "@clerk/nextjs";
import { AppBar, Button, Container, Toolbar, Typography, Link, Box } from "@mui/material";

export default function SignUpPage() {
    return (
    <Container maxWidth="sm">
        <AppBar position="static" sx={{backgroundColor: "#3f51b5"}}>
            <Toolbar>
                <Typography variant="h6" sx={{
                    flexGrow: 1
                }}>
                    Flashcard SaaS
                </Typography>
                <Button color="inherit">
                <Link href="/login" passHref>Login</Link>
                </Button>
                <Button color="inherit">
                <Link href="/sign-up" passHref>Sign Up</Link>
                </Button>
            </Toolbar>
        </AppBar>
        <Box
         display = "flex"
         flexDirection = "column"
         alignItems="center"
         justifyContent="center"
        >
            <Typography variant="h4">Sign Un</Typography>
            <SignUp/>
        </Box>

    </Container>
    );
}