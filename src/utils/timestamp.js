import firebase from "firebase/compat/app";

const Timestamp = firebase.firestore.Timestamp;

const convertFirebaseTimestampToDate = (timestamp) => {
  if (timestamp instanceof Timestamp) {
    return new Timestamp(timestamp.seconds, timestamp.nanoseconds).toDate();
  }

  return timestamp;
};

export { convertFirebaseTimestampToDate };
