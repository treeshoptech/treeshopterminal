'use client';

import { useState, useEffect } from 'react';
import { Clock, Play, Square } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { TimeEntryCard } from '@/components/time/TimeEntryCard';
import styles from './page.module.css';

export default function TimeTrackerPage() {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [clockInTime, setClockInTime] = useState<number | null>(null);

  useEffect(() => {
    if (!isClockedIn || !clockInTime) return;

    const interval = setInterval(() => {
      setCurrentTime(Date.now() - clockInTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [isClockedIn, clockInTime]);

  const handleClockIn = () => {
    const now = Date.now();
    setClockInTime(now);
    setIsClockedIn(true);
    setCurrentTime(0);
    // TODO: Call Convex mutation
  };

  const handleClockOut = () => {
    setIsClockedIn(false);
    setClockInTime(null);
    setCurrentTime(0);
    // TODO: Call Convex mutation
  };

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const mockEntries = [
    {
      _id: '1',
      date: Date.now(),
      clockIn: Date.now() - 8 * 60 * 60 * 1000,
      clockOut: Date.now() - 30 * 60 * 1000,
      totalHours: 7.5,
      projectName: 'Smith Property - Forestry Mulching',
      approved: false,
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Time Tracker</h1>
      </div>

      <div className={styles.grid}>
        {/* Clock Card */}
        <Card className={styles.clockCard}>
          <CardContent>
            <div className={styles.clockDisplay}>
              <Clock className={styles.clockIcon} />
              <div className={styles.timeDisplay}>{formatTime(currentTime)}</div>
              <div className={styles.status}>
                {isClockedIn ? 'Clocked In' : 'Clocked Out'}
              </div>
            </div>

            <Button
              variant={isClockedIn ? 'danger' : 'primary'}
              size="lg"
              onClick={isClockedIn ? handleClockOut : handleClockIn}
              icon={isClockedIn ? <Square className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              className={styles.clockButton}
            >
              {isClockedIn ? 'Clock Out' : 'Clock In'}
            </Button>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <Card hover>
          <CardHeader>
            <CardTitle>Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.stat}>
              <div className={styles.statValue}>7.5 hrs</div>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardHeader>
            <CardTitle>This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.stat}>
              <div className={styles.statValue}>38.2 hrs</div>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardHeader>
            <CardTitle>This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.stat}>
              <div className={styles.statValue}>152 hrs</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Entries */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Recent Entries</h2>
        <div className={styles.entriesList}>
          {mockEntries.map((entry) => (
            <TimeEntryCard key={entry._id} entry={entry} />
          ))}
        </div>
      </div>
    </div>
  );
}
