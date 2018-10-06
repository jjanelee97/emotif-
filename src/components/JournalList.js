// Component for the list view of all the past journal entries that the user inputted
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { List, Card, Modal, Button, Icon } from 'antd';
import Header from './Header';
import './journalList.css';

import { receiveEntries } from '../actions';

// a key for all the emotions and their + or - connotations
const emotions = {
  anger: 'negative',
  fear: 'negative',
  joy: 'positive',
  confident: 'positive',
  sadness: 'sad',
  analytical: 'neutral',
  tentative: 'neutral',
  empty: 'empty',
};

class JournalList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      title: '',
      description: '',
    };

    this.showModal = this.showModal.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  // load all entries before rendering
  componentDidMount() {
    if (this.props.auth.user) {
      this.props.receiveEntries(this.props.auth.user.uid);
    }
  }

  showModal(title, description) {
    this.setState({
      visible: true,
      title,
      description,
    });
  }
  // hide modal if user presses ok or cancel
  handleOk(e) {
    this.setState({
      visible: false,
    });
  }
  handleCancel(e) {
    this.setState({
      visible: false,
    });
  }

  render() {
    if (this.props.entries.length === 0) {
      return (
        <div>
          <Header />
          <div className="journal-list-body">
            <Icon className="loader" type="loading" />
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <Header />
          <div className="journal-list-body">
            <Button className="add-entry-button" type="primary" shape="circle" icon="plus" onClick={() => this.props.history.push('/journal-editor')} />
            <div className="journal-list">
              <List
                grid={{ gutter: 0, column: 1 }}
                dataSource={this.props.entries}
                renderItem={(item) => {
                console.log(item);
                let styling;
                if (emotions[item.emotion] === 'positive') {
                  styling = { backgroundColor: `rgba(125, 202, 135, ${(Math.round(item.score * 10) / 10)})` };
                } else if (emotions[item.emotion] === 'negative') {
                  styling = { backgroundColor: `rgba(253, 117, 118, ${(Math.round(item.score * 10) / 10)})` };
                } else if (emotions[item.emotion] === 'sad') {
                  styling = { backgroundColor: `rgba(77, 184, 222, ${(Math.round(item.score * 10) / 10)})` };
                } else if (emotions[item.emotion] === 'neutral') {
                  styling = { backgroundColor: `rgba(254, 200, 93, ${(Math.round(item.score * 10) / 10)}` };
                } else {
                  styling = {};
                }

                return (
                  <List.Item>
                    <Card
                      className="card"
                      style={styling}
                      onClick={() => { this.showModal(item.title, item.description); }}
                      title={item.title}
                    >
                      <div className="word-wrap">{item.description}</div>
                    </Card>
                  </List.Item>
                );
              }}
              />
              <Modal
                title={this.state.title}
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                className="modal"
                footer={[
                  <Button type="primary" key="back" onClick={this.handleCancel}>Close</Button>,
              ]}
              >
                <div className="word-wrap">{this.state.description}</div>
              </Modal>
            </div>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = state => (
  {
    entries: state.journal.entries,
    auth: state.auth,
  }
);

export default withRouter(connect(mapStateToProps, { receiveEntries })(JournalList));
