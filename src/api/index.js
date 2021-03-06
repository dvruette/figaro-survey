import { initializeApp } from "firebase/app"
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage"
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  serverTimestamp,
  query, 
  orderBy, 
  limit
} from "firebase/firestore"

const NODE_ENV = import.meta.env.MODE

const firebaseConfig = {
  apiKey: "AIzaSyC-xjJ4qKSI0mIZOlnR3e5OJ_qLfVQoVSw",
  authDomain: "symbolic-music.firebaseapp.com",
  projectId: "symbolic-music",
  storageBucket: "symbolic-music.appspot.com",
  messagingSenderId: "436089531739",
  appId: "1:436089531739:web:3b2cd77562ad31c2647e7e"
}

const app = initializeApp(firebaseConfig)
const storage = getStorage()
const db = getFirestore()

async function getSamplesList(key) {
  const listRef = ref(storage, `samples/${key}`)
  const res = await listAll(listRef).catch((error) => {
    console.log(error)
    return []
  })

  return res.items.map((itemRef) => itemRef.fullPath)
}
export { getSamplesList as getSamplesList }


async function getSample(path) {
  return await getDownloadURL(ref(storage, path)).catch((error) => {
    console.log(error)
    return ''
  })
}
export { getSample as getSample }

async function uploadAnswer(answer) {
  return await addDoc(collection(db, 'answers'), {
    ...answer,
    environment: NODE_ENV,
    uid: localStorage['uid'],
    created: serverTimestamp()
  }).catch(error => {
    console.log(error)
    return null
  })
}
export { uploadAnswer as uploadAnswer }

async function downloadAnswers() {
  if (import.meta.env.MODE == 'development') {
    const q = query(collection(db, 'answers'), orderBy('created'), limit(10_000))
    const querySnapshot = await getDocs(q)
    const answers = []
    querySnapshot.forEach(doc => answers.push(doc.data()))
    return answers
  }
}
export { downloadAnswers as downloadAnswers }


export default {
  app, getSamplesList, getSample, uploadAnswer, downloadAnswers
}