import { Button, Container, Stack, Table, Title, Text, Box } from "@mantine/core";
import { useState, useEffect } from "react";
import Header from "../Components/Header";
import { useAuth } from "../AuthContext/index";
import { getAllReports, getGameByID, getCommentByReference } from "../Utility/DatabaseReadUtil";
import { deleteGame, deleteReport, deleteComment } from "../Utility/DatabaseDeleteUtil";
import { Link } from 'react-router-dom';
import { IconTrash } from '@tabler/icons-react';

function Admin() {
  const { currentUser } = useAuth();
  const [reportedGames, setReportedGames] = useState<{ gameID: string, name: string, comment: string, reportID: string }[]>([]);
  const [reportedReviews, setreportedReviews] = useState<{ commentID: string, review: string, comment: string, reportID: string, gameID: string }[]>([]);

  useEffect(() => {
    // Fetch reported games when the component mounts
    fetchReportedGames();
    fetchReportedReviews();
  }, []);

  const fetchReportedGames = async () => {
    try {
      const reports = await getAllReports();
      const validReports = reports.filter(report => report.gameID !== undefined);
      const gamesWithDetails = await Promise.all(
        validReports.map(async (report) => {
          const game = await getGameByID(report.gameID);
          return { gameID: report.gameID, name: game?.name || "Unknown", comment: report.comment, reportID: report.reportID };
        })
      );
      setReportedGames(gamesWithDetails);
    } catch (error) {
      console.error("Error fetching reported games:", error);
    }
  };

  const fetchReportedReviews = async () => {
    try {
      const reports = await getAllReports();
      const validReports = reports.filter(report => report.commentid !== undefined);
      const reviewsWithDetails = await Promise.all(
        validReports.map(async (report) => {
          const review = await getCommentByReference(report.commentid);
          return { commentID: review.author.id, review: review.text, comment: report.reportText, reportID: report.reportID, gameID: review.gameID };
        })
      );
      setreportedReviews(reviewsWithDetails);
    } catch (error) {
      console.error("Error fetching reported games:", error);
    }
  };

  const handleDeleteGame = async (gameID: string, reportID: string) => {
    try {
      const result = await deleteGame(gameID);
      console.log(result);
      const result2 = await deleteReport(reportID);
      console.log(result2);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting game:", error);
    }
  };

  const handleDeleteComment = async (uid: string, reportID: string, gameID: string,) => {
    try {
      console.log(uid, reportID, gameID)
      const result = await deleteComment(uid, gameID);
      console.log(result);
      const result2 = await deleteReport(reportID);
      console.log(result2);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting report:", error);
    }
  };

  const handleDeleteReport = async (reportID: string) => {
    try {
      const result = await deleteReport(reportID);
      console.log(result);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting report:", error);
    }
  };

  // Function to generate links with ID
  const generateLink = (id: string) => `/game/${id}`;

  return (
    <>
      <Header />
      <Container size="sm">
        {currentUser?.email == 'admin@icebreaker.com' ? (
          <Box>
            <Stack justify="center" align="center">
              <Title>Rapporterte leker</Title>
              {reportedGames.length > 0 ? (
                <Table
                  data={{
                    head: ['Navn', 'Rapportbegrunnelse', 'Slett lek', ''],
                    body: reportedGames.map(({ gameID, name, comment, reportID }) => (
                      [
                        <Link to={generateLink(gameID)}>{name}</Link>,
                        comment,
                        <Button color="#424874"><IconTrash key={gameID} onClick={() => handleDeleteGame(gameID, reportID)} /> </Button>,
                        <Text style={{ cursor: 'pointer', textDecoration: 'underline' }} color="#424874" onClick={() => handleDeleteReport(reportID)}>Ignorer rapport</Text>
                      ]
                    )),
                  }}
                />
              ) : (
                <Text>Ingen rapporterte leker</Text>
              )}
            </Stack>
            <Stack pt={50} justify="center" align="center">
              <Title>Rapporterte vurderinger</Title>
              {reportedReviews.length > 0 ? (
                <Table
                  data={{
                    head: ['Vurdering', 'Rapportbegrunnelse', 'Slett vurdering', ''],
                    body: reportedReviews.map(({ commentID, review, comment, reportID, gameID }) => (
                      [
                        review,
                        comment,
                        <Button color="#424874"><IconTrash key={commentID} onClick={() => handleDeleteComment(commentID, reportID, gameID)} /> </Button>,
                        <Text style={{ cursor: 'pointer', textDecoration: 'underline' }} color="#424874" onClick={() => handleDeleteReport(reportID)}>Ignorer rapport</Text>
                      ]
                    )),
                  }}
                />
              ) : (
                <Text>Ingen rapporterte leker</Text>
              )}
            </Stack>
          </Box>) : <Stack style={{ textAlign: 'center' }} pt={50} align="center"><Title>Denne siden er kun tilgjengelig for ADMIN-brukere</Title></Stack>}
      </Container >
    </>
  );
}

export default Admin;
