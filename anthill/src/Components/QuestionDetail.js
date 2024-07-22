import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Grid, Paper, Box, Typography, TextField, Button, Divider, List, ListItem, ListItemText, Collapse, Chip, ListItemButton } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useEmail } from './EmailContext';


import axios from 'axios';
import snippets from '../snippets.json'


const QuestionDetail = ()  => {
    const { email } = useEmail();
    const { id } = useParams(); // Use useParams to get the id from the URL
    const [snippet, setSnippet] = useState('');
    const [language, setLanguage] = useState('JavaScript');
    const [description, setDescription] = useState('');
    const [openEasy, setOpenEasy] = useState(true);
    const [openMedium, setOpenMedium] = useState(true);
    const [openHard, setOpenHard] = useState(true);
    const [resultMessage, setResultMessage] = useState('');

      
    useEffect(() => {
        const fetchSnippet = () => {
          const key = `snippet${id}`;
    
          if (snippets.hasOwnProperty(key)) {
            const snippetData = snippets[key];
            if (snippetData) {
              setSnippet(language === 'JavaScript' ? snippetData.javascript : snippetData.python);
            }
          } else {
            console.error(`Snippet with key ${key} not found.`);
          }
        };
    
        fetchSnippet();
      }, [id, language]); // Dependencies array
      

    const [previousAttempts] = useState([
        {
            id: 1,
            timestamp: '12:30, 01/01/2023',
            description: 'A function called foo that takes two integer arguments a and b and returns them added together.',
            score: '4/5'
        },
        {
            id: 2,
            timestamp: '14:45, 02/01/2023',
            description: 'A function called foo that takes two integer arguments a and b and returns the sum of a and b.',
            score: '5/5'
        }
    ]);

    const handleLanguageToggle = (lang) => {
        setLanguage(lang);
        setSnippet(language === 'JavaScript' ? snippets[`snippets${id}`].javascript : snippets[`snippets${id}`].python);
    };


    const handleSubmit = async () => {
        try {
            const response = await axios.post(`http://localhost:3001/question/${id}`, {
                email: email,
                prompt: description,
                question: id
            });
            console.log('Response:', response.data);
            setResultMessage(response.data); // Set the result message from the response
        } catch (error) {
            console.error('Error submitting description:', error);
            setResultMessage('Error submitting description. Please try again.');
        }
    };

    const handleToggle = (difficulty) => {
        switch (difficulty) {
            case 'Easy':
                setOpenEasy(!openEasy);
                break;
            case 'Medium':
                setOpenMedium(!openMedium);
                break;
            case 'Hard':
                setOpenHard(!openHard);
                break;
            default:
                break;
        }
    };

    return (
        <Container>
            <Grid container spacing={2}>
                <Grid item xs={2}>
                    <Paper elevation={3} style={{ padding: 16 }}>
                        <Typography variant="h6">Questions</Typography>
                        {/* <Typography variant="body1">User Email: {email}, id {id}</Typography> */}
                        <Divider />
                        <List>
                            <ListItemButton onClick={() => handleToggle('Easy')} style={{ backgroundColor: '#d9f7be' }}>
                                <ListItemText primary="Easy" />
                                {openEasy ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                            <Collapse in={openEasy} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    <ListItem button>
                                        <ListItemText primary="Question 1" />
                                    </ListItem>
                                    <ListItem button>
                                        <ListItemText primary="Question 2" />
                                    </ListItem>
                                </List>
                            </Collapse>
                            <ListItemButton onClick={() => handleToggle('Medium')} style={{ backgroundColor: '#fff7e6' }}>
                                <ListItemText primary="Medium" />
                                {openMedium ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                            <Collapse in={openMedium} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    <ListItem button>
                                        <ListItemText primary="Question 3" />
                                    </ListItem>
                                    <ListItem button>
                                        <ListItemText primary="Question 4" />
                                    </ListItem>
                                </List>
                            </Collapse>
                            <ListItemButton onClick={() => handleToggle('Hard')} style={{ backgroundColor: '#ffccc7' }}>
                                <ListItemText primary="Hard" />
                                {openHard ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                            <Collapse in={openHard} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    <ListItem button>
                                        <ListItemText primary="Question 5" />
                                    </ListItem>
                                    <ListItem button>
                                        <ListItemText primary="Question 6"/>
                                    </ListItem>
                                </List>
                            </Collapse>
                        </List>
                    </Paper>
                </Grid>
                <Grid item xs={7}>
                    <Paper elevation={3} style={{ padding: 16 }}>
                        <Typography variant="h6">Question {id}</Typography>
                        <Box mt={2}>
                            <Button variant={language === 'JavaScript' ? 'contained' : 'outlined'} onClick={() => handleLanguageToggle('JavaScript')}>
                                JavaScript
                            </Button>
                            <Button variant={language === 'Python' ? 'contained' : 'outlined'} onClick={() => handleLanguageToggle('Python')} style={{ marginLeft: 8 }}>
                                Python
                            </Button>
                        </Box>
                        <Box mt={2}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                variant="outlined"
                                value={snippet}
                                InputProps={{ readOnly: true }}
                            />
                        </Box>
                        <Box mt={2}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                variant="outlined"
                                placeholder="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Box>
                        <Box mt={2}>
                            <Button variant="contained" onClick={handleSubmit}>Submit</Button>
                        </Box>
                        {resultMessage && (
                            <Box mt={2}>
                                <Paper elevation={1} style={{ padding: 16 }}>
                                    <Typography variant="body1">{resultMessage}</Typography>
                                </Paper>
                            </Box>
                        )}
                        <Box mt={4}>
                            <Typography variant="h6">Previous Attempts for {email}</Typography>
                            {previousAttempts.map(attempt => (
                                <Box key={attempt.id} mt={2}>
                                    <Paper elevation={1} style={{ padding: 16 }}>
                                        <Typography variant="body2">{`Previous Attempt (${attempt.timestamp})`}</Typography>
                                        <Typography variant="body2">{attempt.description}</Typography>
                                        <Chip label={`Score: ${attempt.score}`} />
                                    </Paper>
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={3}>
                    <Paper elevation={3} style={{ padding: 16 }}>
                        <Typography variant="h6">Instructions</Typography>
                        <Typography variant="body2">
                            Read the code snippet on the left and describe what it does in plain English on the right.
                            Click 'Submit' below when you're confident in your answer.
                        </Typography>
                        <Typography variant="body2" style={{ marginTop: 16 }}>
                            Your description will be used to generate a new piece of code, which will be run through some tests.
                            If it passes all of our tests, the code is functionally identical and you get full marks!
                        </Typography>
                        <Typography variant="body2" style={{ marginTop: 16 }}>
                            Your score and attempt will be recorded and displayed below the question box.
                        </Typography>
                        <Typography variant="body2" style={{ marginTop: 16 }}>
                            Note: only put an English description on the right. Submitting code will not count as an attempt and will not be graded.
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default QuestionDetail;