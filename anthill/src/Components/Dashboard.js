import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, AppBar, Toolbar, Typography, Box, LinearProgress, Avatar } from '@mui/material';
import { auth } from '../FirebaseConfig';

const questions = [
    { id: 1, title: 'Question 1', difficulty: 'Easy', score: '0/5' },
    { id: 2, title: 'Question 2', difficulty: 'Easy', score: '0/5' },
    { id: 3, title: 'Question 3', difficulty: 'Easy', score: '0/5' },
    { id: 4, title: 'Question 4', difficulty: 'Medium', score: '0/5' },
    { id: 5, title: 'Question 5', difficulty: 'Medium', score: '0/5' },
    { id: 6, title: 'Question 6', difficulty: 'Medium', score: '0/5' },
    { id: 7, title: 'Question 7', difficulty: 'Hard', score: '0/5' },
    { id: 8, title: 'Question 8', difficulty: 'Hard', score: '0/5' },
];

const getChipColor = (difficulty) => {
    switch (difficulty) {
        case 'Easy':
            return '#d9f7be'; // light green
        case 'Medium':
            return '#fff7e6'; // light yellow
        case 'Hard':
            return '#ffccc7'; // light red
        default:
            return 'default';
    }
};

const Dashboard = ({ user }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        auth.signOut().then(() => {
            navigate('/');
        }).catch((err) => {
            console.error(err);
        });
    };

    return (
        <Container>
            <AppBar position="static" color="default">
                <Toolbar>
                    <Avatar alt="User Picture" src="/static/images/avatar/1.jpg" /> {/* Placeholder for user picture */}
                    <Typography variant="h6" style={{ flexGrow: 1, marginLeft: 16 }}>
                        Anthill
                    </Typography>
                    <Button color="inherit" onClick={handleLogout}>Logout</Button>
                </Toolbar>
            </AppBar>
            <Box my={4}>
                <Typography variant="h6">Overall Progress</Typography>
                <LinearProgress variant="determinate" value={0} />
                <Typography variant="body2" color="textSecondary">0/8</Typography>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Question</TableCell>
                            <TableCell>Difficulty</TableCell>
                            <TableCell>Score</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {questions.map((question) => (
                            <TableRow key={question.id} hover onClick={() => navigate(`/question/${question.id}`)} style={{ cursor: 'pointer' }}>
                                <TableCell>{question.title}</TableCell>
                                <TableCell>
                                    <Typography style={{ backgroundColor: getChipColor(question.difficulty), borderRadius: '5px', padding: '5px 10px' }}>
                                        {question.difficulty}
                                    </Typography>
                                </TableCell>
                                <TableCell>{question.score}</TableCell>
                                <TableCell>
                                    <Button key={question.id} variant="contained" onClick={() => navigate(`/question/${question.id}`)}>View</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default Dashboard;