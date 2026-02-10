/* eslint-disable @typescript-eslint/no-explicit-any */
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { UserData } from '@/interface'

export const getUser = async (uid: string): Promise<UserData | null> => {
  const docRef = doc(db, 'users', uid)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return docSnap.data() as UserData
  } else {
    return null
  }
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
