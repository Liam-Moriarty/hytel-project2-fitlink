import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { LoginFormValues, SignupFormValues } from '../schemas/auth'

export const signUpWithEmail = async (data: SignupFormValues) => {
  const { email, password, name } = data

  // 1. Create User in Firebase Auth
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  const user = userCredential.user

  // 2. Update Display Name
  await updateProfile(user, {
    displayName: name,
  })

  // 3. Create User Document in Firestore
  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    email: user.email,
    displayName: name,
    createdAt: new Date(),
  })

  return user
}

export const signInWithEmail = async (data: LoginFormValues) => {
  const { email, password } = data
  const userCredential = await signInWithEmailAndPassword(auth, email, password)
  return userCredential.user
}

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({
    prompt: 'select_account',
  })
  const result = await signInWithPopup(auth, provider)
  const user = result.user

  // Check if user document exists, if not create it
  const userDocRef = doc(db, 'users', user.uid)
  const userDoc = await getDoc(userDocRef)

  if (!userDoc.exists()) {
    await setDoc(userDocRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      createdAt: new Date(),
    })
  }

  return user
}

export const logout = async () => {
  await signOut(auth)
}
