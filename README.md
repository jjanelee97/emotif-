# EMOTIF - CS89

![journaling](./img/journal.jpg)
![with_watson](./img/with-watson.png)

Emotif is a web app that uses Watson's Natural Language Understanding API and Tone Analyzer API together to comprehend, analyze, and contextualize a user's personal journal entry.  The app will create personalized prompts for the user after the first journal entry based on the contents of past journal entries.  

For example, if Samantha speaks a lot about her corgi making in a happy context, the journal might prompt the user to write more about why this particular corgi makes her feel that particular way.  

If she wrote about her grandpa unexpectedly getting sick and her family being worried the previous day, the journal might prompt her to flush out her sad feelings, delving deeper into how this affects her.   

Emotif strives to help users understand their emotions in a deeper way that normal journals couldn't using cognitive computing.  

**We are in the process of extending our service further to include the user's spotify information from their account.  The top 10 songs on their spotify at the time when they were writing the entry and this will be stored in the `entries` database.  This information will be used later on to recommend songs that the user was feeling with similar emotions.**

## Members
* Allison Chuang
* Benjamin Cooper
* Jane Lee

*Special thanks to CS89 and Professor Palmer!*


## References
Libraries in use:
* [Ant Design](https://ant.design/) - A library for our User Interface

APIs in use:
* [Watson Tone Analyzer API](https://www.ibm.com/watson/services/tone-analyzer/)
  - Tone Analyzer
    - INPUT:
      - full entry
    - OUTPUT:
      - JSON with document level AND sentence level

* [Watson Natural Language Understanding API](https://www.ibm.com/watson/services/natural-language-understanding/)
  - NLU
    - INPUT:
      - sentence
    - OUTPUT:
      - JSON

* [Spotify API](https://developer.spotify.com/web-api/)

## Algorithm
The algorithm can be seen in code in out `./src/actions/index.js` file under the `analyzeEntry` function and `submitEntry` function.  
1. Tone analyzer API returns sentence_tone.json, with each sentence parsed our in each object.  Each sentence is then run through the Natural Language Understanding API, which returns a prominent keyword and a sentiment (either 'positive' or 'negative').  If the keyword is not already in the dictionary, it is stored with instance: 1 and netEmotion: 1 if positive or -1 if negative.  Else, it will add 1 to the instance and add/subtract to the netEmotion to the object already in the dictionary.
2. Tone Analyzer also returns document_tone.json, which we take the most dominant emotion by its highest score and store it in the firebase under the `entries` entity.
3. Frontend uses the dominant emotion tag to color the journal entry box:
  - Red - Angry, Fear
  - Yellow - Tentative, Analytical
  - Green - Joy, Confident
  - Blue - Sadness
4. The app picks a unique prompt, customized to the information it has from previous entries (either using the dictionary or a previous entry), where it will link the most prominent keyword to the dominant emotion and ask you to expand on it, using Watson's cognitive computing power.

## Frontend Structure
We are using React and Node.js to build the front end application.  Currently this app is not deployed, so please:
`git clone https://github.com/BenjaminKCooper/emotif`

`cd emotif`

`yarn`

`yarn start`

and then run `local:8080` on your chrome browser to see the application.  

## Backend Structure
We are using an Express server that talks to the Watson API endpoints and a Firebase database for our backend.  

The database currently stores each user as a separate entity (with authentication) and each user has an entity of journal entries and a personal dictionary that gets smarter about the user with more inputted entries.  The dictionary accumulates more and more keywords over time and has an updated netEmotion with every keyword detected.  

For example, if "Hawaii" was spoken about 5 times since the beginning, 4 times in a positive manner and 1 time in a negative manner, the netEmotion would be 3 (4-1=3).  A positive number indicates a net positive emotion to that keyword.  

Backend Structure:
```js

{
  entries:  {
    [
      {
        description: <STRING>,
        emotion: <STRING>,
        keyword: <STRING,
        score: <FLOAT>,
        title:  <DATETIME>
      }
    ]
  },
  dictionary: {
    [
      <KEYWORD>:{
        instances: INTEGER,
        netEmotion: INTEGER,
      }
      ...
      },
      ...
    ]


  }
}

```

## Journal Prompts
* `I noticed you've been thinking a lot about ${this.props.entries[array].keyword}.  Want to talk about how ${this.props.entries[array].keyword} makes you feel ${this.props.entries[array].emotion}?`

* `Has ${this.props.entries[array].keyword} made you feel ${this.props.entries[array].emotion}?  Would you like to expand?`

* `You have mentioned ${this.state.wordFromDictionary} about ${this.state.objFromDictionary.instances} now.  Can you tell me why ${this.state.wordFromDictionary} makes you feel ${(this.state.objFromDictionary.instances > 0) ? 'happy' : 'sad'}?`

* `What about ${this.props.entries[array].keyword} makes you feel ${this.props.entries[array].emotion}?`


* `You seem to feel ${this.props.entries[array].emotion} about ${this.props.entries[array].keyword}.  Could you talk more about it?`,

* `You have talked about ${this.state.wordFromDictionary} ${this.state.objFromDictionary.instances} times this week.  Would you like to discuss why ${this.state.wordFromDictionary} makes you feel so ${(this.state.objFromDictionary.instances > 0) ? 'happy' : 'sad'}?`
