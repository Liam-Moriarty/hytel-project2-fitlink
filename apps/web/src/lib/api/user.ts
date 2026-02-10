/* eslint-disable @typescript-eslint/no-explicit-any */
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { UserData } from '@/interface'

export const getFullUser = async (uid: string): Promise<UserData | null> => {
  const userRef = doc(db, 'users', uid)
  const userSnap = await getDoc(userRef)

  if (!userSnap.exists()) return null

  const userData = userSnap.data()

  // Only attempt to fetch goals if they are a Trainee
  // (Or just fetch anyway—if it's not there, it returns null)
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
    createdAt: new Date(),
  })
}

export const createTrainerProfile = async (userId: string, data: any) => {
  await setDoc(doc(db, 'trainers', userId), {
    userId,
    ...data,
    createdAt: new Date(),
  })
}
