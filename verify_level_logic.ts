import { LEVEL_SYSTEM } from './constants';

function getCurrentLevelInfo(streak: number) {
    let currentLevel = { id: 0, title: 'Novice', minStreak: 0 };
    let nextLevel = LEVEL_SYSTEM[0];

    for (let i = 0; i < LEVEL_SYSTEM.length; i++) {
        if (streak >= LEVEL_SYSTEM[i].minStreak) {
            currentLevel = LEVEL_SYSTEM[i];
            nextLevel = LEVEL_SYSTEM[i + 1] || null;
        } else {
            nextLevel = LEVEL_SYSTEM[i];
            break;
        }
    }

    let progress = 0;
    let daysRemaining = 0;

    if (nextLevel) {
        const range = nextLevel.minStreak - currentLevel.minStreak;
        const currentProgress = streak - currentLevel.minStreak;
        progress = Math.min(100, Math.max(0, (currentProgress / range) * 100));
        daysRemaining = nextLevel.minStreak - streak;
    } else {
        progress = 100;
        daysRemaining = 0;
    }

    return { currentLevel, nextLevel, progress, daysRemaining };
}

function checkLevelUp(oldStreak: number, newStreak: number) {
    if (newStreak <= oldStreak) return null;
    const newLevel = getCurrentLevelInfo(newStreak).currentLevel;
    const oldLevel = getCurrentLevelInfo(oldStreak).currentLevel;
    if (newLevel.id > oldLevel.id) return newLevel;
    return null;
}

// Tests
console.log('--- TEST 1: Streak 5 (Novice) ---');
console.log(getCurrentLevelInfo(5));

console.log('\n--- TEST 2: Streak 7 (Seeker) ---');
console.log(getCurrentLevelInfo(7));

console.log('\n--- TEST 3: Level Up Detection (6 -> 7) ---');
console.log('Got Level Up:', checkLevelUp(6, 7)?.title || 'No');

console.log('\n--- TEST 4: Progress Calculation (0 -> 7, current 3) ---');
console.log(getCurrentLevelInfo(3).progress + '%');

console.log('\n--- TEST 5: Progress Calculation (7 -> 15, current 11) ---');
console.log(getCurrentLevelInfo(11).progress + '%'); // Should be 50%

console.log('\n--- TEST 6: Max Level (Streak 65) ---');
console.log(getCurrentLevelInfo(65));
