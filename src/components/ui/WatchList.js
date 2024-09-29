import AddIcon from '@mui/icons-material/Add';
import ListIcon from '@mui/icons-material/List';
import { Badge, Box, Button, Card, CardContent, Grid, IconButton, Typography, useTheme } from '@mui/material';

const WatchList = () => {
    const theme = useTheme();

    return (
        <Box sx={{ maxWidth: 350 }}>
            <Typography variant="overline" display="block" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.text.secondary, fontSize: '0.75rem' }}>
                YOUR LISTS
            </Typography>

            <Grid container alignItems="center" spacing={2}>
                <Grid item>
                    <Card
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            p: 1.2,
                            borderRadius: '8px',
                            boxShadow: 'none',
                            border: `1px solid ${theme.palette.divider}`,
                            width: 200,
                            backgroundColor: theme.palette.background.paper,
                        }}
                    >
                        <IconButton sx={{ backgroundColor: theme.palette.action.hover, mr: 1, p: 0.8 }}>
                            <ListIcon fontSize="small" />
                        </IconButton>
                        <CardContent sx={{ padding: '4px 0', flexGrow: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                Watchlist
                            </Typography>
                        </CardContent>
                        <Badge
                            badgeContent={0}
                            color="default"
                            sx={{
                                ml: 'auto',
                                mr: 2,
                                '& .MuiBadge-badge': {
                                    fontSize: '0.75rem',
                                    backgroundColor: theme.palette.background.default,
                                    color: theme.palette.text.secondary,
                                },
                            }}
                        />
                    </Card>
                </Grid>

                <Grid item>
                    <Button
                        variant="text"
                        startIcon={<AddIcon />}
                        sx={{
                            color: theme.palette.primary.main,
                            fontWeight: 500,
                            textTransform: 'none',
                            fontSize: '0.875rem',
                        }}
                    >
                        New list
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default WatchList;
