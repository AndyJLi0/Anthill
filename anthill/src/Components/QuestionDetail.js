import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Container, Grid, Paper, Box, Typography, TextField, Button, Divider, List, ListItem, ListItemText, Collapse, Chip, ListItemButton, AppBar, Toolbar, Avatar } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useEmail } from './EmailContext';
import userAvatar from './aardvark.png';

import axios from 'axios';
import snippets from '../snippets.json'

import { doc, getDoc, collection } from "firebase/firestore";
import { db, auth } from '../FirebaseConfig';



const QuestionDetail = () => {
    const { email } = useEmail();
    const { id } = useParams(); // Use useParams to get the id from the URL
    const [snippet, setSnippet] = useState('');
    const [language, setLanguage] = useState('JavaScript');
    const [description, setDescription] = useState('');
    const [rationale, setRationale] = useState('');
    const [openEasy, setOpenEasy] = useState(true);
    const [openMedium, setOpenMedium] = useState(true);
    const [openHard, setOpenHard] = useState(true);
    const [resultMessage, setResultMessage] = useState('');
    const [previousAttempts, setPreviousAttempts] = useState([]);
    const navigate = useNavigate();


    // gets the previous attempts from firestore
    const fetchPreviousAttempts = async () => {
        const docRef = doc(db, 'users', email);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            setPreviousAttempts(data.logs || []);
        } else {
            console.log('No such document!');
        }
    };

    // gets the snippet from the json file
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

    // toggles between javascript and python snippets
    const handleLanguageToggle = (lang) => {
        setLanguage(lang);
        const key = `snippet${id}`;
        if (snippets.hasOwnProperty(key)) {
            const snippetData = snippets[key];
            if (snippetData) {
                setSnippet(language === 'JavaScript' ? snippetData.javascript : snippetData.python);    // copied here from above, silences warning
            }
        } else {
            console.error(`Snippet with key ${key} not found.`);
        }
    };


    // submits the description and rationale to the backend
    const handleSubmit = async () => {
        try {
            const response = await axios.post(`http://localhost:3001/question/${id}`, {
                email: email,
                prompt: description,
                question: id,
                rationale: rationale
            });
            console.log('Response:', response.data);
            setResultMessage(response.data);
        } catch (error) {
            console.error('Error submitting description:', error);
            setResultMessage('Error submitting description. Please try again.');
        }

    };

    // toggles the question difficulty
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

    // logs the user out
    const handleLogout = () => {
        auth.signOut().then(() => {
            navigate('/');
        }).catch((err) => {
            console.error(err);
        });
    };

    // formats the timestamp
    const formatTimestamp = (timestamp) => {
        if (timestamp && timestamp.seconds) {
            const date = new Date(timestamp.seconds * 1000);
            return date.toLocaleString(); // Adjust this to your preferred format
        }
        return timestamp;
    };


    useEffect(() => {
        fetchPreviousAttempts();
        fetchSnippet();
    }, [id, language]); // Dependencies array


    return (
        <Container>
            <AppBar position="static" color="default">
                <Toolbar>
                    <Avatar alt="User Picture" src={userAvatar} />
                    <Button color="inherit" onClick={() => navigate(`/`)}>
                        <Typography variant="h7" style={{ flexGrow: 1, marginLeft: 0 }}>
                            Anthill {email}
                        </Typography>
                    </Button>
                    <Button color="inherit" onClick={handleLogout}>Logout</Button>
                </Toolbar>
            </AppBar>
            <Grid container spacing={2}>
                <Grid item xs={2}>
                    <Paper elevation={3} style={{ padding: 16 }}>
                        <Typography variant="h6">Questions</Typography>
                        <Divider />
                        <List>
                            <ListItemButton onClick={() => handleToggle('Easy')} style={{ backgroundColor: '#d9f7be' }}>
                                <ListItemText primary="Easy" />
                                {openEasy ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                            <Collapse in={openEasy} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    <ListItem button onClick={() => navigate(`/question/1`)}>
                                        <ListItemText primary="Question 1" />
                                    </ListItem>
                                    <ListItem button onClick={() => navigate(`/question/2`)}>
                                        <ListItemText primary="Question 2" />
                                    </ListItem>
                                    <ListItem button onClick={() => navigate(`/question/3`)}>
                                        <ListItemText primary="Question 3" />
                                    </ListItem>
                                </List>
                            </Collapse>
                            <ListItemButton onClick={() => handleToggle('Medium')} style={{ backgroundColor: '#fff7e6' }}>
                                <ListItemText primary="Medium" />
                                {openMedium ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                            <Collapse in={openMedium} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    <ListItem button onClick={() => navigate(`/question/4`)}>
                                        <ListItemText primary="Question 4" />
                                    </ListItem>
                                    <ListItem button onClick={() => navigate(`/question/5`)}>
                                        <ListItemText primary="Question 5" />
                                    </ListItem>
                                    <ListItem button onClick={() => navigate(`/question/6`)}>
                                        <ListItemText primary="Question 6" />
                                    </ListItem>
                                </List>
                            </Collapse>
                            <ListItemButton onClick={() => handleToggle('Hard')} style={{ backgroundColor: '#ffccc7' }}>
                                <ListItemText primary="Hard" />
                                {openHard ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                            <Collapse in={openHard} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    <ListItem button onClick={() => navigate(`/question/7`)}>
                                        <ListItemText primary="Question 7" />
                                    </ListItem>
                                    <ListItem button onClick={() => navigate(`/question/8`)}>
                                        <ListItemText primary="Question 8" />
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
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                variant="outlined"
                                placeholder="Rationale"
                                value={rationale}
                                onChange={(e) => setRationale(e.target.value)}
                            />
                        </Box>
                        <Box mt={2}>
                            <Button variant="contained" onClick={handleSubmit}>Submit</Button>
                        </Box>
                        {resultMessage && (
                            <Box mt={2}>
                                <Paper elevation={1} style={{ padding: 16 }}>
                                    <Typography variant="h5">Generated Code</Typography>
                                    <Typography variant="body1">{resultMessage.outputCode}</Typography>
                                    <Typography variant="h5">Test Results</Typography>
                                    <Typography variant="body1">{resultMessage.outputInfo}</Typography>
                                    {resultMessage.score !== undefined && (
                                        <Chip label={`Score: ${resultMessage.score} tests passed`} />
                                    )}
                                </Paper>
                            </Box>

                        )}
                        <Box mt={4}>
                            <Typography variant="h6">Previous Attempts for {email}</Typography>
                            {previousAttempts
                                .filter(attempt => attempt.questionId === id)
                                .map((attempt, index) => (
                                    <Box key={index} mt={2}>
                                        <Paper elevation={1} style={{ padding: 16 }}>
                                            <Typography variant="body2">
                                                <strong>Previous Attempt:</strong> {formatTimestamp(attempt.timestamp)}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Prompt:</strong> {attempt.prompt}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Generated Code:</strong> {attempt.functionCode}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Rationale:</strong> {attempt.rationale}
                                            </Typography>
                                            <Chip label={`Score: ${attempt.result.passed} / ${attempt.result.total}`} />
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