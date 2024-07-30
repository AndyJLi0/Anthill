import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, AppBar, Toolbar, Typography, Box, LinearProgress, Avatar } from '@mui/material';
import { auth, db } from '../FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';


import { useEmail } from './EmailContext';

const questions = [
    { id: 1, title: 'Question 1', difficulty: 'Easy', score: 'Incomplete' },
    { id: 2, title: 'Question 2', difficulty: 'Easy', score: 'Incomplete' },
    { id: 3, title: 'Question 3', difficulty: 'Easy', score: 'Incomplete' },
    { id: 4, title: 'Question 4', difficulty: 'Medium', score: 'Incomplete' },
    { id: 5, title: 'Question 5', difficulty: 'Medium', score: 'Incomplete' },
    { id: 6, title: 'Question 6', difficulty: 'Medium', score: 'Incomplete' },
    { id: 7, title: 'Question 7', difficulty: 'Hard', score: 'Incomplete' },
    { id: 8, title: 'Question 8', difficulty: 'Hard', score: 'Incomplete' },  
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

    const { email } = useEmail();
    const navigate = useNavigate();

    const [questionScores, setQuestionScores] = useState(questions);

    const handleLogout = () => {
        auth.signOut().then(() => {
            navigate('/');
        }).catch((err) => {
            console.error(err);
        });
    };

    useEffect(() => {
        const fetchTestResults = async () => {
            try {
                if (!email) {
                    console.error("Email is null or undefined");
                    return;
                }

                const userDocRef = doc(db, 'users', email);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    const logs = userData.logs || [];

                    const updatedQuestions = questions.map((question) => {
                        let highestScore = null;

                        logs.forEach(log => {
                            if (Number(log.questionId) === Number(question.id)) {
                                if (!highestScore || log.result.passed > highestScore.passed) {
                                    highestScore = log.result;
                                }
                            }
                        });

                        const score = highestScore ? `${highestScore.passed}/${highestScore.total}` : 'Incomplete';
                        // console.log(`new score: ${score} for question ${question.id}`);
                        return { ...question, score };
                    });

                    setQuestionScores(updatedQuestions);
                } else {
                    console.log("no such document!");
                }
            } catch (error) {
                console.error("Error fetching test results: ", error);
            }
        };

        fetchTestResults();
    }, [email, window.location]);

    return (
        <Container>
            <AppBar position="static" color="default">
                <Toolbar>
                    <Avatar alt="User Picture" src="/static/images/avatar/1.jpg" /> {/* Placeholder for user picture */}
                    <Typography variant="h6" style={{ flexGrow: 1, marginLeft: 16 }}>
                        Anthill {email}
                    </Typography>
                    <Button color="inherit" onClick={handleLogout}>Logout</Button>
                </Toolbar>
            </AppBar>
            <Box my={4}>
                <Typography variant="h6">Overall Progress</Typography>
                <LinearProgress variant="determinate" value={questionScores.filter(q => q.score !== 'Incomplete').length / questions.length * 100} />
                <Typography variant="body2" color="textSecondary">{questionScores.filter(q => q.score !== 'Incomplete').length}/{questions.length}</Typography>
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
                        {questionScores.map((question) => (
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