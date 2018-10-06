/*
Using Ant Design for the editor UI (https://ant.design/)
A component for writing a new entry
Rendering for when the user clicks the + button to input a new entry
*/

import React from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { withRouter } from 'react-router-dom';
import { Editor, EditorState, RichUtils, getDefaultKeyBinding } from 'draft-js';
import { Button, Icon } from 'antd';
import { submitEntry } from '../actions';
import Header from './Header';
import './richEditor.css';
import './draft.css';
import './draftOG.css';


const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
};

function getBlockStyle(block) {
  switch (block.getType()) {
    case 'blockquote': return 'RichEditor-blockquote';
    default: return null;
  }
}

// buttons of all the different customizations for the text input (ex. blockquote)
class StyleButton extends React.Component {
  constructor() {
    super();
    this.onToggle = (e) => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }
  render() {
    let className = 'RichEditor-styleButton';
    if (this.props.active) {
      className += ' RichEditor-activeButton';
    }
    return (
      <button className={className} onMouseDown={this.onToggle}>
        {this.props.label}
      </button>
    );
  }
}

const BLOCK_TYPES = [
  { label: 'H1', style: 'header-one' },
  { label: 'H2', style: 'header-two' },
  { label: 'H3', style: 'header-three' },
  { label: 'H4', style: 'header-four' },
  { label: 'H5', style: 'header-five' },
  { label: 'H6', style: 'header-six' },
  { label: 'Blockquote', style: 'blockquote' },
  { label: 'UL', style: 'unordered-list-item' },
  { label: 'OL', style: 'ordered-list-item' },
  { label: 'Code Block', style: 'code-block' },
];
const BlockStyleControls = (props) => {
  const { editorState } = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();
  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map(type =>
        (<StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />))}
    </div>
  );
};
const INLINE_STYLES = [
  { label: 'Bold', style: 'BOLD' },
  { label: 'Italic', style: 'ITALIC' },
  { label: 'Underline', style: 'UNDERLINE' },
  { label: 'Monospace', style: 'CODE' },
];
const InlineStyleControls = (props) => {
  const currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map(type =>
        (<StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />))}
    </div>
  );
};

