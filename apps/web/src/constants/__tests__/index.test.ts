import { describe, it, expect } from 'vitest'
import { getAvatarColor, getAchievements } from '../index'

describe('getAvatarColor', () => {
  it('returns consistent color for the same email', () => {
    const color1 = getAvatarColor('alice@example.com')
    const color2 = getAvatarColor('alice@example.com')
    expect(color1).toEqual(color2)
  })

  it('returns object with bg and text properties', () => {
    const color = getAvatarColor('test@example.com')
    expect(color).toHaveProperty('bg')
    expect(color).toHaveProperty('text')
    expect(color.bg).toMatch(/^bg-\w+-400$/)
    expect(color.text).toBe('text-black')
  })

  it('returns different colors for emails starting with different characters', () => {
    const colorA = getAvatarColor('alice@example.com')
    const colorB = getAvatarColor('bob@example.com')
    // 'a' charCode=97, 'b' charCode=98 → different modulo 10
    expect(colorA.bg).not.toBe(colorB.bg)
  })

  it('handles empty string without throwing', () => {
    const color = getAvatarColor('')
    expect(color).toHaveProperty('bg')
    expect(color).toHaveProperty('text')
  })

  it('maps based on first character charCode modulo 10', () => {
    // 'a' has charCode 97, 97 % 10 = 7 → orange
    const color = getAvatarColor('alice@test.com')
    expect(color.bg).toBe('bg-orange-400')
  })
})

describe('getAchievements', () => {
  it('returns 9 achievements', () => {
    const achievements = getAchievements(0)
    expect(achievements).toHaveLength(9)
  })

  it('always has first 3 achievements active', () => {
    const achievements = getAchievements(0)
    expect(achievements[0].active).toBe(true)
    expect(achievements[1].active).toBe(true)
    expect(achievements[2].active).toBe(true)
  })

  it('has "20 Workouts" active when totalCompleted >= 20', () => {
    const achievements = getAchievements(20)
    const twenty = achievements.find(a => a.title === '20 Workouts')
    expect(twenty?.active).toBe(true)
  })

  it('has "20 Workouts" inactive when totalCompleted < 20', () => {
    const achievements = getAchievements(19)
    const twenty = achievements.find(a => a.title === '20 Workouts')
    expect(twenty?.active).toBe(false)
  })

  it('has "30 Workouts" active when totalCompleted >= 30', () => {
    const achievements = getAchievements(30)
    const thirty = achievements.find(a => a.title === '30 Workouts')
    expect(thirty?.active).toBe(true)
  })

  it('has "30 Workouts" inactive when totalCompleted < 30', () => {
    const achievements = getAchievements(29)
    const thirty = achievements.find(a => a.title === '30 Workouts')
    expect(thirty?.active).toBe(false)
  })

  it('has last 4 achievements always inactive (Month Streak, 50, 100, Consistency)', () => {
    const achievements = getAchievements(100)
    expect(achievements[5].active).toBe(false) // Month Streak
    expect(achievements[6].active).toBe(false) // 50 Workouts
    expect(achievements[7].active).toBe(false) // 100 Workouts
    expect(achievements[8].active).toBe(false) // Consistency
  })

  it('each achievement has required properties', () => {
    const achievements = getAchievements(0)
    for (const achievement of achievements) {
      expect(achievement).toHaveProperty('title')
      expect(achievement).toHaveProperty('desc')
      expect(achievement).toHaveProperty('icon')
      expect(achievement).toHaveProperty('color')
      expect(achievement).toHaveProperty('bg')
      expect(achievement).toHaveProperty('active')
    }
  })
})
