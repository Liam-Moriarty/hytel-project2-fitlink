/* eslint-disable @typescript-eslint/no-explicit-any */
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { UserData } from '@/interface'

export const userKeys = {
  all: ['user'] as const,
  detail: (uid: string) => ['user', uid] as const,
} as const

export const getFullUser = async (uid: string): Promise<UserData | null> => {
  const userRef = doc(db, 'users', uid)
  const userSnap = await getDoc(userRef)

  if (!userSnap.exists()) return null

  const userData = userSnap.data()

  let traineeData = null

  if (userData.role === 'trainee') {
    const goalsRef = doc(db, 'traineeGoals', uid)
    const goalsSnap = await getDoc(goalsRef)
    traineeData = goalsSnap.exists() ? goalsSnap.data() : null
  }

  return {
    ...userData,
    traineeGoals: traineeData,
  } as UserData & { traineeGoals: any }
}

export const updateUser = async (uid: string, data: Partial<UserData>) => {
  const docRef = doc(db, 'users', uid)
  await updateDoc(docRef, data)
}

export const createTraineeGoals = async (userId: string, data: any) => {
  await setDoc(doc(db, 'traineeGoals', userId), {
    userId,
    ...data,
    completedWorkouts: [], // Initialize empty completed workouts
    completedMeals: [], // Initialize empty completed meals
    createdAt: new Date(),
  })
}

export const updateTraineeGoals = async (userId: string, data: any) => {
  const docRef = doc(db, 'traineeGoals', userId)
  await updateDoc(docRef, data)
}

export const createTrainerProfile = async (userId: string, data: any) => {
  await setDoc(doc(db, 'trainers', userId), {
    userId,
    ...data,
    createdAt: new Date(),
  })
}