// render for the full page
class RichEditorExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      promptNumber: Math.floor(Math.random() * 6),
    };
    this.focus = () => this.editor.focus();
    this.onChange = (editorState) => {
      this.setState({ editorState });
    };
    this.handleKeyCommand = this._handleKeyCommand.bind(this);
    this.mapKeyToEditorCommand = this._mapKeyToEditorCommand.bind(this);
    this.toggleBlockType = this._toggleBlockType.bind(this);
    this.toggleInlineStyle = this._toggleInlineStyle.bind(this);
    this.onTab = this.onTab.bind(this);
    this.renderPrompt = this.renderPrompt.bind(this);
  }


  componentWillMount() {
    // immutable map to sort dictionary in the backend by frequency of appearance (instances)
    console.log(this.props.dictionary);
    const test = Immutable.Map(this.props.dictionary).sort((a, b) => {
      if (a.instances < b.instances) { return -1; }
      if (a.instances > b.instances) { return 1; }
      if (a.instances === b.instances) { return 0; }
      return null;
    });
    let counter = 0;
    console.log(test.reverse().map((value, key) => {
      if (counter === 0) {
        console.log(`value${value}`);
        console.log(`key${key}`);
        this.setState({ objFromDictionary: value, wordFromDictionary: key });
      }
      counter += 1;
      return null;
    }));
  }

  onTab(e) {
    e.preventDefault();
    this.onChange(RichUtils.onTab(e, this.state.editorState, 4));
  }

  _handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }
  _mapKeyToEditorCommand(e) {
    switch (e.keyCode) {
      case 9: { // TAB
        e.preventDefault();
        this.onChange(RichUtils.onTab(e, this.state.editorState, 4));
        break;
      }
      default:
        break;
    }
    return getDefaultKeyBinding(e);
  }
  _toggleBlockType(blockType) {
    this.onChange(RichUtils.toggleBlockType(
      this.state.editorState,
      blockType,
    ));
  }
  _toggleInlineStyle(inlineStyle) {
    this.onChange(RichUtils.toggleInlineStyle(
      this.state.editorState,
      inlineStyle,
    ));
  }

  // creating the actual prompt that the user looks to for content guidance
  renderPrompt() {
    if (this.props.entries.length > 1) {
      const array = 0;
      // different prompts chosen by random and rendered for each new entry
      const prompts = [
        `I noticed you've been thinking a lot about ${this.props.entries[array].keyword}.  Want to talk about how ${this.props.entries[array].keyword} makes you feel ${this.props.entries[array].emotion}?`,
        `Has ${this.props.entries[array].keyword} made you feel ${this.props.entries[array].emotion}?  Would you like to expand?`,
        `You have mentioned ${this.state.wordFromDictionary} about ${this.state.objFromDictionary.instances} now.  Can you tell me why ${this.state.wordFromDictionary} makes you feel ${(this.state.objFromDictionary.instances > 0) ? 'happy' : 'sad'}?`,
        `What about ${this.props.entries[array].keyword} makes you feel ${this.props.entries[array].emotion}?`,
        `You seem to feel ${this.props.entries[array].emotion} about ${this.props.entries[array].keyword}.  Could you talk more about it?`,
        `You have talked about ${this.state.wordFromDictionary} ${this.state.objFromDictionary.instances} times this week.  Would you like to discuss why ${this.state.wordFromDictionary} makes you feel so ${(this.state.objFromDictionary.instances > 0) ? 'happy' : 'sad'}?`,
      ];
      return (<div className="prompt"><strong>{prompts[this.state.promptNumber]}</strong></div>);
    } else {
      return (<div />);
    }
  }

  render() {
    console.log(this.state.wordFromDictionary);
    console.log(this.state.objFromDictionary.instances);
    const { editorState } = this.state;
    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it.
    let className = 'RichEditor-editor';
    const contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        className += ' RichEditor-hidePlaceholder';
      }
    }
    const editorText = Immutable.fromJS(editorState.toJS().currentContent.blockMap);
    let entry = '';
    editorText.forEach((value) => { entry = `${entry}\n${value.get('text')}`; });

    // citing stackoverflow for DateTime help:
    // https://stackoverflow.com/questions/8888491/how-do-you-display-javascript-datetime-in-12-hour-am-pm-format
    const d = new Date();
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];

    let hours = d.getHours();
    let minutes = d.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours %= 12;
    hours = hours || 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    const strTime = `${hours}:${minutes} ${ampm}`;

    const date = `${monthNames[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} – ${strTime}`;

    return (
      <div>
        <Header />
        <div className="page">
          <Button type="primary" className="back-button" onClick={() => this.props.history.push('/')}>
            <Icon type="left" />Back to entries
          </Button>
          {this.renderPrompt()}
          <div className="editor-space">
            <div className="RichEditor-root">
              <BlockStyleControls
                editorState={editorState}
                onToggle={this.toggleBlockType}
              />
              <InlineStyleControls
                editorState={editorState}
                onToggle={this.toggleInlineStyle}
              />
              <div className={className}>
                <Editor
                  blockStyleFn={getBlockStyle}
                  customStyleMap={styleMap}
                  editorState={editorState}
                  onTab={this.onTab}
                  handleKeyCommand={this.handleKeyCommand}
                  keyBindingFn={this.mapKeyToEditorCommand}
                  onChange={this.onChange}
                  placeholder="Journal here..."
                  ref={(ref) => { this.editor = ref; }}
                  spellCheck
                />
              </div>
            </div>
            <Button className="submit-button" type="primary" onClick={() => this.props.submitEntry(this.props.auth.user.uid, date, entry.substring(1), this.props.history)}>Submit Entry</Button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => (
  {
    entries: state.journal.entries,
    dictionary: state.journal.dictionary,
    auth: state.auth,
  }
);

export default withRouter(connect(mapStateToProps, { submitEntry })(RichEditorExample));
