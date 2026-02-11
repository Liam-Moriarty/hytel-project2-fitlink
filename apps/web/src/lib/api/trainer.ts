import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore'
import { db } from '../firebase'
import { TrainerProfile, UserData } from '@/interface'

export const getTrainerProfile = async (trainerId: string): Promise<TrainerProfile | null> => {
  const trainerRef = doc(db, 'trainers', trainerId)
  const trainerSnap = await getDoc(trainerRef)

  if (!trainerSnap.exists()) return null
  return trainerSnap.data() as TrainerProfile
}

export const getUserByEmail = async (
  email: string
): Promise<{ user: UserData | null; exists: boolean }> => {
  const usersRef = collection(db, 'users')

  // First check if any user with this email exists
  const allUsersQuery = query(usersRef, where('email', '==', email))
  const allUsersSnapshot = await getDocs(allUsersQuery)

  if (allUsersSnapshot.empty) {
    return { user: null, exists: false }
  }

  // User exists — check if they are a trainee
  const userData = allUsersSnapshot.docs[0].data() as UserData
  if (userData.role !== 'trainee') {
    return { user: null, exists: true }
  }

  return { user: userData, exists: true }
}

export const getTrainerClients = async (traineeIds: string[]): Promise<UserData[]> => {
  if (traineeIds.length === 0) return []

  const clients: UserData[] = []

  for (const id of traineeIds) {
    const userRef = doc(db, 'users', id)
    const userSnap = await getDoc(userRef)
    if (userSnap.exists()) {
      clients.push(userSnap.data() as UserData)
    }
  }

  return clients
}

export const addTraineeToTrainer = async (trainerId: string, traineeId: string) => {
  const trainerRef = doc(db, 'trainers', trainerId)
  await updateDoc(trainerRef, {
    traineeIds: arrayUnion(traineeId),
  })
}

export const removeTraineeFromTrainer = async (trainerId: string, traineeId: string) => {
  const trainerRef = doc(db, 'trainers', trainerId)
  await updateDoc(trainerRef, {
    traineeIds: arrayRemove(traineeId),
  })
}

export const updateTrainerProfile = async (
  trainerId: string,
  data: Partial<Pick<TrainerProfile, 'availability' | 'certifications' | 'specialties'>>
) => {
  const trainerRef = doc(db, 'trainers', trainerId)
  await updateDoc(trainerRef, data)
}
