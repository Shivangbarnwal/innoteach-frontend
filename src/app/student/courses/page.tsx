'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Box, Button, Container, Typography, List, ListItem } from '@mui/material';
import styles from "./courses.module.css";

export default function StudentCoursesPage() {
  const [publishedCourses, setPublishedCourses] = useState<any[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);

  const loadPublished = async () => {
    try {
      const data = await api('/api/courses');
      setPublishedCourses(data.courses || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadEnrolled = async () => {
    try {
      const data = await api('/api/courses/enrolled');
      setEnrolledCourses(data.courses || []);
    } catch (err) {
      console.error(err);
    }
  };

  const enroll = async (id: string) => {
    try {
      await api(`/api/courses/${id}/enroll`, { method: 'POST' });
      loadEnrolled();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadPublished();
    loadEnrolled();
  }, []);

  return (
    <Container className={styles.page} maxWidth={false} disableGutters>
      {/* Available Courses */}
      <Typography variant="h4" component="h1" className={styles.sectionTitle} mt={4} mb={2}>
        <b>AVAILABLE COURSES</b>
        
        
      </Typography>
      <List>
        {publishedCourses.map(course => (
          <ListItem key={course._id} className={styles.courseCard}>
            <Box className={styles.courseText}>
              <div className={styles.courseTitle}>
                {course.title} by {course.teacher?.name || 'Unknown'}
              </div>
              <div className={styles.courseDescription}>
                {course.description}
              </div>
            </Box>
            <Button
              className={styles.enrollButton}
              onClick={() => enroll(course._id)}
              disabled={enrolledCourses.some(c => c._id === course._id)}
            >
              {enrolledCourses.some(c => c._id === course._id) ? 'Enrolled' : 'Enroll'}
            </Button>
          </ListItem>
        ))}
      </List>

      {/* Enrolled Courses */}
      <Typography variant="h4" component="h1" className={styles.sectionTitle} mt={6} mb={2}>
        <b>MY ENROLLED COURSES</b>
        
      </Typography>
      <List>
        {enrolledCourses.map(course => (
          <ListItem key={course._id} className={styles.courseCard}>
            <Box className={styles.courseText}>
              <div className={styles.courseTitle}>{course.title}</div>
              <div className={styles.courseDescription}>{course.description}</div>
            </Box>
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
