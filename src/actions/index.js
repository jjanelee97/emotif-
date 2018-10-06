import firebase from 'firebase';
import axios from 'axios';

// all of the action types in the app
export const ActionTypes = {
  AUTH_USER: 'AUTH_USER',
  DEAUTH_USER: 'DEAUTH_USER',
  AUTH_ERROR: 'AUTH_ERROR',
  SUBMIT_ENTRY: 'SUBMIT_ENTRY',
  RECEIVE_ENTRIES: 'RECEIVE_ENTRIES',
  ANALYZE_ENTRY: 'ANALYZE_ENTRY',
};


export function autoSignIn(history) {
  // const user = firebase.auth().currentUser;
  return (dispatch) => {
    const user = firebase.auth().currentUser;
    dispatch({ type: ActionTypes.AUTH_USER, payload: { user } });

    // firebase.database().ref(`users/${user.uid}`).set({
    //   username: 'hiii',
    //   dictionary: { someValue: 21 },
    // });
    //

    history.push('/');
  };
}

export function signinUser(email, password, history) {
  return (dispatch) => {
    firebase.auth().signInWithEmailAndPassword(email, password).then((result) => {
      console.log('logging out');
      dispatch({ type: ActionTypes.AUTH_USER, payload: { user: result } });
      history.push('/');
    }).catch((error) => {
      firebase.auth().createUserWithEmailAndPassword(email, password).then((result) => {
        dispatch({ type: ActionTypes.AUTH_USER, payload: { user: result } });

        const newPostKey = Date.now();
        firebase.database().ref(`users/${result.uid}/entries/${newPostKey}`).set({
          description: 'Welcome.  This is your place to talk.  Enjoy.',
          title: 'Your First Journal Entry',
          emotion: 'empty',
          keyword: '',
          score: 0,
        });

        firebase.database().ref(`users/${result.uid}/dictionary`).set({
          dogs: {
            instances: 0,
            netEmotion: 0,
          },
        });

        history.push('/');
      }).catch((newError) => {
        console.log(newError);
      });
    });
  };


  // takes in an object with email and password (minimal user object)
  // returns a thunk method that takes dispatch as an argument (just like our create post method really)
  // does an axios.post on the /signin endpoint
  // on success does:
  //  dispatch({ type: ActionTypes.AUTH_USER });
  //  localStorage.setItem('token', response.data.token);
  // on error should dispatch(authError(`Sign In Failed: ${error.response.data}`));
}


export function signupUser({ email, password }, history) {
  // takes in an object with email and password (minimal user object)
  // returns a thunk method that takes dispatch as an argument (just like our create post method really)
  // does an axios.post on the /signup endpoint (only difference from above)
  // on success does:
  //  dispatch({ type: ActionTypes.AUTH_USER });
  //  localStorage.setItem('token', response.data.token);
  // on error should dispatch(authError(`Sign Up Failed: ${error.response.data}`));
}


// deletes token from localstorage
// and deauths
export function signoutUser(history) {
  return (dispatch) => {
    firebase.auth().signOut().then(() => {
      dispatch({ type: ActionTypes.DEAUTH_USER });
      history.push('/');
    }).catch((error) => {
      alert(error);
    });
  };
}

// trigger to deauth if there is error
// can also use in your error reducer if you have one to display an error message
export function authError(error) {
  return {
    type: ActionTypes.AUTH_ERROR,
    message: error,
  };
}

// loads all entries from firebase
export function receiveEntries(userId) {
  return (dispatch) => {
    firebase.database().ref(`/users/${userId}`).once('value').then((snapshot) => {
      dispatch({ type: ActionTypes.RECEIVE_ENTRIES, payload: snapshot.toJSON() });
    });
  };
}

// algorithm for analyzing each sentence in the entry using Tone Analyzer API and
// submitEntry action below
export function analyzeEntry(userId, toneJSON) {
  // get tone analysis
  return (dispatch) => {
    for (let i = 0; i < toneJSON.sentences_tone.length; i += 1) {
      const sentenceObj = toneJSON.sentences_tone[i];
      const sentence = { lookup_text: sentenceObj.text };
      // call NLU API to get keyword with each sentence we feed it
      axios.post('https://emotif-server.herokuapp.com/api/watson_nlu', sentence).then((response) => {
        if (response.data.keywords.length !== 0) {
          for (let j = 0; j < response.data.keywords.length; j += 1) {
            firebase.database().ref(`users/${userId}/dictionary/`).once('value', (data) => {
              if (response.data.keywords[j].text in data.val()) {
                let addValue = 0;
                // if positive, netEmotion is higher
                // if negative, netEmotion is lower
                if (response.data.keywords[j].sentiment.label === 'positive') {
                  addValue = 1;
                } else if (response.data.keywords[j].sentiment.label === 'negative') {
                  addValue = -1;
                }
                const total = data.val()[response.data.keywords[j].text].instances + 1;
                const totalEmotion = data.val()[response.data.keywords[j].text].netEmotion + addValue;
                firebase.database().ref(`users/${userId}/dictionary/${response.data.keywords[j].text}`).set({
                  instances: total,
                  netEmotion: totalEmotion,
                });
              } else {
                let addValue = 0;
                if (response.data.keywords[j].sentiment.label === 'positive') {
                  addValue = 1;
                } else if (response.data.keywords[j].sentiment.label === 'negative') {
                  addValue = -1;
                }
                firebase.database().ref(`users/${userId}/dictionary/${response.data.keywords[j].text}`).set({
                  instances: 1,
                  netEmotion: addValue,
                });
              }
            });
          }
        }
      })
        .catch((error) => {
          console.log(error);
        });
    }
  };
}

export function submitEntry(userId, title, entry, history) {
  return (dispatch) => {
    console.log(entry);
    // const newPostKey = firebase.database().ref().child('posts').push().key;
    const newPostKey = Date.now();

    const data = { lookup_text: entry };
    axios.post('https://emotif-server.herokuapp.com/api/nlu_and_tone', data).then((response) => {
      dispatch(analyzeEntry(userId, response.data.tone));
      // dominantScore starts off as 0
      let dominantScore = 0;
      let dominantEmotion = '';
      // for each dominant tone in the whole entry
      for (let i = 0; i < response.data.tone.document_tone.tones.length; i += 1) {
        // set dominantEmotion and Score to the most dominant one in the object
        if (dominantScore < response.data.tone.document_tone.tones[i].score) {
          dominantEmotion = response.data.tone.document_tone.tones[i].tone_id;
          dominantScore = response.data.tone.document_tone.tones[i].score;
        }
      }

      // push all information in entry to firebase
      firebase.database().ref(`users/${userId}/entries/${newPostKey}`).set({
        description: entry,
        title,
        emotion: dominantEmotion,
        score: dominantScore,
        keyword: response.data.nluData.keywords[0].text,
      });

      dispatch({ type: ActionTypes.SUBMIT_ENTRY, payload: { entry: { title, description: entry } } });
      history.push('/');
    });
  };
}
