import { h } from './dom.js';
import { storageScreen } from './screens/storage.js';
import { statusScreen } from './screens/offline-status.js';
import { exploreScreen, tokyoScreen, destinationScreen } from './screens/explore.js';
import { homeScreen } from './screens/home.js';
import { journalScreen, achievementsScreen } from './screens/journal.js';
import { meScreen } from './screens/me.js';
import { learnScreen, summaryScreen } from './screens/learn.js';
import { lessonScreen } from './screens/lesson.js';
import { reviewScreen, activityScreen, questScreen, drillScreen } from './screens/practice.js';
import { speakScreen } from './screens/speak.js';
import { jlptHubScreen, jlptLevelScreen, mockStartScreen, readinessScreen, plannerScreen } from './screens/jlpt.js';
import { examScreen } from './screens/exam.js';
import { kanaScreen } from './screens/kana.js';
import { libraryScreen, kanjiScreen } from './screens/library.js';
import { settingsScreen, audioSettingsScreen } from './screens/settings.js';
import { backupScreen } from './screens/backup.js';
import { tourScreen, contentStatusScreen, privacyScreen, aboutScreen, creditsScreen } from './screens/info.js';

export const routes = [
  { pattern: '/', title: 'Home', render: homeScreen, scene: 'current' },
  { pattern: '/explore', title: 'Explore Japan', render: exploreScreen, scene: 'explicit' },
  { pattern: '/tokyo', title: 'Tokyo area', render: tokyoScreen, scene: 'explicit' },
  { pattern: '/dest/:id', title: 'Destination', render: destinationScreen, scene: 'explicit' },
  { pattern: '/journal', title: 'Stamp book', render: journalScreen, scene: 'explicit' },
  { pattern: '/achievements', title: 'Achievements', render: achievementsScreen, scene: 'explicit' },
  { pattern: '/me', title: 'Me', render: meScreen },
  { pattern: '/learn', title: 'Learn', render: learnScreen, scene: 'current' },
  { pattern: '/summary', title: 'Today is done', render: summaryScreen },
  { pattern: '/lesson/:id', title: 'Lesson', render: lessonScreen, immersive: true },
  { pattern: '/review', title: 'Review', render: reviewScreen, immersive: true },
  { pattern: '/activity/:kind/:id', title: 'Practice', render: activityScreen, immersive: true },
  { pattern: '/quest/:id', title: 'Quest', render: questScreen, immersive: true },
  { pattern: '/drill/:type', title: 'Practice', render: drillScreen, immersive: true },
  { pattern: '/speak', title: 'Speaking practice', render: speakScreen },
  { pattern: '/jlpt', title: 'JLPT area', render: jlptHubScreen },
  { pattern: '/jlpt/:level', title: 'JLPT level', render: jlptLevelScreen },
  { pattern: '/mock/:id', title: 'Mock exam', render: mockStartScreen },
  { pattern: '/exam', title: 'Exam', render: examScreen, immersive: true },
  { pattern: '/readiness', title: 'Readiness', render: readinessScreen },
  { pattern: '/planner', title: 'Exam-date planner', render: plannerScreen },
  { pattern: '/kana', title: 'Kana trainer', render: kanaScreen },
  { pattern: '/library', title: 'Library', render: libraryScreen },
  { pattern: '/kanji/:id', title: 'Kanji', render: kanjiScreen },
  { pattern: '/settings', title: 'Settings', render: settingsScreen },
  { pattern: '/audio', title: 'Sound and voice', render: audioSettingsScreen },
  { pattern: '/backup', title: 'Backup and restore', render: backupScreen },
  { pattern: '/storage', title: 'Storage health', render: storageScreen },
  { pattern: '/status', title: 'Offline status', render: statusScreen },
  { pattern: '/content', title: 'Content status', render: contentStatusScreen },
  { pattern: '/privacy', title: 'Privacy', render: privacyScreen },
  { pattern: '/about', title: 'About and limitations', render: aboutScreen },
  { pattern: '/credits', title: 'Credits and licences', render: creditsScreen },
  { pattern: '/tour', title: 'Welcome', render: tourScreen },
  { pattern: '/__notfound__', title: 'Not found', render: () => h('p', null, 'Page not found. ', h('a', { href: '#/' }, 'Back to start')) },
];
