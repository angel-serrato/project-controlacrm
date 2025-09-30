import { Box, Container, Typography } from "@mui/material";
import comingSoonImage from "../assets/LogoControlaCRM.png";

function ComingSoon() {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "background.default",
                textAlign: "center",
                px: 2,
            }}
        >
            <Container maxWidth="sm">
                {/* Imagen */}
                <Box
                    component="img"
                    src={comingSoonImage}
                    alt="Coming Soon"
                    sx={{
                        width: "100%",
                        maxWidth: 300,
                        mb: 4,
                    }}
                />
                <Typography variant="h3" gutterBottom>
                    Próximamente
                </Typography>
            </Container>
        </Box>
    );
}

export default ComingSoon;
