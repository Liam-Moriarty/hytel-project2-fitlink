import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'

export interface UserData {
  uid: string
  email: string | null
  displayName: string | null
  role?: 'trainee' | 'trainer'
  gender?: string
  age?: number
  height?: number
  weight?: number
  activityLevel?: string
  profilePicUrl?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createdAt: any
}

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createTraineeGoals = async (userId: string, data: any) => {
  await setDoc(doc(db, 'traineeGoals', userId), {
    userId,
    ...data,
    createdAt: new Date(),
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createTrainerProfile = async (userId: string, data: any) => {
  await setDoc(doc(db, 'trainers', userId), {
    userId,
    ...data,
    createdAt: new Date(),
  })
}
