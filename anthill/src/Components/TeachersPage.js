import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../FirebaseConfig';
import { collection, query, getDocs } from 'firebase/firestore';
import { Box, Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress } from '@mui/material';

const TeachersPage = ({ user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ questions: [], overallAverage: '--' });

  useEffect(() => {
    fetchData();
  }, [user.email]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef);
      const querySnapshot = await getDocs(q);

      let allLogs = [];
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData.key === user.email) {
          allLogs = allLogs.concat(userData.logs || []);
        }
      });

      const questionStats = calculateStats(allLogs);
      const overallAverage = calculateOverallAverage(questionStats);

      setData({
        questions: questionStats,
        overallAverage: overallAverage
      });
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (logs) => {
    const questionMap = new Map();

    // Initialize all 8 questions with default values
    for (let i = 1; i <= 8; i++) {
      questionMap.set(i.toString(), []);
    }

    logs.forEach(log => {
      if (questionMap.has(log.questionId)) {
        questionMap.get(log.questionId).push(log.result.passed / log.result.total);
      }
    });

    return Array.from(questionMap, ([id, scores]) => ({
      id,
      median: scores.length > 0 ? calculateMedian(scores) : '--',
      average: scores.length > 0 ? calculateAverage(scores) : '--'
    })).sort((a, b) => parseInt(a.id) - parseInt(b.id));
  };

  const calculateMedian = (arr) => {
    const sorted = arr.slice().sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) {
      return ((sorted[middle - 1] + sorted[middle]) / 2) * 100;
    }
    return sorted[middle] * 100;
  };

  const calculateAverage = (arr) => {
    const sum = arr.reduce((a, b) => a + b, 0);
    return (sum / arr.length) * 100;
  };

  const calculateOverallAverage = (questions) => {
    const validQuestions = questions.filter(q => q.average !== '--');
    if (validQuestions.length === 0) return '--';
    const sum = validQuestions.reduce((acc, q) => acc + q.average, 0);
    return sum / validQuestions.length;
  };

  const handleLogout = () => {
    auth.signOut().then(() => {
      navigate('/');
    }).catch((err) => {
      console.error(err);
    });
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {user.email}'s Dashboard
        </Typography>
        <Button 
          variant="contained" 
          color="secondary" 
          onClick={handleLogout}
          sx={{ mb: 2 }}
        >
          Logout
        </Button>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Questions</TableCell>
                <TableCell align="right">Median</TableCell>
                <TableCell align="right">Average</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.questions.map((question) => (
                <TableRow key={question.id}>
                  <TableCell component="th" scope="row">
                    Question {question.id}
                  </TableCell>
                  <TableCell align="right">
                    {question.median === '--' ? '--' : `${question.median.toFixed(2)}%`}
                  </TableCell>
                  <TableCell align="right">
                    {question.average === '--' ? '--' : `${question.average.toFixed(2)}%`}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell component="th" scope="row" colSpan={2}>
                  Overall Average
                </TableCell>
                <TableCell align="right">
                  {data.overallAverage === '--' ? '--' : `${data.overallAverage.toFixed(2)}%`}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default TeachersPage;